import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import { ArrowRightIcon } from "react-native-heroicons/outline";

const Home = require("../../assets/images/Home.png");

const DiscoverScreen = () => {
  const navigation = useNavigation();

  return (
    <View className="bg-white h-full">
      <View
        style={styles.ImageContainer}
        className="flex items-center justify-center"
      >
        <View style={styles.Container}></View>
        <Image style={styles.Image} source={Home} />
        {/* <TouchableOpacity
          onPress={() => navigation.navigate("SignIn/index")}
          className="mx-5"
          style={styles.skipContainer}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity> */}
      </View>
      <View className="mx-5 mt-[24] flex justify-center">
        <View className="flex h-[90] items-center justify-center">
          <Text style={styles.title}>Découvrez le monde</Text>
          <Text style={styles.title} className="text-[#26667E]">
            de votre magasin
          </Text>
        </View>
        <View className="flex items-center justify-center h-[50]">
          <Text style={styles.description}>
            Le magasin est le premier tout-en-un au monde
          </Text>
        </View>

        <View className="flex-row justify-between mx-5 mt-[40]">
          <View style={styles.Vide}></View>
          <View
            className="flex-row justify-center items-center"
            style={styles.threePoint}
          >
            <View className="w-[10] h-[10] rounded bg-[#26667E] mr-1"></View>
            <View className="w-[10] h-[10] rounded bg-[#EDEDED] mr-1"></View>
            <View className="w-[10] h-[10] rounded bg-[#EDEDED]"></View>
          </View>

          <TouchableOpacity
            style={styles.NextButton}
            onPress={() => navigation.navigate("YourCart/index")}
          >
            <ArrowRightIcon color="#fff" size={18} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Vide: {
    width: 40,
    height: 40,
  },
  NextButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#26667E",
    backgroundColor: "#26667E",
    borderWidth: 1,
  },
  ImageContainer: {
    width: "100%",
    height: 492,
    position: "relative",
    overflow: "hidden",
  },
  Container: {
    position: "absolute",
    width: 5000,
    height: 5000,
    top: -4504,
    left: -2305,
    backgroundColor: "#E7F2F7",
    zIndex: 1,
    borderRadius: 4000,
  },
  Image: {
    position: "absolute",
    bottom: -58,
    width: 300,
    height: "90%",
    resizeMode: "contain",
    zIndex: 99,
  },
  skipContainer: {
    position: "absolute",
    right: 0,
    zIndex: 99,
  },
  skipText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#26667E",
  },
  title: {
    fontFamily: "Montserrat-Regular",
    fontSize: 30,
    textAlign: "center",
  },
  description: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    textAlign: "center",
    color: "#888888",
  },
});

export default DiscoverScreen;
