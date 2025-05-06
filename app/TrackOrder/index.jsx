import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
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
  const { recieptData, OrderDataRefetch } = route.params;
  const [snackbarKey, setSnackbarKey] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [scanedData, setScanedData] = useState({ type: null, data: null });
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [notAllConfirmationModalVisible, setNotAllConfirmationModalVisible] =
    useState(false);
  const [reason, setReason] = useState("");

  // Get screen dimensions
  const { width, height } = useWindowDimensions();

  // Calculate responsive values
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Responsive spacing calculations
  const horizontalPadding = width * 0.05;
  const verticalSpacing = height * 0.025;
  const sectionGap = isSmallScreen ? 16 : isLargeScreen ? 24 : 20;

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
        setSnackbarMessage(
          "Le code-barres scanné ne correspond pas au reçu que vous suivez"
        );
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
            raison: reason,
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
      setSnackbarMessage(
        "Une erreur s'est produite lors de la soumission de la validation du reçu"
      );
      setSnackbarKey((prevKey) => prevKey + 1);
    } finally {
      setSubmitionLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        ListHeaderComponent={
          <View
            style={[styles.header, { marginHorizontal: horizontalPadding }]}
          >
            <BackButton />
            <Text
              style={[
                styles.titleScreen,
                { fontSize: isSmallScreen ? 18 : isLargeScreen ? 24 : 20 },
              ]}
            >
              Suivi de commande
            </Text>
            {!(
              recieptData?.reciept?.status == 10 &&
              recieptData?.reciept?.delivered == true
            ) ? (
              <ScanButton
                onScanComplete={({ type, data }) => {
                  setScanedData({ type, data });
                  setConfirmationModalVisible(true);
                }}
              />
            ) : (
              <View style={{ width: 40, height: 40 }} />
            )}
          </View>
        }
        ListFooterComponent={
          <View style={{ marginHorizontal: horizontalPadding }}>
            <View
              style={[
                styles.commandeContainer,
                { gap: isSmallScreen ? 8 : 12 },
              ]}
            >
              <Text
                style={[
                  styles.titleCategory,
                  {
                    fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18,
                    marginBottom: isSmallScreen ? 8 : 10,
                  },
                ]}
              >
                Détails de la commande
              </Text>
              <View style={styles.detailRow}>
                <Text
                  style={[
                    styles.text,
                    { fontSize: isSmallScreen ? 10 : isLargeScreen ? 13 : 11 },
                  ]}
                >
                  ID de commande
                </Text>
                <Text
                  style={[
                    styles.textDescription,
                    { fontSize: isSmallScreen ? 10 : isLargeScreen ? 13 : 11 },
                  ]}
                >
                  {recieptData?.reciept?._id}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text
                  style={[
                    styles.text,
                    { fontSize: isSmallScreen ? 10 : isLargeScreen ? 13 : 11 },
                  ]}
                >
                  Date de livraison prévue
                </Text>
                {recieptData?.reciept?.expextedDeliveryDate ? (
                  <Text
                    style={[
                      styles.textDescription,
                      {
                        fontSize: isSmallScreen ? 10 : isLargeScreen ? 13 : 11,
                      },
                    ]}
                  >
                    {recieptData?.reciept?.expextedDeliveryDate}
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.textDescription,
                      {
                        fontSize: isSmallScreen ? 10 : isLargeScreen ? 13 : 11,
                      },
                    ]}
                  >
                    pas encore disponible
                  </Text>
                )}
              </View>
              <View style={styles.detailRow}>
                <Text
                  style={[
                    styles.text,
                    { fontSize: isSmallScreen ? 10 : isLargeScreen ? 13 : 11 },
                  ]}
                >
                  Montant restant
                </Text>
                {recieptData?.reciept?.total ? (
                  <Text
                    style={[
                      styles.textDescription,
                      {
                        fontSize: isSmallScreen ? 10 : isLargeScreen ? 13 : 11,
                      },
                    ]}
                  >
                    {(
                      recieptData?.reciept?.total -
                      recieptData?.reciept?.payment.reduce(
                        (sum, pay) => sum + pay.amount,
                        0
                      )
                    ).toFixed(2)}{" "}
                    DA
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.textDescription,
                      {
                        fontSize: isSmallScreen ? 10 : isLargeScreen ? 13 : 11,
                      },
                    ]}
                  >
                    pas encore disponible
                  </Text>
                )}
              </View>
            </View>
            <View style={[styles.OrderStatus, { marginTop: sectionGap }]}>
              <Text
                style={[
                  styles.titleCategory,
                  {
                    fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18,
                    marginBottom: isSmallScreen ? 8 : 10,
                  },
                ]}
              >
                État de la commande
              </Text>
              <OrderStatus
                type={recieptData?.reciept?.type}
                status={recieptData?.reciept?.status}
              />
            </View>
          </View>
        }
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
        }}
      />
      <SubmitOrderModal
        visible={confirmationModalVisible}
        onCancel={handleOpenNotAllConfirmationModal}
        modalTitle="Confirmation de soumission de commande"
        modalSubTitle="Voulez-vous soumettre toutes les commandes scannées maintenant?"
        onConfirm={() => handleScanComplete(3)}
        isloading={submitionLoading}
      />

      <SubmitOderModalReason
        visible={notAllConfirmationModalVisible}
        onCancel={handleCloseNotAllConfirmationModal}
        modalTitle="Soumission partielle"
        modalSubTitle="Êtes-vous sûr de ne pas vouloir soumettre toutes les commandes?"
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
    paddingTop: Platform.OS === "android" ? 10 : 0,
    paddingBottom: Platform.OS === "android" ? 10 : 0,
  },
  OrderStatus: {
    // Margin set dynamically
  },
  titleCategory: {
    fontFamily: "Montserrat-Regular",
  },
  commandeContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 10,
    flexDirection: "column",
    borderColor: "#F7F7F7",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  text: {
    color: "#888888",
    fontFamily: "Montserrat-Regular",
  },
  textDescription: {
    fontFamily: "Montserrat-Medium",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleScreen: {
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
    backgroundColor: "#63BBF5",
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
