import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CartOrderItem from "../../components/CartOrderItem";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const COLUMN_COUNT = 1;
const DATA = [
  {
    id: "1",
    OrderStoreName: "Hamza Alimentation",
    OrderID: "CDR45HGJF",
    OrderType: "Delivery",
    OrderDeliveryAddress: "Home (Rue Yousfi ..)",
    OrderDate: "May 09,2024 | 04:00 PM",
    OrderStatus: "Delivered",
    OrderSubTotal: "990.00",
  },
  {
    id: "2",
    OrderStoreName: "Hichem Detergent",
    OrderID: "CDR45HGJF",
    OrderType: "Delivery",
    OrderDeliveryAddress: "Home (Rue Yousfi ..)",
    OrderDate: "May 09,2024 | 04:00 PM",
    OrderStatus: "Preparing your order",
    OrderSubTotal: "990.00",
  },
  {
    id: "3",
    OrderStoreName: "Item 3",
    OrderID: "CDR45HGJF",
    OrderType: "Delivery",
    OrderDeliveryAddress: "Home (Rue Yousfi ..)",
    OrderDate: "May 09,2024 | 04:00 PM",
    OrderStatus: "Order on the way to address",
    OrderSubTotal: "990.00",
  },
  {
    id: "4",
    OrderStoreName: "Item 4",
    OrderID: "CDR45HGJF",
    OrderType: "Delivery",
    OrderDeliveryAddress: "Home (Rue Yousfi ..)",
    OrderDate: "May 09,2024 | 04:00 PM",
    OrderStatus: "Delivered",
    OrderSubTotal: "990.00",
  },
  {
    id: "5",
    OrderStoreName: "Item 5",
    OrderID: "CDR45HGJF",
    OrderType: "Delivery",
    OrderDeliveryAddress: "Home (Rue Yousfi ..)",
    OrderDate: "May 09,2024 | 04:00 PM",
    OrderStatus: "Delivered",
    OrderSubTotal: "990.00",
  },
  {
    id: "6",
    OrderStoreName: "Item 6",
    OrderID: "CDR45HGJF",
    OrderType: "Delivery",
    OrderDeliveryAddress: "Home (Rue Yousfi ..)",
    OrderDate: "May 09,2024 | 04:00 PM",
    OrderStatus: "Delivered",
    OrderSubTotal: "990.00",
  },
  {
    id: "7",
    OrderStoreName: "Item 7",
    OrderID: "CDR45HGJF",
    OrderType: "Delivery",
    OrderDeliveryAddress: "Home (Rue Yousfi ..)",
    OrderDate: "May 09,2024 | 04:00 PM",
    OrderStatus: "Delivered",
    OrderSubTotal: "990.00",
  },
];

const cart = () => {
  const renderItems = () => {
    const items = [];

    for (let i = 0; i < DATA.length; i += COLUMN_COUNT) {
      const rowItems = DATA.slice(i, i + COLUMN_COUNT).map((item) => (
        <CartOrderItem
          key={item.id}
          OrderStoreName={item.OrderStoreName}
          OrderID={item.OrderID}
          OrderType={item.OrderType}
          OrderDeliveryAddress={item.OrderDeliveryAddress}
          OrderDate={item.OrderDate}
          OrderStatus={item.OrderStatus}
          OrderSubTotal={item.OrderSubTotal}
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
    <SafeAreaView className="bg-white pt-5 pb-12 relative h-full">
      <Text className="text-center mb-[20]" style={styles.titleScreen}>
        My Orders
      </Text>
      <View
        style={styles.searchBar}
        className="flex-row mx-5 items-center space-x-2 mb-[20] rounded-3xl"
      >
        <MagnifyingGlassIcon size={20} color="#26667E" />
        <TextInput
          style={styles.searchBarItem}
          placeholder="Search your store.."
          placeholderTextColor="#888888"
          // value={searchQuery}
          // onChangeText={setSearchQuery}
        />
      </View>
      <View style={styles.container}>
        <ScrollView className="mx-5" showsVerticalScrollIndicator={false}>
          {renderItems()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(100),
    paddingBottom: 250,
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
  },
  searchBar: {
    height: 50,
    borderColor: "#26667E",
    borderWidth: 1,
    alignItems: "center",
    paddingLeft: 15,
    borderRadius: 30,
    flexDirection: "row",
    gap: 4,
  },
  searchBarItem: {
    color: "black",
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    width: 220,
  },
});

export default cart;
