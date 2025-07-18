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
import React, { useLayoutEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import BackButton from "../../components/BackButton";
import CartRow from "../../components/CartRow";
import SubmitOrderModal from "../../components/SubmitOrderModal.jsx";
import EReceiptDetails from "../../components/EReceiptDetails";
import Barcode from "react-native-barcode-svg";
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
  const barcodeWidth = isSmallScreen
    ? width * 0.8
    : isLargeScreen
    ? width * 0.6
    : width * 0.7;
  const bottomBarHeight = isSmallScreen ? 70 : 80;

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
    queryKey: ["OrderData", user?.token], // Ensure token is part of the query key
    queryFn: fetchOrderData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });

  // Refetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.token) {
        OrderDataRefetch();
      }
      return () => {};
    }, [user?.token])
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
          <p>N° ${OrderData?.reciept?._id}</p>
          <p>Date: ${new Date(OrderData?.reciept?.date).toLocaleDateString(
            "fr-FR"
          )}</p>
        </div>
      </div>

      <div class="barcode-container">
        <img src="https://barcode.tec-it.com/barcode.ashx?data=${
          OrderData?.reciept?._id
        }&code=Code128&dpi=300" />
      </div>

      <div class="client-info">
        <div class="info-section">
          <h3>Informations du Client</h3>
          <p><strong>Nom:</strong> ${user?.info?.firstName} ${
    user?.info?.lastName
  }</p>
          <p><strong>Email:</strong> ${user?.info?.email}</p>
          <p><strong>Téléphone:</strong> ${user?.info?.phoneNumber}</p>
        </div>
        <div class="info-section">
          <h3>Détails de Livraison</h3>
          <p><strong>Magasin:</strong> ${
            OrderData?.reciept?.store?.storeName
          }</p>
          <p><strong>Type:</strong> ${
            OrderData?.reciept?.type === "pickup" ? "Retrait" : "Livraison"
          }</p>
          ${
            OrderData?.reciept?.type === "delivery"
              ? `
            <p><strong>Adresse:</strong> ${
              OrderData?.reciept?.deliveredLocation?.address || ""
            }</p>
          `
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
          ${OrderData?.recieptStatus?.products
            ?.map((product) => {
              const unitPrice = product.quantity
                ? (product.total / product.quantity).toFixed(2)
                : "0.00";
              return `
              <tr>
                <td>
                  <div class="product-details">
                    <img class="product-image" src="${Config.FILES_URL}/${
                product?.product?.image
              }" />
                    <div>
                      <div class="product-name">${product?.product?.name}</div>
                      <div class="product-brand">${
                        product?.product?.brand?.name
                      }</div>
                    </div>
                  </div>
                </td>
                <td>${product?.quantity}</td>
                <td>${unitPrice} DA</td>
                <td>${product?.total?.toFixed(2)} DA</td>
              </tr>
            `;
            })
            ?.join("")}
        </tbody>
      </table>

      <div class="total-section">
        <div class="total-table">
          <tr>
            <span class="label">Sous-total:</span>
            <span class="value">${OrderData?.reciept?.total?.toFixed(
              2
            )} DA</span>
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
              OrderData?.reciept?.total + (OrderData?.deliveryCost || 0)
            )?.toFixed(2)} DA</span>
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

  let generatePDF = async () => {
    const file = await printToFileAsync({
      html: html,
      base64: false,
    });

    await shareAsync(file.uri);
  };

  const BarcodeWrapper = ({ value, format = "CODE128", ...props }) => {
    return <Barcode value={value} format={format} {...props} />;
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
              style={[styles.textScreen, { width: width * 0.6 }]}
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
          keyExtractor={(item) => item?.stock?.toString()}
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
                <BarcodeWrapper
                  value={OrderID}
                  width={barcodeWidth}
                  height={isSmallScreen ? 70 : 80}
                />
              </View>
            </>
          }
          renderItem={({ item }) => (
            <CartRow
              ProductQuantity={item?.quantity}
              ProductName={item?.product?.name}
              ProductBrand={item?.product?.brand?.name}
              ProductImage={`${
                `${Config.FILES_URL}/${item?.product?.image}` || ""
              }`}
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
