import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

import {
  MagnifyingGlassIcon,
  BellIcon,
  ShoppingCartIcon,
} from "react-native-heroicons/outline";

import PopularProductCard from "../../components/PopularProductCard";
import BrandsCard from "../../components/BrandsCard";
import SliderStore from "../../components/SliderStore";
import ProductScreen from "../screens/ProductScreen";

const StoreIconVector = require("../../assets/icons/Store.png");

const BrandCevitalImg = require("../../assets/images/Cevital.jpg");
const BrandLesieurImg = require("../../assets/images/Lesieur.png");
const BrandMamaImg = require("../../assets/images/Mama.png");
const BrandSimImg = require("../../assets/images/Sim.png");

const ElioImg = require("../../assets/images/Elio.png");
const MamaCoucousImg = require("../../assets/images/MamaCoucous.png");

const Store = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="relative h-full"
      >
        <View className="flex-row items-center mx-5 mb-[10] space-x-3">
          <View className="flex-1 gap-1">
            <Text style={styles.text} className="text-gray-400">
              Store
            </Text>
            <View
              style={styles.iconText}
              className="flex-row items-center space-x-1"
            >
              {/* <MapPinIcon size={20} color="#26667E" /> */}
              <Image source={StoreIconVector} />

              <Text style={styles.text}>Hamza Alimentation</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("MyCart/index")}
            style={styles.notification}
          >
            <ShoppingCartIcon size={18} color="#26667E" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="flex-row items-center space-x-2 mx-5 mb-[10]"
          style={styles.searchClass}
        >
          <View
            style={styles.searchButton}
            className="flex-1 flex-row items-center space-x-2 pl-5 h-[50px] border-[1px] rounded-3xl"
          >
            <MagnifyingGlassIcon color="#888888" size={20} />
            <Text style={styles.search}>Search by Product..</Text>
          </View>
        </TouchableOpacity>
        <View className="mx-5 mb-[20]">
          <Text style={styles.titleCategory}>#SpecialForYou</Text>
          <SliderStore />
        </View>
        <View className="mx-5 mb-[20]">
          <Text style={styles.titleCategory}>Brands</Text>
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 10 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <BrandsCard imgUrl={BrandCevitalImg} onPress={"Brand/index"} />
            <BrandsCard imgUrl={BrandLesieurImg} />
            <BrandsCard imgUrl={BrandMamaImg} />
            <BrandsCard imgUrl={BrandSimImg} />
          </ScrollView>
        </View>
        <View className="mx-5 mb-[20]">
          <View className="flex-row items-center justify-between">
            <Text style={styles.titleCategory}>Popular Products</Text>
            <TouchableOpacity>
              <Text
                onPress={() => navigation.navigate("PopularProducts/index")}
                style={styles.seeAll}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center justify-around mt-4">
            <PopularProductCard
              imgUrl={MamaCoucousImg}
              ProductName="Couscous Moyen    Mama - 1kg"
              onPress={() => setModalVisible(true)}

              // onPress={"Product/index"}
            />
            <PopularProductCard
              imgUrl={ElioImg}
              ProductName="Elio - 1L"
              onPress={() => setModalVisible(true)}
            />
          </View>
        </View>
        <View className="mx-5 mb-3">
          <View className="flex-row items-center justify-between">
            <Text style={styles.titleCategory}>All Products</Text>
            <TouchableOpacity>
              <Text
                onPress={() => navigation.navigate("AllProducts/index")}
                style={styles.seeAll}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center justify-around mt-4">
            <PopularProductCard
              imgUrl={MamaCoucousImg}
              ProductName="Couscous Moyen    Mama - 1kg"
            />
            <PopularProductCard imgUrl={ElioImg} ProductName="Elio - 1L" />
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          {/* Pass the correct function as a prop */}
          <ProductScreen onclose={() => setModalVisible(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  iconText: {
    gap: 4,
  },
  text: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  notification: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderColor: "#3E9CB9",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  search: {
    color: "#888888",
    borderColor: "#26667E",
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
  seeAll: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    color: "#26667E",
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
  searchClass: {
    marginBottom: 10,
  },
  searchButton: {
    flex: 1,
    gap: 4,
    paddingLeft: 15,
    height: 50,
    borderWidth: 1,
    borderColor: "#26667E",
    borderRadius: 30,
    alignItems: "center",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(201, 228, 238, 0.4)",
  },
});

export default Store;
