import React, { useLayoutEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import { StyleSheet } from "react-native";
import ShippingAddressCard from "../../components/ShippingAddressCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import useAuthContext from "../hooks/useAuthContext";

const ShippingAddressScreen = () => {
  const { cart, user, dispatch } = useAuthContext();
  const route = useRoute();
  const { storeId } = route.params;
  const navigation = useNavigation();
  // Filter cart items for the current store
  const storeCart = cart?.filter((item) => item.store == storeId) || [];
  const [selectedIndex, setSelectedIndex] = useState(null);
  const handleSelectItem = (index) => {
    setSelectedIndex(index);
  };
  
  const renderItems = () =>
    user?.info?.storeAddresses?.map((item, index) => (
      <View key={index} style={[styles.mb4, styles.row]}>
        <ShippingAddressCard
          key={item?._id}
          index={item?._id}
          AddressTitle={item?.name}
          AddressPlace={item?.address}
          AddressTime={`${25} minutes estimate arrived`}
          isSelected={item?._id == selectedIndex}
          onSelect={handleSelectItem}
        />
      </View>
    ));
    const handleApplyPress = () => {
      if(!storeCart || storeCart?.length <= 0){
        // Notify the user to select an address
        alert("Please select some products after you can choose an address")
        return;
      }
      if (selectedIndex == null) {
        // Notify the user to select an address
        alert("Please select an address.");
        return;
      }
      // Dispatch the selected address to the cart
      const selectedAddress = user?.info?.storeAddresses?.find(item => item._id === selectedIndex);
      if (selectedAddress) {
        dispatch({ type: "ADD_TO_CART_ADDRESS", payload: {
          selectedAddress: selectedAddress,
          storeId: storeId
        } });
        setSelectedIndex(null);
        navigation.goBack(); // Navigate back to the previous screen
      } else {
        alert("Selected address not found.");
      }
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
          onPress={handleApplyPress}
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
