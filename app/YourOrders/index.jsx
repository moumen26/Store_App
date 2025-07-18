import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { ArrowRightIcon } from "react-native-heroicons/outline";
import BackButton from "../../components/BackButton";
import { useNavigation } from "expo-router";

const Track = require("../../assets/images/Track.png");

const YourOrdersScreen = () => {
  const navigation = useNavigation();

  return (
    <>
      <View className="bg-white h-full">
        <View
          style={styles.ImageContainer}
          className="flex items-center justify-center"
        >
          <View style={styles.Container}></View>
          <Image style={styles.Image} source={Track} />
        </View>
        <View className="mx-5 mt-[24] flex justify-center">
          <View className="flex h-[90] items-center justify-center">
            <Text style={styles.title}>Stay in the know with</Text>
            <Text style={styles.title} className="text-[#19213D]">
              Your Orders
            </Text>
          </View>
          <View className="flex items-center justify-center h-[50]">
            <Text style={styles.description}>
              Stay updated with the status of your orders and track their
              progress with ease
            </Text>
          </View>
          <View className="flex-row justify-between mx-5 mt-[40]">
            <BackButton />
            <View className="flex-row space-x-2 items-center">
              <View className="w-[10] h-[10] rounded bg-[#EDEDED] mr-1"></View>
              <View className="w-[10] h-[10] rounded bg-[#EDEDED] mr-1"></View>
              <View className="w-[10] h-[10] rounded bg-[#19213D]"></View>
            </View>

            <TouchableOpacity
              style={styles.NextButton}
              onPress={() => navigation.navigate("SignIn/index")}
            >
              <ArrowRightIcon color="#fff" size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  NextButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#19213D",
    backgroundColor: "#19213D",
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

export default YourOrdersScreen;
