import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CartRow from "../../components/CartRow";
import ScanButton from "../../components/ScanButton";
import BackButton from "../../components/BackButton";
import OrderStatus from "../../components/OrderStatus";
import Snackbar from "../../components/Snackbar.jsx";
import useAuthContext from "../hooks/useAuthContext.jsx";
import { useNavigation, useRoute } from "@react-navigation/native";
import Config from "../config.jsx";
import SubmitOrderModal from "../../components/SubmitOrderModal.jsx";
import SubmitOderModalReason from "../../components/SubmitOderModalReason.jsx";

const TrackOrder = () => {
  const navigation = useNavigation();
  const { user } = useAuthContext();
  const route = useRoute();
  const { 
    recieptData,
    OrderDataRefetch
  } = route.params;
  const [snackbarKey, setSnackbarKey] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [scanedData, setScanedData] = useState({ type: null, data: null });
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [notAllConfirmationModalVisible, setNotAllConfirmationModalVisible] = useState(false);
  const [reason, setReason] = useState(""); 

  const handleOpenNotAllConfirmationModal = () => {
    setConfirmationModalVisible(false);
    setNotAllConfirmationModalVisible(true);
  };

  const handleCloseNotAllConfirmationModal = () => {
    setScanedData({ type: null, data: null });
    setNotAllConfirmationModalVisible(false); 
  };
  const handleScanComplete = async (val) => {
    setSubmitionLoading(true);
    
    try {
      // Check if the scanned barcode matches
      if (scanedData?.data != recieptData.reciept._id) {
        setSnackbarType("error");
        setSnackbarMessage("The scanned barcode does not match the receipt you are tracking");
        setSnackbarKey((prevKey) => prevKey + 1);
        setSubmitionLoading(false);
        return;
      }

      const response = await fetch(
        `${Config.API_URL}/Receipt/validate/${user?.info?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            reciept: scanedData?.data,
            status: val,
            raison: reason
          }),
        }
      );

      const json = await response.json();
      
      if (!response.ok) {
        setSnackbarType("error");
        setSnackbarMessage(json.message);
        setSnackbarKey((prevKey) => prevKey + 1);
        return;
      }
      navigation.goBack();
      OrderDataRefetch();
      setSnackbarType("success");
      setSnackbarMessage(json.message);
      setSnackbarKey((prevKey) => prevKey + 1);
    } catch (err) {
      console.error(err);
      setSnackbarType("error");
      setSnackbarMessage("An error occurred while submitting the receipt validation");
      setSnackbarKey((prevKey) => prevKey + 1);
    } finally {
      setSubmitionLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.header}>
            <BackButton />
            <Text style={styles.titleScreen}>Track Order</Text>
            {!(recieptData?.reciept?.status == 10 && recieptData?.reciept?.delivered == true) ?
              <ScanButton onScanComplete={({ type, data }) => {
                setScanedData({ type, data });
                setConfirmationModalVisible(true)
              }} />
              :
              <View></View>
            }
            
          </View>
        }
        ListFooterComponent={
          <View className="mx-5">
            <View style={styles.commandeContainer}>
              <Text style={styles.titleCategory}>Order Details</Text>
              <View className="flex-row items-center justify-between w-full">
                <Text style={styles.text}>Order Id</Text>
                <Text style={styles.textDescription}>{recieptData?.reciept?._id}</Text>
              </View>
              <View className="flex-row items-center justify-between w-full">
                <Text style={styles.text}>Expected Delivery Date</Text>
                {recieptData?.reciept?.expextedDeliveryDate ? (
                  <Text style={styles.textDescription}>
                    {recieptData?.reciept?.expextedDeliveryDate}
                  </Text>
                ) : (
                  <Text style={styles.textDescription}>not available yet</Text>
                )}
              </View>
              <View className="flex-row items-center justify-between w-full">
                <Text style={styles.text}>Remaining Amount</Text>
                {recieptData?.reciept?.total ? (
                  <Text style={styles.textDescription}>
                    {(recieptData?.reciept?.total - recieptData?.reciept?.payment.reduce((sum, pay) => sum + pay.amount, 0)).toFixed(2)} DA
                  </Text>
                ) : (
                  <Text style={styles.textDescription}>not available yet</Text>
                )}
              </View>
            </View>
            <View style={styles.OrderStatus}>
              <Text style={styles.titleCategory}>Order Status</Text>
              <OrderStatus
                type={recieptData?.reciept?.type}
                status={recieptData?.reciept?.status}
              />
            </View>
          </View>
        }
      />
      <SubmitOrderModal
        visible={confirmationModalVisible}
        onCancel={handleOpenNotAllConfirmationModal}
        modalTitle="Submit Order Confirmation"
        modalSubTitle="Do you want to submit all the scanned orders now?"
        onConfirm={() => handleScanComplete(3)}
        isloading={submitionLoading}
      />

      <SubmitOderModalReason
        visible={notAllConfirmationModalVisible}
        onCancel={handleCloseNotAllConfirmationModal}
        modalTitle="Partial Submission"
        modalSubTitle="Are you sure you don't want to submit all orders?"
        onConfirm={() => handleScanComplete(4)}
        isloading={submitionLoading}
        setReason={setReason}
        reason={reason}
      />
      {snackbarKey !== 0 && (
        <Snackbar
          key={snackbarKey}
          message={snackbarMessage}
          duration={2000}
          snackbarType={snackbarType}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 10,
    paddingBottom: 10,
  },
  OrderStatus: {
    marginTop: 20,
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
    marginBottom: 10,
  },
  commandeContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "column",
    gap: 4,
    borderColor: "#F7F7F7",
  },
  text: {
    fontSize: 11,
    color: "#888888",
    fontFamily: "Montserrat-Regular",
  },
  textDescription: {
    fontSize: 11,
    fontFamily: "Montserrat-Medium",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
  },
  containerNoAvailable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  noText: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
  navigationClass: {
    borderTopColor: "#888888",
    borderTopWidth: 0.5,
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 20,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#26667E",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
});

export default TrackOrder;
