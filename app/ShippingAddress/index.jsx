import React, { useLayoutEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import { StyleSheet } from "react-native";
import ShippingAddressCard from "../../components/ShippingAddressCard";
import { useNavigation } from "expo-router";

const COLUMN_COUNT = 1;
const DATA = [
  {
    id: "1",
    AddressTitle: "Item 1",
    AddressPlace: "Rue Yousfi Abdelkader, Blida",
    AddressTime: "25 Minute estimate arrived",
  },
  {
    id: "2",
    AddressTitle: "Item 2",
    AddressPlace: "Rue Yousfi Abdelkader, Blida",
    AddressTime: "25 Minute estimate arrived",
  },
];

const ShippingAddressScreen = () => {
  const navigation = useNavigation();

  const [selectedIndex, setSelectedIndex] = useState(null);
  const handleSelectItem = (index) => {
    console.log("Selected index:", index);
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  const renderItems = () => {
    const items = [];

    for (let i = 0; i < DATA.length; i += COLUMN_COUNT) {
      const rowItems = DATA.slice(i, i + COLUMN_COUNT).map((item, index) => (
        <ShippingAddressCard
          key={item.id}
          index={i + index}
          AddressTitle={item.AddressTitle}
          AddressPlace={item.AddressPlace}
          AddressTime={item.AddressTime}
          isSelected={i + index === selectedIndex}
          onSelect={handleSelectItem}
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
        <Text className="text-center" style={styles.titleScreen}>
          Shipping Address
        </Text>
        <View style={styles.Vide}></View>
      </View>
      <View style={styles.scroll} className="mx-5">
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {renderItems()}
        </ScrollView>
      </View>
      <View className="mx-5 mt-[40]">
        <TouchableOpacity
          style={styles.logoutButton}
          // onPress={() => navigation.navigate("")}
        >
          <Text style={styles.textItemRegular}>+ Add New Shipping Address</Text>
        </TouchableOpacity>
      </View>
      <View
        className="bg-white w-full h-[80px] absolute left-0 bottom-0 flex-row items-center justify-around pb-3"
        style={styles.navigationClass}
      >
        <TouchableOpacity
          style={styles.loginButton}
          // onPress={() => navigation.navigate("")}
        >
          <Text style={styles.loginButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textItemRegular: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  logoutButton: {
    borderColor: "#888888",
    borderWidth: 0.3,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dotted",
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
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  Vide: {
    width: 40,
    height: 40,
  },
  scroll: {
    borderTopWidth: 1,
    borderColor: "#F7F7F7",
    paddingTop: 18,
    height: "60%",
  },
  container: {
    flexGrow: 1,
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-centre",
    borderBottomWidth: 1,
    borderColor: "#F7F7F7",
  },
});

export default ShippingAddressScreen;
