import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import { PencilSquareIcon } from "react-native-heroicons/outline";
import CartRow from "../../components/CartRow";
import CommandeDetailsItem from "../../components/CommandeDetailsItem";
import OrderType from "../../components/OrderType";
import CartRowModified from "../../components/CartRowModified";
import { useNavigation } from "expo-router";
import EditCartScreen from "../screens/EditCartScreen";

const Elio = require("../../assets/images/Elio.png");

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

const MyCartScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

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

  const renderDetailsItems = () => {
    const items = [];
    for (let i = 0; i < DATA.length; i += COLUMN_COUNT) {
      const rowItems = DATA.slice(i, i + COLUMN_COUNT).map((item) => (
        <CommandeDetailsItem
          key={item.id}
          ProductName={item.ProductName}
          ProductPriceTotal={item.ProductPriceTotal}
        />
      ));
      items.push(
        <View className="mb-2" key={i} style={styles.row}>
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
          My Cart
        </Text>
        <View style={styles.Vide}></View>
      </View>
      <View className="mx-5 flex-row justify-between items-center">
        <Text style={styles.titleCategory}>Order Details</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <PencilSquareIcon size={24} color="#26667E" />
        </TouchableOpacity>
      </View>
      <View className="h-[28%] mt-[12]">
        <ScrollView
          className="mx-5"
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {renderProductItems()}
        </ScrollView>
      </View>
      <View
        className="h-fit max-h-[23%] mx-5 mt-[12] pr-2 pl-2 pt-[12] pb-[12] flex-col space-y-2"
        style={styles.commandeContainer}
      >
        <Text style={styles.sousTitre}>Default Price</Text>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {renderDetailsItems()}
        </ScrollView>
        <View
          style={styles.subTotalContainer}
          className="flex-row items-center justify-between w-full pt-[12]"
        >
          <Text style={styles.sousTitre}>Sub total</Text>
          <Text style={styles.sousTitre}>DA 9990</Text>
        </View>
      </View>
      <View className="mx-5 flex-col mt-[12]">
        <Text className="mb-[12]" style={styles.titleCategory}>
          Order Type
        </Text>
        <OrderType navigation={navigation} />
      </View>
      <View
        className="bg-white w-full h-[80px] absolute left-0 bottom-0 flex-row items-center justify-around pb-3"
        style={styles.navigationClass}
      >
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("E-Receipt/index")}
        >
          <Text style={styles.loginButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <EditCartScreen onClose={() => setModalVisible(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  commandeContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F7F7F7",
  },
  subTotalContainer: {
    borderTopWidth: 1,
    borderColor: "#F7F7F7",
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
  sousTitre: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  Vide: {
    width: 40,
    height: 40,
  },
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-centre",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(201, 228, 238, 0.4)",
  },
});

export default MyCartScreen;
