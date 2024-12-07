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

const Elio = require("../../assets/images/Elio.png");
const CodeBare = require("../../assets/images/CodeBare.png");

const COLUMN_COUNT = 1;
const DATA = [
  {
    id: "1",
    ProductName: "Item 1",
    ProductBrand: "Cevital",
    ProductQuantity: "02",
    ProductPriceTotal: "900",
  },
  {
    id: "1",
    ProductName: "Item 1",
    ProductBrand: "Cevital",
    ProductQuantity: "02",
    ProductPriceTotal: "900",
  },
  {
    id: "1",
    ProductName: "Item 1",
    ProductBrand: "Cevital",
    ProductQuantity: "02",
    ProductPriceTotal: "900",
  },
  {
    id: "1",
    ProductName: "Item 1",
    ProductBrand: "Cevital",
    ProductQuantity: "02",
    ProductPriceTotal: "900",
  },
  {
    id: "1",
    ProductName: "Item 1",
    ProductBrand: "Cevital",
    ProductQuantity: "02",
    ProductPriceTotal: "900",
  },
  {
    id: "1",
    ProductName: "Item 1",
    ProductBrand: "Cevital",
    ProductQuantity: "02",
    ProductPriceTotal: "900",
  },
];

const DATACOMMANDEDETAILS = [
  {
    OrderStoreName: "Hamza Alimentaiton",
    OrderID: "CDR45HGJF",
    OrderType: "Delivery",
    OrderDeliveryAddress: "Home (Rue Yousfi ..)",
    OrderDate: "May 09, 2024",
    OrderSubTotal: "990",
    OrderDeliveryCharge: "00.00",
    OrderDiscount: "25.00",
  },
];

const EReceiptScreen = () => {
  const renderProductItems = () => {
    const items = [];
    for (let i = 0; i < DATA.length; i += COLUMN_COUNT) {
      const rowItems = DATA.slice(i, i + COLUMN_COUNT).map((item) => (
        <CartRow
          key={item.id}
          ProductName={item.ProductName}
          ProductBrand={item.ProductBrand}
          ProductQuantity={item.ProductQuantity}
          ProductImage={Elio}
        />
      ));
      items.push(
        <View className="mb-4" key={i} style={styles.row}>
          {rowItems}
        </View>
      );
    }
    return items;
  };

  return (
    <SafeAreaView className="bg-white pt-5 relative h-full">
      <View className="mx-5 mb-[20] flex-row items-center justify-between">
        <BackButton />
        <Text style={styles.titleScreen}>E-Receipt</Text>
        <View style={styles.Vide}></View>
      </View>
      <View className="flex items-center">
        <Image source={CodeBare} />
      </View>
      <View className="h-[45%] mt-[20]">
        <ScrollView
          className="mx-5"
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {renderProductItems()}
        </ScrollView>
      </View>
      <View className="h-fit pb-3 absolute bottom-[80]">
        <EReceiptDetails
          OrderStoreName={DATACOMMANDEDETAILS.OrderStoreName}
          OrderID={DATACOMMANDEDETAILS.OrderID}
          OrderType={DATACOMMANDEDETAILS.OrderType}
          OrderDeliveryAddress={DATACOMMANDEDETAILS.OrderDeliveryAddress}
          OrderDate={DATACOMMANDEDETAILS.OrderDate}
          OrderStatus={DATACOMMANDEDETAILS.OrderStatus}
          OrderSubTotal={DATACOMMANDEDETAILS.OrderSubTotal}
          OrderDeliveryCharge={DATACOMMANDEDETAILS.OrderDeliveryCharge}
          OrderDiscount={DATACOMMANDEDETAILS.OrderDiscount}
        />
      </View>
      <View
        className="bg-white w-full h-[80px] absolute left-0 bottom-0 flex-row items-center justify-around pb-3"
        style={styles.navigationClass}
      >
        <TouchableOpacity
          style={styles.loginButton}
          // onPress={() => navigation.navigate("")}
        >
          <Text style={styles.loginButtonText}>Download E-Receipt</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    justifyContent: "space-between",
    flexDirection: "column",
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
});

export default EReceiptScreen;
