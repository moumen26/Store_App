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
  Animated,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import BackButton from "../../components/BackButton";
import {
  PencilSquareIcon,
  ShoppingCartIcon,
} from "react-native-heroicons/outline";
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

const LoadingOverlay = ({ isSmallScreen }) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotate animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.loadingOverlay}>
      <View style={styles.loadingCard}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: pulseAnim }, { rotate }],
            },
          ]}
        >
          <ShoppingCartIcon size={isSmallScreen ? 40 : 50} color="#19213D" />
        </Animated.View>
        <Text
          style={[styles.loadingTitle, { fontSize: isSmallScreen ? 16 : 18 }]}
        >
          Traitement en cours
        </Text>
        <Text
          style={[
            styles.loadingSubtitle,
            { fontSize: isSmallScreen ? 12 : 14 },
          ]}
        >
          Votre commande est en cours de traitement...
        </Text>
        <ActivityIndicator
          size="large"
          color="#19213D"
          style={{ marginTop: 20 }}
        />
      </View>
    </View>
  );
};

const MyCartScreen = () => {
  const { cart, user, dispatch } = useAuthContext();
  const route = useRoute();
  const { storeId, storeAddress } = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
  const bottomBarHeight =
    Platform.OS === "android"
      ? (isSmallScreen ? 40 : 50) + insets.bottom
      : isSmallScreen
      ? 70
      : 80;
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
        style={[
          styles.navigationClass,
          {
            height: bottomBarHeight,
            paddingBottom: Platform.OS === "android" ? insets.bottom / 1.5 : 0,
          },
        ]}
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

      {submitionLoading && <LoadingOverlay isSmallScreen={isSmallScreen} />}

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
    flexGrow: 1,
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
  navigationClass: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
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
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  loadingCard: {
    backgroundColor: "white",
    padding: 30,
    alignItems: "center",
    minWidth: 280,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E3EFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loadingTitle: {
    fontFamily: "Montserrat-Medium",
    color: "#19213D",
    marginBottom: 8,
    textAlign: "center",
  },
  loadingSubtitle: {
    fontFamily: "Montserrat-Regular",
    color: "#888888",
    textAlign: "center",
  },
});

export default memo(MyCartScreen);
