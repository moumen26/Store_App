import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
// Remove the problematic barcode import
// import Barcode, { Format } from "react-native-barcode-builder";

import React, { useLayoutEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import BackButton from "../../components/BackButton";
import CartRow from "../../components/CartRow";
import SubmitOrderModal from "../../components/SubmitOrderModal.jsx";
import EReceiptDetails from "../../components/EReceiptDetails";
import { useRoute } from "@react-navigation/native";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import Config from "../config";
import { useQuery } from "@tanstack/react-query";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import CodeBar from "../loading/CodeBar";
import ArticleItem from "../loading/ArticleItem";
import EReceiptDetailsShimmer from "../loading/EReceiptDetails";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import TrackButton from "../../components/TrackButton";

// Axios instance for base URL configuration
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const EReceiptScreen = () => {
  const { user } = useAuthContext();
  const route = useRoute();
  const { OrderID } = route.params;

  // Get screen dimensions with validation
  const { width, height } = useWindowDimensions();

  // Validate dimensions to prevent NaN
  const safeWidth = width && !isNaN(width) ? width : 375;
  const safeHeight = height && !isNaN(height) ? height : 667;

  // Calculate responsive values with safe dimensions
  const isSmallScreen = safeWidth < 375;
  const isMediumScreen = safeWidth >= 375 && safeWidth < 768;
  const isLargeScreen = safeWidth >= 768;

  // Responsive spacing calculations with safe values
  const horizontalPadding = safeWidth * 0.05;
  const verticalSpacing = safeHeight * 0.025;
  const smallSpacing = safeHeight * 0.01;

  // Additional responsive values with validation
  const buttonHeight = Math.max(45, safeHeight * 0.06);
  const buttonWidth = isLargeScreen ? safeWidth * 0.6 : safeWidth * 0.85;
  const barcodeWidth = isSmallScreen
    ? safeWidth * 0.95
    : isLargeScreen
    ? safeWidth * 0.85
    : safeWidth * 0.9;
  const bottomBarHeight = isSmallScreen ? 70 : 80;

  // Validate OrderID before using it
  const validOrderID =
    OrderID && typeof OrderID === "string" && OrderID.trim() !== ""
      ? OrderID.trim()
      : null;

  //--------------------------------------------APIs--------------------------------------------
  // Function to fetch public publicities data
  const fetchOrderData = async () => {
    try {
      const response = await api.get(
        `/Receipt/client/${user?.info?.id}/${OrderID}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      // Return the data from the response
      return (await response.data) || [];
    } catch (error) {
      // Handle if the request fails with status code 401 or 404
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        return []; // Return an empty array for 401 and 404 errors
      }
      throw new Error(error?.message || "Network error");
    }
  };

  const {
    data: OrderData,
    error: OrderDataError,
    isLoading: OrderDataLoading,
    refetch: OrderDataRefetch,
  } = useQuery({
    queryKey: ["OrderData", user?.token, validOrderID], // Include OrderID in query key
    queryFn: fetchOrderData,
    enabled: !!user?.token && !!validOrderID, // Only run if user is authenticated and OrderID is valid
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true,
  });

  // Refetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.token && validOrderID) {
        OrderDataRefetch();
      }
      return () => {};
    }, [user?.token, validOrderID])
  );

  const html = `
  <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: Montserrat, sans-serif;
          margin: 0;
          padding: 40px;
          color: #333;
          background-color: #fff;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #19213D;
          padding-bottom: 20px;
        }
        .company-info {
          text-align: left;
        }
        .company-info h1 {
          margin: 0;
          font-size: 32px;
          color: #19213D;
          font-weight: 700;
        }
        .company-info p {
          margin: 5px 0;
          font-size: 14px;
          color: #666;
        }
        .invoice-title {
          text-align: right;
        }
        .invoice-title h2 {
          margin: 0;
          font-size: 36px;
          color: #333;
          font-weight: 600;
        }
        .invoice-title p {
          margin: 5px 0;
          font-size: 16px;
          color: #666;
        }
        .barcode-container {
          text-align: center;
          margin: 30px 0;
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }
        .client-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
        }
        .info-section {
          flex: 1;
          margin-right: 20px;
        }
        .info-section:last-child {
          margin-right: 0;
        }
        .info-section h3 {
          margin-bottom: 10px;
          font-size: 16px;
          font-weight: 600;
          color: #19213D;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        .info-section p {
          margin: 5px 0;
          font-size: 14px;
        }
        .product-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .product-table th {
          background-color: #19213D;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #1f5566;
        }
        .product-table td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
        }
        .product-table tr:last-child td {
          border-bottom: none;
        }
        .product-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .product-image {
          width: 60px;
          height: 60px;
          object-fit: contain;
          border-radius: 4px;
        }
        .product-details {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .product-name {
          font-weight: 600;
          color: #333;
        }
        .product-brand {
          color: #666;
          font-size: 14px;
        }
        .total-section {
          display: flex;
          justify-content: flex-end;
          margin-top: 30px;
        }
        .total-table {
          width: 300px;
        }
        .total-table tr {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .total-table .label {
          font-weight: 500;
          color: #666;
        }
        .total-table .value {
          font-weight: 600;
          color: #333;
        }
        .total-table .grand-total {
          border-top: 2px solid #19213D;
          padding-top: 8px;
          font-size: 18px;
        }
        .total-table .grand-total .label {
          color: #19213D;
        }
        .total-table .grand-total .value {
          color: #19213D;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        .thank-you {
          margin-top: 40px;
          text-align: center;
        }
        .thank-you h3 {
          color: #19213D;
          font-size: 18px;
          margin-bottom: 10px;
        }
        .thank-you p {
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div class="company-info">
          <h1>Votre Entreprise</h1>
          <p>www.votreentreprise.com</p>
          <p>contact@votreentreprise.com</p>
          <p>+213 123 456 789</p>
        </div>
        <div class="invoice-title">
          <h2>FACTURE</h2>
          <p>N° ${OrderData?.reciept?._id || "N/A"}</p>
          <p>Date: ${
            OrderData?.reciept?.date
              ? new Date(OrderData.reciept.date).toLocaleDateString("fr-FR")
              : "N/A"
          }</p>
        </div>
      </div>

      <div class="barcode-container">
        ${
          OrderData?.reciept?._id
            ? `<img src="https://barcode.tec-it.com/barcode.ashx?data=${OrderData.reciept._id}&code=Code128&dpi=300" />`
            : "<p>Code-barres non disponible</p>"
        }
      </div>

      <div class="client-info">
        <div class="info-section">
          <h3>Informations du Client</h3>
          <p><strong>Nom:</strong> ${user?.info?.firstName || ""} ${
    user?.info?.lastName || ""
  }</p>
          <p><strong>Email:</strong> ${user?.info?.email || "N/A"}</p>
          <p><strong>Téléphone:</strong> ${user?.info?.phoneNumber || "N/A"}</p>
        </div>
        <div class="info-section">
          <h3>Détails de Livraison</h3>
          <p><strong>Magasin:</strong> ${
            OrderData?.reciept?.store?.storeName || "N/A"
          }</p>
          <p><strong>Type:</strong> ${
            OrderData?.reciept?.type === "pickup"
              ? "Retrait"
              : OrderData?.reciept?.type === "delivery"
              ? "Livraison"
              : "N/A"
          }</p>
          ${
            OrderData?.reciept?.type === "delivery"
              ? `<p><strong>Adresse:</strong> ${
                  OrderData?.reciept?.deliveredLocation?.address ||
                  "Adresse non disponible"
                }</p>`
              : ""
          }
        </div>
      </div>

      <table class="product-table">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Prix Unitaire</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${
            OrderData?.recieptStatus?.products?.length > 0
              ? OrderData.recieptStatus.products
                  .map((product) => {
                    const unitPrice =
                      product.quantity && product.total
                        ? (product.total / product.quantity).toFixed(2)
                        : "0.00";
                    return `
                <tr>
                  <td>
                    <div class="product-details">
                      <img class="product-image" src="${Config.FILES_URL}/${
                      product?.product?.image || "placeholder.jpg"
                    }" />
                      <div>
                        <div class="product-name">${
                          product?.product?.name || "Produit non disponible"
                        }</div>
                        <div class="product-brand">${
                          product?.product?.brand?.name || "Marque inconnue"
                        }</div>
                      </div>
                    </div>
                  </td>
                  <td>${product?.quantity || 0}</td>
                  <td>${unitPrice} DA</td>
                  <td>${product?.total?.toFixed(2) || "0.00"} DA</td>
                </tr>
              `;
                  })
                  .join("")
              : '<tr><td colspan="4" style="text-align: center;">Aucun produit disponible</td></tr>'
          }
        </tbody>
      </table>

      <div class="total-section">
        <div class="total-table">
          <tr>
            <span class="label">Sous-total:</span>
            <span class="value">${
              OrderData?.reciept?.total?.toFixed(2) || "0.00"
            } DA</span>
          </tr>
          ${
            OrderData?.reciept?.type === "delivery"
              ? `
            <tr>
              <span class="label">Frais de livraison:</span>
              <span class="value">${
                OrderData?.deliveryCost?.toFixed(2) || "0.00"
              } DA</span>
            </tr>
          `
              : ""
          }
          <tr class="grand-total">
            <span class="label">Total:</span>
            <span class="value">${(
              (OrderData?.reciept?.total || 0) + (OrderData?.deliveryCost || 0)
            ).toFixed(2)} DA</span>
          </tr>
        </div>
      </div>

      <div class="thank-you">
        <h3>Merci pour votre confiance!</h3>
        <p>Nous espérons vous revoir bientôt.</p>
      </div>

      <div class="footer">
        <p>Ceci est un document électronique généré automatiquement.</p>
        <p>Pour toute question, veuillez contacter notre service client.</p>
      </div>
    </body>
  </html>
  `;

  const generatePDF = async () => {
    try {
      const file = await printToFileAsync({
        html: html,
        base64: false,
      });
      await shareAsync(file.uri);
    } catch (error) {
      console.log("Error generating PDF:", error);
      // You might want to show an alert or toast here
    }
  };

  // Alternative Barcode Component using online service
  const BarcodeWrapper = ({ value, width, height }) => {
    // Validate the barcode value
    if (!value || typeof value !== "string" || value.trim() === "") {
      return (
        <View
          style={{
            width: width || 200,
            height: height || 100,
            backgroundColor: "#f0f0f0",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 12, color: "#888" }}>
            Code-barres indisponible
          </Text>
        </View>
      );
    }

    // Ensure width and height are valid numbers
    const validWidth = isNaN(width) ? 200 : width;
    const validHeight = isNaN(height) ? 100 : height;

    // Clean the value for barcode generation
    const cleanValue = value.toString().trim();

    // Use online barcode service - remove text display by setting ShowText=No
    const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(
      cleanValue
    )}&code=Code128&dpi=150&imagetype=Gif&ShowText=No`;

    return (
      <View
        style={{
          width: validWidth,
          height: validHeight,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
        }}
      >
        <Image
          source={{ uri: barcodeUrl }}
          style={{
            width: validWidth,
            height: validHeight,
            resizeMode: "contain",
          }}
          onError={() => {
            console.log("Barcode image failed to load");
          }}
        />
      </View>
    );
  };

  // Alternative: Simple styled text-based "barcode" component
  const TextBarcode = ({ value, width, height }) => {
    if (!value || typeof value !== "string" || value.trim() === "") {
      return (
        <View
          style={{
            width: width || 200,
            height: height || 80,
            backgroundColor: "#f0f0f0",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#ddd",
          }}
        >
          <Text style={{ fontSize: 12, color: "#888" }}>
            Code-barres indisponible
          </Text>
        </View>
      );
    }

    const cleanValue = value.toString().trim();

    return (
      <View
        style={{
          width: width || 200,
          height: height || 80,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
          borderWidth: 2,
          borderColor: "#19213D",
          padding: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 5,
          }}
        >
          {/* Simple visual bars representation */}
          {[...Array(20)].map((_, i) => (
            <View
              key={i}
              style={{
                width: Math.random() > 0.5 ? 2 : 1,
                height: 30,
                backgroundColor: "#000",
                marginHorizontal: 0.5,
              }}
            />
          ))}
        </View>
        <Text
          style={{
            fontSize: 12,
            color: "#19213D",
            fontFamily: "Montserrat-Regular",
            textAlign: "center",
          }}
        >
          {cleanValue}
        </Text>
      </View>
    );
  };

  //--------------------------------------------Rendering--------------------------------------------
  if (OrderDataLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={[styles.container, { marginHorizontal: horizontalPadding }]}
        >
          <View style={styles.containerLoadingtextScreen}>
            <ShimmerPlaceholder
              style={[styles.textScreen, { width: safeWidth * 0.6 }]}
            />
          </View>
          <CodeBar />
          <ArticleItem />
          <ArticleItem />
          <ArticleItem />
          <ArticleItem />
          <EReceiptDetailsShimmer />
        </View>
      </SafeAreaView>
    );
  }

  // Show error state if OrderID is invalid
  if (!validOrderID) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={[styles.container, { marginHorizontal: horizontalPadding }]}
        >
          <View style={styles.headerContainer}>
            <BackButton />
            <Text style={styles.titleScreen}>E-Reçu</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Numéro de commande invalide</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.flatListContainer,
          {
            marginHorizontal: horizontalPadding,
            paddingBottom: bottomBarHeight + 10,
          },
        ]}
      >
        <FlatList
          data={OrderData?.recieptStatus?.products || []}
          keyExtractor={(item, index) =>
            item?.stock?.toString() || index.toString()
          }
          ListHeaderComponent={
            <>
              <View
                style={[
                  styles.headerContainer,
                  { marginBottom: verticalSpacing },
                ]}
              >
                <BackButton />
                <Text
                  style={[
                    styles.titleScreen,
                    {
                      fontSize: isSmallScreen ? 18 : isLargeScreen ? 24 : 20,
                    },
                  ]}
                >
                  E-Reçu
                </Text>
                <TrackButton
                  data={OrderData}
                  OrderDataRefetch={OrderDataRefetch}
                />
              </View>
              <View
                style={[
                  styles.barcodeContainer,
                  { marginBottom: verticalSpacing },
                ]}
              >
                {/* Choose one of these three options: */}

                {/* Option 1: Online barcode service (recommended) */}
                {validOrderID && !OrderDataLoading ? (
                  <BarcodeWrapper
                    value={validOrderID}
                    width={barcodeWidth}
                    height={isSmallScreen ? 70 : 80}
                  />
                ) : (
                  <View
                    style={{
                      width: barcodeWidth,
                      height: isSmallScreen ? 70 : 80,
                      backgroundColor: "#f0f0f0",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: "#888" }}>
                      {OrderDataLoading
                        ? "Chargement du code-barres..."
                        : "Code-barres indisponible"}
                    </Text>
                  </View>
                )}
              </View>
            </>
          }
          renderItem={({ item }) => (
            <CartRow
              ProductQuantity={item?.quantity}
              ProductName={item?.product?.name}
              ProductBrand={item?.product?.brand?.name}
              ProductImage={`${Config.FILES_URL}/${item?.product?.image || ""}`}
              BoxItems={item?.product?.boxItems}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun produit disponible</Text>
            </View>
          }
          ListFooterComponent={
            <EReceiptDetails
              OrderStoreName={OrderData?.reciept?.store?.storeName}
              OrderID={OrderData?.reciept?._id}
              OrderType={OrderData?.reciept?.type}
              OrderDeliveryAddress={
                OrderData?.reciept?.deliveredLocation?.address || null
              }
              OrderDate={OrderData?.reciept?.date}
              OrderStatus={OrderData?.reciept?.status}
              OrderSubTotal={OrderData?.reciept?.total}
              OrderDeliveryCharge={OrderData?.deliveryCost}
              OrderDiscount={""}
            />
          }
        />
      </View>

      <View
        style={[
          styles.bottomBar,
          {
            height: bottomBarHeight,
            paddingBottom: isSmallScreen ? 0 : Platform.OS === "ios" ? 10 : 3,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.downloadButton,
            {
              height: buttonHeight,
              width: buttonWidth,
            },
          ]}
          onPress={generatePDF}
        >
          <Text
            style={[
              styles.buttonText,
              {
                fontSize: isSmallScreen ? 14 : 16,
              },
            ]}
          >
            Télécharger le reçu électronique
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 10 : 3,
    height: "100%",
    position: "relative",
  },
  container: {
    flexDirection: "column",
    gap: 16,
  },
  flatListContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  barcodeContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  containerLoadingtextScreen: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  textScreen: {
    height: 20,
    borderRadius: 4,
  },
  titleScreen: {
    fontFamily: "Montserrat-Regular",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderColor: "#888888",
    borderWidth: 0.5,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  downloadButton: {
    backgroundColor: "#19213D",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Montserrat-Regular",
  },
});

export default EReceiptScreen;
