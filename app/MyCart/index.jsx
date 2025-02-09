import React, { useState, useMemo, useCallback, memo, useEffect } from "react";
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
import Snackbar from "../../components/Snackbar.jsx";
import ConfirmationModal from "../../components/ConfirmationModal.jsx";

const MyCartScreen = () => {
  const { cart, user, dispatch } = useAuthContext();
  const route = useRoute();
  const { storeId } = route.params;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [snackbarKey, setSnackbarKey] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [type, setType] = useState("");
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);

  // Filter cart items for the current store
  const storeCart = useMemo(() => cart?.filter((item) => item.store === storeId) || [], [cart, storeId]);

  // Calculate total price
  const calculateTotal = useCallback(() => {
    const total = storeCart.reduce((acc, item) => acc + parseFloat(item?.price || 0), 0).toFixed(2);
    setTotal(total);
  }, [storeCart]);

  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

  // Handle order submission
  const handleSubmitOrder = useCallback(async () => {
    setSubmitionLoading(true);
    try {
      const response = await fetch(`${Config.API_URL}/Receipt/${user?.info?.id}/${storeId}`, {
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
      });

      const json = await response.json();
      if (!response.ok) {
        setSnackbarType("error");
        setSnackbarMessage(json.message);
        setSnackbarKey((prevKey) => prevKey + 1);
        return;
      }

      dispatch({ type: "REMOVE_ALL_CART", payload: storeId });
      navigation.navigate("E-Receipt/index", { OrderID: json?.OrderID });
    } catch (err) {
      setSnackbarType("error");
      setSnackbarMessage("An error occurred while submitting the order.");
      setSnackbarKey((prevKey) => prevKey + 1);
    } finally {
      setSubmitionLoading(false);
      setConfirmationModalVisible(false);
    }
  }, [storeCart, type, total, user, storeId, dispatch, navigation]);

  // Render product items
  const renderProductItems = useCallback(() => (
    storeCart.map((item) => (
      <CartRow
        key={item?.stock}
        ProductName={item?.product?.name}
        ProductBrand={item?.product?.brand}
        ProductQuantity={item?.quantity}
        ProductImage={item?.product?.image}
        BoxItems={item?.product?.boxItems}
      />
    ))
  ), [storeCart]);

  // Render details items
  const renderDetailsItems = useCallback(() => (
    storeCart.map((item) => (
      <CommandeDetailsItem
        key={item?.stock}
        ProductName={item?.product?.name}
        ProductPriceTotal={item?.price}
      />
    ))
  ), [storeCart]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {snackbarKey !== 0 && (
        <Snackbar
          key={snackbarKey}
          message={snackbarMessage}
          duration={2000}
          snackbarType={snackbarType}
        />
      )}
      {submitionLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF033E" />
          <Text style={styles.loadingText}>Please wait till the request is being processed...</Text>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.header}>
              <BackButton />
              <Text style={styles.titleScreen}>My Cart</Text>
              <View style={styles.emptyView} />
            </View>
            <View style={styles.orderDetailsHeader}>
              <Text style={styles.titleCategory}>Order Details</Text>
              {storeCart.length > 0 && (
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <PencilSquareIcon size={24} color="#26667E" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.productListContainer}>
              {storeCart.length > 0 ? (
                renderProductItems()
              ) : (
                <View style={styles.noProductContainer}>
                  <Text style={styles.noText}>No product is available</Text>
                </View>
              )}
            </View>
            {storeCart.length > 0 && (
              <View style={styles.commandeContainer}>
                <Text style={styles.sousTitre}>Default Price</Text>
                <View style={styles.defaultPriceScroll}>{renderDetailsItems()}</View>
                <View style={styles.subTotalContainer}>
                  <Text style={styles.sousTitre}>Sub total</Text>
                  <Text style={styles.sousTitre}>DA {total}</Text>
                </View>
              </View>
            )}
            <View style={styles.orderTypeContainer}>
              <Text style={styles.titleCategory}>Order Type</Text>
              <OrderType
                storeId={storeId}
                storeCart={storeCart}
                handleChangeType={setType}
                navigation={navigation}
              />
            </View>
          </ScrollView>
          <View style={styles.navigationClass}>
            <TouchableOpacity style={styles.loginButton} onPress={() => setConfirmationModalVisible(true)}>
              <Text style={styles.loginButtonText}>Place Order</Text>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
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
            onCancel={() => setConfirmationModalVisible(false)}
            onConfirm={handleSubmitOrder}
            modalTitle="Order Confirmation"
            modalSubTitle="Make sure all information is correct before finalizing"
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "white",
    paddingTop: 12,
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 95,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  emptyView: {
    width: 40,
    height: 40,
  },
  orderDetailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
  productListContainer: {
    marginTop: 12,
  },
  noProductContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  noText: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
  commandeContainer: {
    marginTop: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F7F7F7",
  },
  defaultPriceScroll: {
    gap: 2,
  },
  subTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#F7F7F7",
  },
  sousTitre: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  orderTypeContainer: {
    marginTop: 12,
  },
  navigationClass: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "white",
    borderTopWidth: 0.5,
    borderColor: "#888888",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 12,
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
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(201, 228, 238, 0.7)",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#FF033E",
  },
});

export default memo(MyCartScreen);