import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import CartRow from "../../components/CartRow";
import EReceiptDetails from "../../components/EReceiptDetails";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
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
    refetchInterval: 100, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });

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

  //--------------------------------------------Rendering--------------------------------------------
  if (OrderDataLoading) {
    return (
      <SafeAreaView className="bg-white pt-3 pb-12 relative h-full">
        <View className="mx-5" style={styles.containerLoading}>
          <View style={styles.containerLoadingtextScreen}>
            <ShimmerPlaceholder style={styles.textScreen} />
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
    <SafeAreaView className="bg-white pt-3 relative h-full">
      <View style={styles.FlatList}>
        <FlatList
          data={OrderData?.recieptStatus?.products || []}
          keyExtractor={(item) => item?.stock?.toString()}
          ListHeaderComponent={
            <>
              <View className="mx-5 mb-[20] flex-row items-center justify-between">
                <BackButton />
                <Text style={styles.titleScreen}>E-Receipt</Text>
                <TrackButton 
                  data={OrderData}
                />
              </View>
              {OrderData?.reciept?.status !== 10 && (
                <View className="flex items-center">
                  <Image source={CodeBare} />
                </View>
              )}
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
            <View style={styles.containerNoAvailable}>
              <Text style={styles.noText}>No product is available</Text>
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
        className="bg-white w-full h-[80px] absolute left-0 bottom-0 flex-row items-center justify-around pb-3"
        style={styles.navigationClass}
      >
        <TouchableOpacity style={styles.loginButton} onPress={generatePDF}>
          <Text style={styles.loginButtonText}>Download E-Receipt</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  notification: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#26667E",
    borderWidth: 1,
  },
  FlatList: {
    paddingBottom: 55,
    flex: 1,
  },
  containerLoadingtextScreen: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  containerLoading: {
    flexDirection: "column",
    gap: 16,
  },
  Vide: {
    width: 40,
    height: 40,
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
  },
  text: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
  container: {
    flexGrow: 1,
    flexDirection: "column",
    minHeight: hp(32),
    height: "fit-content",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  navigationClass: {
    borderColor: "#888888",
    borderWidth: 0.5,
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  navigationText: {
    fontSize: 10,
    fontFamily: "Montserrat-Regular",
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
  containerNoAvailable: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: hp(45),
  },
  noText: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
});

export default EReceiptScreen;
