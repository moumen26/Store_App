import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
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
import { formatTimestamp, formatNumber } from "../util/useFullFunctions.jsx";

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

  // Helper function to calculate returned products
  const getReturnedProducts = (orderStatusData) => {
    if (
      !orderStatusData ||
      !Array.isArray(orderStatusData) ||
      orderStatusData.length < 2
    ) {
      return [];
    }

    // Sort by date to get first and last entries
    const sortedData = [...orderStatusData].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const firstStatus = sortedData[0];
    const lastStatus = sortedData[sortedData.length - 1];

    const returnedProducts = [];

    // Compare products between first and last status
    firstStatus.products.forEach((firstProduct) => {
      const lastProduct = lastStatus.products.find(
        (p) => p.product._id === firstProduct.product._id
      );

      if (lastProduct && firstProduct.quantity > lastProduct.quantity) {
        const returnedQuantity = firstProduct.quantity - lastProduct.quantity;
        returnedProducts.push({
          ...firstProduct,
          returnedQuantity,
          originalQuantity: firstProduct.quantity,
          currentQuantity: lastProduct.quantity,
          returnedValue: returnedQuantity * firstProduct.price,
        });
      }
    });

    return returnedProducts;
  };

  // Fetch order status data
  const fetchOrderStatusData = async () => {
    const response = await fetch(
      `${Config.API_URL}/ReceiptStatus/all/${recieptData?.reciept?._id}/${recieptData?.reciept?.store?._id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error?.statusCode === 404) {
        return []; // Return an empty array if no data is found
      } else {
        throw new Error("Error receiving order data");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };

  // useQuery hook to fetch order status data
  const {
    data: OrderStatusData,
    error: OrderStatusDataError,
    isLoading: OrderStatusDataLoading,
    refetch: refetchOrderStatusData,
  } = useQuery({
    queryKey: ["OrderStatusData", user?.token, recieptData?.reciept?._id],
    queryFn: fetchOrderStatusData,
    enabled: !!user?.token && !!recieptData?.reciept?._id,
    refetchOnWindowFocus: true,
  });

  // Refetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.token && recieptData?.reciept?._id) {
        refetchOrderStatusData();
      }
      return () => {};
    }, [user?.token, recieptData?.reciept?._id])
  );

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

  // Check if we should show detailed order status
  const shouldShowDetailedStatus =
    recieptData?.reciept?.status === 4 &&
    recieptData?.reciept?.products?.length > 1;

  // Render individual returned product item
  const renderReturnedProductItem = ({ item, index }) => {
    return (
      <View style={styles.productStatusCard}>
        <View style={styles.productImageContainer}>
          <Image
            source={{
              uri: `${Config.FILES_URL}/${item?.product?.image}`,
            }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.productDetails}>
          <Text style={styles.productName} numberOfLines={2}>
            {item?.product?.name || "Produit non disponible"}
          </Text>
          <Text style={styles.productBrand}>
            {item?.product?.brand?.name || "Marque inconnue"}
          </Text>

          <View style={styles.productMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Quantité retournée</Text>
              <Text style={styles.metricValue}>
                {item?.returnedQuantity || 0}
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Prix unitaire</Text>
              <Text style={styles.metricValue}>
                {formatNumber(item?.price) || "0.00"} DA
              </Text>
            </View>
          </View>

          <View style={styles.returnSummary}>
            <Text style={styles.returnSummaryText}>
              {item?.originalQuantity} → {item?.currentQuantity} {" "}
              (Retour: {item?.returnedQuantity})
            </Text>
            <Text style={styles.returnValue}>
              Valeur retournée: {formatNumber(item?.returnedValue)} DA
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Render shimmer loading for product status
  const renderProductStatusLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        {[...Array(3)].map((_, index) => (
          <View key={index} style={styles.shimmerCard}>
            <View style={styles.shimmerImage} />
            <View style={styles.shimmerContent}>
              <View style={[styles.shimmerLine, { width: "80%" }]} />
              <View
                style={[styles.shimmerLine, { width: "60%", marginTop: 8 }]}
              />
              <View
                style={[styles.shimmerLine, { width: "40%", marginTop: 8 }]}
              />
            </View>
          </View>
        ))}
      </View>
    );
  };

  // Get returned products data
  const returnedProducts = OrderStatusData
    ? getReturnedProducts(OrderStatusData)
    : [];

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
                    {formatTimestamp(recieptData?.reciept?.expextedDeliveryDate)}
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
                    -
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

            {/* Conditional rendering based on status and products */}
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
                {shouldShowDetailedStatus
                  ? "Produits retournés"
                  : "État de la commande"}
              </Text>

              {shouldShowDetailedStatus ? (
                <View style={styles.detailedStatusContainer}>
                  {OrderStatusDataLoading ? (
                    renderProductStatusLoading()
                  ) : OrderStatusDataError ? (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>
                        Erreur lors du chargement des détails
                      </Text>
                    </View>
                  ) : returnedProducts.length > 0 ? (
                    <>
                      <Text style={styles.summaryTitle}>
                        {returnedProducts.length} Produit(s) retourné(s)
                      </Text>
                      <FlatList
                        data={returnedProducts}
                        renderItem={renderReturnedProductItem}
                        keyExtractor={(item, index) =>
                          `${item?.product?._id}-${index}` || index.toString()
                        }
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => (
                          <View style={styles.separator} />
                        )}
                      />
                    </>
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>
                        Aucun produit retourné
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <OrderStatus
                  type={recieptData?.reciept?.type}
                  status={recieptData?.reciept?.status}
                />
              )}
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
  // Styles for detailed status
  detailedStatusContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: "Montserrat-Medium",
    color: "#666666",
    marginBottom: 12,
  },
  productStatusCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  productImageContainer: {
    marginRight: 16,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    color: "#000",
  },
  productBrand: {
    fontSize: 11,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
  productMetrics: {
    flexDirection: "column",
    marginBottom: 4,
    marginTop: 4,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
  metricValue: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    color: "#1A1A1A",
    marginTop: 2,
  },
  returnSummary: {
    marginTop: 4,
  },
  returnSummaryText: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    color: "#666666",
  },
  returnValue: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    color: "#FF6B6B",
    marginTop: 2,
  },
  statusIndicator: {
    alignItems: "center",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    color: "#FF6B6B",
  },
  separator: {
    height: 12,
  },
  loadingContainer: {
    gap: 12,
  },
  shimmerCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  shimmerImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#E5E5E5",
    marginRight: 16,
  },
  shimmerContent: {
    flex: 1,
  },
  shimmerLine: {
    height: 16,
    backgroundColor: "#E5E5E5",
    borderRadius: 4,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#FF6B6B",
    textAlign: "center",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
    textAlign: "center",
  },
});

export default TrackOrder;
