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
import SubmitOderModalReason from "../../components/SubmitOderModalReason.jsx";

const CodeBare = require("../../assets/images/CodeBare.png");

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
          text-align: center;
          margin: 12px 24px;
        }
        .barcode {
          width: 100%;
          text-align: center;
          margin-bottom: 10px;
        }
        .barcode img{
          width: 80%;
        }
        .product-container {
          display: flex;
          flex-direction: row; 
          align-items: center;
          width: 100%;
          margin-bottom: 10px;
        }
        .product-image {
          width: 100px;
          height: 100px;
          object-fit: contain;
        }
       .product-details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px; 
        }
        .product-details p {
          margin: 0; 
        }
        .order-details {
          text-align: left;
          margin-top: 20px;
          border-top: 1px solid #ccc;
          padding-top: 10px;
        }
        .order-details p {
          margin: 5px 0;
        }
        h1{
          font-size: 28px;
        }
        h2{
          font-size: 22px;
          text-align: left;
        }
      </style>
    </head>
    <body>
      <h1>E-Receipt</h1>
      
      <div class="barcode">
        <img src="https://barcode.tec-it.com/barcode.ashx?data=${
          OrderData?.reciept?._id
        }&code=Code128&dpi=300" />
      </div>

      <h2>Order Details</h2>

      <!-- Product List -->
      ${OrderData?.recieptStatus?.products
        .map(
          (product) => `
        <div class="product-container">
          <img class="product-image" src="${Config.API_URL.replace(
            "/api",
            ""
          )}/files/${product?.product?.image}" />
          <div class="product-details">
            <p><strong>${product?.product?.name}</strong></p>
            <p>${product?.product?.brand?.name} | Qty: ${product?.quantity}</p>
          </div>
        </div>
      `
        )
        .join("")}
  
      <!-- Order Details -->
      <div class="order-details">
        <p><strong>Store:</strong> ${OrderData?.reciept?.store?.storeName}</p>
        <p><strong>Order ID:</strong> ${OrderData?.reciept?._id}</p>
        <p><strong>Order Type:</strong> ${OrderData?.reciept?.type}</p>
        <p><strong>Order Date:</strong> ${OrderData?.reciept?.date}</p>
        <p><strong>Sub Total:</strong> DA ${OrderData?.reciept?.total}</p>
        ${
          OrderData?.reciept?.type === "delivery"
            ? `<p><strong>Delivery Charge:</strong> + DA</p>`
            : ""
        }
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
                `${Config.API_URL.replace("/api", "")}/files/${
                  item?.product?.image
                }` || ""
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
    backgroundColor: "#26667E",
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
