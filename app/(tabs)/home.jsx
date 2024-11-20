import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MagnifyingGlassIcon, BellIcon } from "react-native-heroicons/outline";
import SpecialForYouCard from "../../components/SpecialForYouCard";
import Store from "../../components/Store";
import { useNavigation } from "expo-router";

const LocationIconVector = require("../../assets/icons/Location.png");
const SpecialForYouCardImg1 = require("../../assets/images/SpecialForYouBingo.jpg");
const SpecialForYouCardImg2 = require("../../assets/images/SpecialForYouAigle.jpg");
const SpecialForYouCardImg3 = require("../../assets/images/SpecialForYouAmir.jpg");

const home = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex-row items-center mx-5 space-x-3">
        <View style={styles.topClass}>
          <Text style={styles.text} className="text-gray-400">
            Location
          </Text>
          <View style={styles.iconText} className="flex-row">
            <Image source={LocationIconVector} />
            <Text style={styles.text}>Blida, Algeria</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notification}>
          <BellIcon size={18} color="#26667E" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="flex-row items-center space-x-2 mx-5 mb-5"
        style={styles.searchClass}
        onPress={() => navigation.navigate("Search/index")}
      >
        <View
          style={styles.searchButton}
          className="flex-1 flex-row items-center space-x-2 pl-5 h-12 border-1 rounded-3xl"
        >
          <MagnifyingGlassIcon color="#888888" size={20} />
          <Text style={styles.search}>Search by Store..</Text>
        </View>
      </TouchableOpacity>

      <View className="mx-5" style={styles.specialForYou}>
        <Text style={styles.titleCategory}>#SpecialForYou</Text>
        <ScrollView
          contentContainerStyle={{
            flexDirection: "row",
            gap: 6,
            paddingTop: 10,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <SpecialForYouCard imgUrl={SpecialForYouCardImg1} />
          <SpecialForYouCard imgUrl={SpecialForYouCardImg2} />
          <SpecialForYouCard imgUrl={SpecialForYouCardImg3} />
        </ScrollView>
      </View>

      <View className="mx-5 mt-[10]">
        <Text style={styles.titleCategory}>Stores</Text>
        <Store />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  specialForYou: {
    marginBottom: 10,
  },
  searchClass: {
    marginTop: 10,
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
  topClass: {
    flex: 1,
    gap: 4,
    flexDirection: "column",
  },
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
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
});

export default home;
