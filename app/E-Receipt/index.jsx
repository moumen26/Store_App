import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import CartRow from "../../components/CartRow";
import EReceiptDetails from "../../components/EReceiptDetails";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation, useRoute } from "@react-navigation/native";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import Config from "../config";
import { useQuery } from "@tanstack/react-query";
import Cart from "../loading/Cart";
import Search from "../loading/Search";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import CodeBar from "../loading/CodeBar";
import ArticleItem from "../loading/ArticleItem";
import EReceiptDetailsShimmer from "../loading/EReceiptDetails";
import ScanButton from "../../components/ScanButton";

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
  const navigator = useNavigation();
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

  // Function to generate and download the PDF
  const downloadPDF = async () => {
    const htmlContent = `
      <html>
        <body>
          <h1>E-Receipt</h1>
          <p><strong>Order ID:</strong> ${OrderData?.reciept?._id}</p>
          <p><strong>Store Name:</strong> ${
            OrderData?.reciept?.store?.storeName
          }</p>
          <p><strong>Order Date:</strong> ${OrderData?.reciept?.date}</p>
          <p><strong>Order Status:</strong> ${OrderData?.reciept?.status}</p>
          <p><strong>Total:</strong> ${OrderData?.reciept?.total}</p>
          <h2>Products</h2>
          <ul>
            ${OrderData?.recieptStatus?.products
              .map(
                (product) => `
                  <li>${product?.product?.name} - ${product?.quantity} x ${product?.product?.brand?.name}</li>`
              )
              .join("")}
          </ul>
        </body>
      </html>
    `;
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
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 0,
          paddingBottom: 55,
        }}
        vertical
        showsHorizontalScrollIndicator={false}
      >
        <View className="mx-5 mb-[20] flex-row items-center justify-between">
          <BackButton />
          <Text style={styles.titleScreen}>E-Receipt</Text>
          <ScanButton />
        </View>
        {OrderData?.reciept?.status != 10 && (
          <View className="flex items-center">
            <Image source={CodeBare} />
          </View>
        )}
        <View className="mx-5 mt-[12]" style={styles.container}>
          {OrderData?.recieptStatus?.products?.length > 0 ? (
            OrderData?.recieptStatus?.products?.map((item, index) => (
              <CartRow
                key={item?.stock}
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
            ))
          ) : (
            <View style={styles.containerNoAvailable}>
              <Text style={styles.noText}>No product is available</Text>
            </View>
          )}
        </View>
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
      </ScrollView>
      <View
        className="bg-white w-full h-[80px] absolute left-0 bottom-0 flex-row items-center justify-around pb-3"
        style={styles.navigationClass}
      >
        <TouchableOpacity style={styles.loginButton} onPress={downloadPDF}>
          <Text style={styles.loginButtonText}>Download E-Receipt</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
