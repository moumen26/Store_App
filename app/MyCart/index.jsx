import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import { PencilSquareIcon } from "react-native-heroicons/outline";
import CartRow from "../../components/CartRow";
import CommandeDetailsItem from "../../components/CommandeDetailsItem";
import OrderType from "../../components/OrderType";
import { useNavigation, useRoute } from "@react-navigation/native";
import EditCartScreen from "../screens/EditCartScreen";
import useAuthContext from "../hooks/useAuthContext";
import Config from "../config.jsx";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ConfirmationModal from "../../components/ConfirmationModal.jsx";
import Snackbar from "../../components/Snackbar.jsx";

const MyCartScreen = () => {
  const { cart, user, dispatch } = useAuthContext();
  const route = useRoute();
  const { storeId } = route.params;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const [snackbarKey, setSnackbarKey] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  //form
  const [total, setTotal] = useState(0);
  const [type, setType] = useState("");
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);

  const handleChangeType = (val) => {
    setType(val);
  };
  // Filter cart items for the current store
  const storeCart = useMemo(() => {
    return cart?.filter((item) => item.store === storeId) || [];
  }, [cart, storeId]);

  const renderProductItems = () => {
    return storeCart?.map((item, index) => (
      <CartRow
        key={item?.stock}
        ProductName={item?.product?.name}
        ProductBrand={item?.product?.brand}
        ProductQuantity={item?.quantity}
        ProductImage={item?.product?.image}
        BoxItems={item?.product?.boxItems}
      />
    ));
  };
  const renderDetailsItems = () => {
    return storeCart?.map((item, index) => (
      <CommandeDetailsItem
        key={item?.stock}
        ProductName={item?.product?.name}
        ProductPriceTotal={item?.price}
      />
    ));
  };

  useEffect(() => {
    const total =
      storeCart
        ?.reduce((total, item) => total + parseFloat(item?.price || 0), 0)
        .toFixed(2) || "0.00";
    setTotal(total);
  }, [storeCart]);

  //--------------------------------------------APIs--------------------------------------------
  const handleSubmitOrder = async () => {
    setSubmitionLoading(true);
    try {
      const response = await fetch(
        `${Config.API_URL}/Receipt/${user?.info?.id}/${storeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            store: storeId,
            type: type,
            products: storeCart.map((item) => ({
              stock: item.stock,
              quantity: item.quantity,
              price: item.unityPrice,
            })),
            total: total,
            deliveredLocation: storeCart[0]?.shippingAddress,
          }),
        }
      );

      const json = await response.json();
      if (!response.ok) {
        setSubmitionLoading(false);
        setSnackbarMessage(json.message);
        setSnackbarKey((prevKey) => prevKey + 1);
        return;
      } else {
        dispatch({
          type: "REMOVE_ALL_CART",
          payload: storeId,
        });
        setSubmitionLoading(false);
        setSnackbarMessage(json.message);
        setSnackbarKey((prevKey) => prevKey + 1);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitionLoading(false);
      setConfirmationModalVisible(false);
    }
  };

  const openConfirmationModal = () => {
    setConfirmationModalVisible(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalVisible(false);
  };

  return (
    <SafeAreaView className="bg-white pt-3 relative h-full">
      {snackbarKey !== 0 && (
        <Snackbar
          key={snackbarKey}
          message={snackbarMessage}
          duration={2000}
          actionText="Close"
          backgroundColor="#FF0000"
          textColor="white"
          actionTextColor="yellow"
        />
      )}
      {!submitionLoading ? (
        <>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 0,
              paddingBottom: 95,
            }}
            vertical
            showsHorizontalScrollIndicator={false}
          >
            <View className="mx-5 mb-[20] flex-row items-center justify-between">
              <BackButton />
              <Text className="text-center" style={styles.titleScreen}>
                My Cart
              </Text>
              <View style={styles.Vide}></View>
            </View>
            <View className="mx-5 flex-row justify-between items-center">
              <Text style={styles.titleCategory}>Order Details</Text>
              {storeCart?.length > 0 && (
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <PencilSquareIcon size={24} color="#26667E" />
                </TouchableOpacity>
              )}
            </View>
            <View className="mt-[12]" style={styles.container}>
              <ScrollView className="mx-5" showsVerticalScrollIndicator={false}>
                {storeCart?.length > 0 ? (
                  renderProductItems()
                ) : (
                  <View style={styles.containerNoAvailable}>
                    <Text style={styles.noText}>No product is available</Text>
                  </View>
                )}
              </ScrollView>
            </View>
            {storeCart?.length > 0 ? (
              <View
                className="h-fit max-h-[23%] mx-5 mt-[12] pr-2 pl-2 pt-[12] pb-[12] flex-col space-y-2"
                style={styles.commandeContainer}
              >
                <Text style={styles.sousTitre}>Default Price</Text>
                <View style={styles.defaultPriceScroll}>
                  {renderDetailsItems()}
                </View>
                <View
                  style={styles.subTotalContainer}
                  className="flex-row items-center justify-between w-full pt-[12]"
                >
                  <Text style={styles.sousTitre}>Sub total</Text>
                  <Text style={styles.sousTitre}>DA {total}</Text>
                </View>
              </View>
            ) : (
              <></>
            )}
            <View className="mx-5 flex-col mt-[12]">
              <Text className="mb-[12]" style={styles.titleCategory}>
                Order Type
              </Text>
              <OrderType
                storeId={storeId}
                storeCart={storeCart}
                handleChangeType={handleChangeType}
                navigation={navigation}
              />
            </View>
          </ScrollView>
          <View
            className="bg-white w-full h-[80px] absolute left-0 bottom-0 flex-row items-center justify-around pb-3"
            style={styles.navigationClass}
          >
            <TouchableOpacity
              style={styles.loginButton}
              onPress={openConfirmationModal}
            >
              <Text style={styles.loginButtonText}>Place Order</Text>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalView}>
              <EditCartScreen
                data={storeCart}
                storeId={storeId}
                onClose={() => setModalVisible(false)}
              />
            </View>
          </Modal>

          <ConfirmationModal
            visible={confirmationModalVisible}
            onCancel={closeConfirmationModal}
            onConfirm={handleSubmitOrder}
            modalTitle="Order Confirmation"
            modalSubTitle="Make sure all information is correct before finalizing"
          />
        </>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#FF033E" />
          <Text style={styles.loadingText}>
            Please wait till the request is being processed...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  defaultPriceScroll: {
    gap: 2,
  },
  noText: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
  loginButton: {
    backgroundColor: "#26667E",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 340,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  navigationClass: {
    borderColor: "#888888",
    borderWidth: 0.5,
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  commandeContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F7F7F7",
    gap: 3,
  },
  subTotalContainer: {
    borderTopWidth: 1,
    borderColor: "#F7F7F7",
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
  sousTitre: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  Vide: {
    width: 40,
    height: 40,
  },
  container: {
    flexGrow: 1,
    flexDirection: "column",
    minHeight: hp(32),
    height: "fit-content",
  },
  containerNoAvailable: {
    height: hp(45),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-centre",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(201, 228, 238, 0.7)",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(201, 228, 238, 0.7)",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  confirmationModal: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: wp(80),
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Montserrat-Bold",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    padding: 10,
    width: 120,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#26667E",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalButtonTextColor: {
    color: "#26667E",
    fontSize: 16,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#FF033E",
  },
});

export default MyCartScreen;
