import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CartRow from "../../components/CartRow";
import ScanButton from "../../components/ScanButton";
import BackButton from "../../components/BackButton";
import OrderStatus from "../../components/OrderStatus";

const orderData = {
  receiptStatus: {
    products: [
      {
        stock: 1,
        quantity: 2,
        product: {
          name: "Product 1",
          brand: { name: "Brand A" },
          image: "product1.jpg",
          boxItems: ["Item 1", "Item 2"],
        },
      },
    ],
  },
  receipt: {
    store: { storeName: "Store A" },
    _id: "CDR45HGJF",
    type: "Online",
    deliveredLocation: { address: "123 Main St" },
    date: "2025-02-02",
    status: "Delivered",
    total: "$100.00",
  },
  deliveryCost: "$5.00",
};

const TrackOrder = () => {
  const orderDetails = {
    status: 3,
    type: "delivery",
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={orderData.receiptStatus.products}
        keyExtractor={(item) => item.stock.toString()}
        ListHeaderComponent={
          <View style={styles.header}>
            <BackButton />
            <Text style={styles.titleScreen}>Track Order</Text>
            <ScanButton />
          </View>
        }
        renderItem={({ item }) => (
          <CartRow
            ProductQuantity={item.quantity}
            ProductName={item.product.name}
            ProductBrand={item.product.brand.name}
            ProductImage={`https://your-api-endpoint.com/files/${item.product.image}`}
            BoxItems={item.product.boxItems}
          />
        )}
        ListEmptyComponent={
          <View style={styles.containerNoAvailable}>
            <Text style={styles.noText}>No product is available</Text>
          </View>
        }
        ListFooterComponent={
          <View className="mx-5">
            <View style={styles.commandeContainer}>
              <Text style={styles.titleCategory}>Order Details</Text>
              <View className="flex-row items-center justify-between w-full">
                <Text style={styles.text}>Expected Delivery Date</Text>
                <Text style={styles.textDescription}>
                  May 09, 2024 | 06:00 PM
                </Text>
              </View>
              <View className="flex-row items-center justify-between w-full">
                <Text style={styles.text}>Order Id</Text>
                <Text style={styles.textDescription}>
                  {orderData.receipt._id}
                </Text>
              </View>
            </View>
            <View style={styles.OrderStatus}>
              <Text style={styles.titleCategory}>Order Status</Text>
              <OrderStatus orderDetails={orderDetails} />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 10,
    paddingBottom: 10,
  },
  OrderStatus: {
    marginTop: 20,
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
    marginBottom: 10,
  },
  commandeContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "column",
    gap: 4,
    borderColor: "#F7F7F7",
  },
  text: {
    fontSize: 11,
    color: "#888888",
    fontFamily: "Montserrat-Regular",
  },
  textDescription: {
    fontSize: 11,
    fontFamily: "Montserrat-Medium",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  titleScreen: {
    fontSize: 20,
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
  navigationClass: {
    borderTopColor: "#888888",
    borderTopWidth: 0.5,
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 20,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#26667E",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
});

export default TrackOrder;
