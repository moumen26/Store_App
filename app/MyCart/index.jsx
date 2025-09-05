import React, { useState, useMemo, useCallback, memo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
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
import { formatNumber } from "../util/useFullFunctions.jsx";

const MyCartScreen = () => {
  const { cart, user, dispatch } = useAuthContext();
  const route = useRoute();
  const { storeId, storeAddress } = route.params;
  const navigation = useNavigation();

  // Get screen dimensions
  const { width, height } = useWindowDimensions();

  // Calculate responsive values
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Responsive spacing calculations
  const horizontalPadding = width * 0.05;
  const verticalSpacing = height * 0.025;
  const smallSpacing = height * 0.01;

  // Additional responsive values
  const buttonHeight = Math.max(45, height * 0.06);
  const buttonWidth = isLargeScreen ? width * 0.6 : width * 0.85;
  const bottomBarHeight = isSmallScreen ? 70 : 80;
  const iconSize = isSmallScreen ? 20 : 24;

  const [modalVisible, setModalVisible] = useState(false);
  const [snackbarKey, setSnackbarKey] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [type, setType] = useState("");
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);

  // Filter cart items for the current store
  const storeCart = useMemo(
    () => cart?.filter((item) => item.store === storeId) || [],
    [cart, storeId]
  );

  // Calculate total price
  const calculateTotal = useCallback(() => {
    const total = storeCart
      .reduce((acc, item) => acc + parseFloat(item?.price || 0), 0)
      .toFixed(2);
    setTotal(total);
  }, [storeCart]);

  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

  // Refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      calculateTotal();
      return () => {};
    }, [calculateTotal])
  );

  // Handle order submission
  const handleSubmitOrder = useCallback(async () => {
    setSubmitionLoading(true);
    setConfirmationModalVisible(false);
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
  const renderProductItems = useCallback(
    () =>
      storeCart.map((item) => (
        <CartRow
          key={item?.stock}
          ProductName={item?.product?.name}
          ProductBrand={item?.product?.brand}
          ProductQuantity={item?.quantity}
          ProductImage={item?.product?.image}
          BoxItems={item?.product?.boxItems}
        />
      )),
    [storeCart]
  );

  // Render details items
  const renderDetailsItems = useCallback(
    () =>
      storeCart.map((item) => (
        <CommandeDetailsItem
          key={item?.stock}
          ProductName={item?.product?.name}
          ProductPriceTotal={item?.price}
        />
      )),
    [storeCart]
  );

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
          <Text
            style={[
              styles.loadingText,
              {
                fontSize: isSmallScreen ? 13 : 14,
                marginTop: smallSpacing,
              },
            ]}
          >
            Veuillez patienter pendant le traitement de votre demande...
          </Text>
        </View>
      ) : (
        <>
          <View
            style={[
              styles.contentContainer,
              {
                marginHorizontal: horizontalPadding,
                flex: 1,
              },
            ]}
          >
            <ScrollView
              contentContainerStyle={{
                paddingBottom: bottomBarHeight,
                flexGrow: 1,
              }}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
            >
              <View style={[styles.header, { marginBottom: verticalSpacing }]}>
                <BackButton />
                <Text
                  style={[
                    styles.titleScreen,
                    {
                      fontSize: isSmallScreen ? 18 : isLargeScreen ? 24 : 20,
                    },
                  ]}
                >
                  Mon Panier
                </Text>
                <View
                  style={[
                    styles.emptyView,
                    {
                      width: isSmallScreen ? 32 : 40,
                      height: isSmallScreen ? 32 : 40,
                    },
                  ]}
                />
              </View>

              <View style={styles.orderDetailsHeader}>
                <Text
                  style={[
                    styles.titleCategory,
                    {
                      fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18,
                      marginBottom: smallSpacing,
                    },
                  ]}
                >
                  Détails de la Commande
                </Text>
                {storeCart.length > 0 && (
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <PencilSquareIcon size={iconSize} color="#19213D" />
                  </TouchableOpacity>
                )}
              </View>

              <View
                style={[
                  styles.productListContainer,
                  {
                    marginTop: smallSpacing,
                    minHeight: height * 0.4,
                    flex: 1,
                  },
                ]}
              >
                {storeCart.length > 0 ? (
                  renderProductItems()
                ) : (
                  <View style={styles.noProductContainer}>
                    <Text style={styles.noText}>Aucun produit disponible</Text>
                  </View>
                )}
              </View>

              {storeCart.length > 0 && (
                <View
                  style={[
                    styles.commandeContainer,
                    {
                      marginTop: verticalSpacing,
                      paddingVertical: verticalSpacing / 2,
                      gap: smallSpacing / 2,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.sousTitre,
                      {
                        fontSize: isSmallScreen ? 11 : 12,
                      },
                    ]}
                  >
                    Prix par défaut
                  </Text>
                  <View
                    style={[
                      styles.defaultPriceScroll,
                      {
                        gap: isSmallScreen ? 2 : 4,
                        paddingBottom: smallSpacing,
                      },
                    ]}
                  >
                    {renderDetailsItems()}
                  </View>
                  <View
                    style={[
                      styles.subTotalContainer,
                      {
                        paddingTop: smallSpacing * 1.2,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sousTitre,
                        {
                          fontSize: isSmallScreen ? 11 : 12,
                        },
                      ]}
                    >
                      Sous-total
                    </Text>
                    <Text
                      style={[
                        styles.sousTitre,
                        {
                          fontSize: isSmallScreen ? 11 : 12,
                        },
                      ]}
                    >
                      DA {formatNumber(total)}
                    </Text>
                  </View>
                </View>
              )}

              <View
                style={[
                  styles.orderTypeContainer,
                  {
                    marginTop: verticalSpacing,
                    marginBottom: bottomBarHeight + 20,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.titleCategory,
                    {
                      fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18,
                      marginBottom: smallSpacing,
                    },
                  ]}
                >
                  Type de commande
                </Text>
                <OrderType
                  storeId={storeId}
                  storeCart={storeCart}
                  handleChangeType={setType}
                  navigation={navigation}
                  storeAddress={storeAddress}
                />
              </View>
            </ScrollView>
          </View>

          <View
            className="bg-white w-full h-[80px] absolute left-0 bottom-0 flex-row items-center justify-around pb-3"
            style={styles.navigationClass}
          >
            <TouchableOpacity
              style={[
                styles.orderButton,
                {
                  height: buttonHeight,
                  width: buttonWidth,
                },
              ]}
              onPress={() => setConfirmationModalVisible(true)}
            >
              <Text
                style={[
                  styles.orderButtonText,
                  {
                    fontSize: isSmallScreen ? 14 : 16,
                  },
                ]}
              >
                Passer la commande
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        style={styles.modalViewZindex}
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
        modalTitle="Confirmation de commande"
        modalSubTitle="Assurez-vous que toutes les informations sont correctes avant de finaliser"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 10 : 3,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleScreen: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  emptyView: {
    // Dimensions set dynamically
  },
  orderDetailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleCategory: {
    fontFamily: "Montserrat-Regular",
  },
  productListContainer: {
    justifyContent: "flex-start",
    flexGrow: 1, // Added flexGrow to expand the container
  },
  noProductContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 150,
  },
  noText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
  commandeContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F7F7F7",
  },
  defaultPriceScroll: {
    // Gap set dynamically
  },
  subTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#F7F7F7",
  },
  sousTitre: {
    fontFamily: "Montserrat-Regular",
  },
  orderTypeContainer: {
    // Margin bottom set dynamically
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderColor: "#888888",
    borderWidth: 0.5,
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    zIndex: 10,
  },
  navigationClass: {
    borderColor: "#888888",
    borderWidth: 0.5,
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  orderButton: {
    backgroundColor: "#19213D",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 340,
  },
  orderButtonText: {
    color: "#fff",
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
    fontFamily: "Montserrat-Regular",
    color: "#FF033E",
  },
});

export default memo(MyCartScreen);
