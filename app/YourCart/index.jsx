
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { ArrowRightIcon } from "react-native-heroicons/outline";
import BackButton from "../../components/BackButton";
import { useNavigation } from "expo-router";
import { useAuthContext } from "../hooks/useAuthContext";

const Cart = require("../../assets/images/Cart.png");

const YourCartScreen = () => {
  const navigation = useNavigation();
  const { markYourCartAsSeen, completeAllOnboarding } = useAuthContext();

  const handleNextPress = async () => {
    try {
      await markYourCartAsSeen();
      navigation.navigate("YourOrders/index");
    } catch (error) {
      console.error("Error marking YourCart as seen:", error);
    }
  };

  const handleSkip = async () => {
    try {
      // Complete all onboarding when skipping
      await completeAllOnboarding();
      navigation.navigate("SignIn/index");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  return (
    <>
      <View className="bg-white h-full">
        <View
          style={styles.ImageContainer}
          className="flex items-center justify-center"
        >
          <View style={styles.Container}></View>
          <Image style={styles.Image} source={Cart} />
          <TouchableOpacity
            onPress={handleSkip}
            className="mx-5"
            style={styles.skipContainer}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
        <View className="mx-5 mt-[24] flex justify-center">
          <View className="flex h-[90] items-center justify-center">
            <Text style={styles.title}>Your Shopping</Text>
            <Text style={styles.title} className="text-[#19213D]">
              Cart
            </Text>
          </View>
          <View className="flex items-center justify-center h-[50]">
            <Text style={styles.description}>
              Review your selected items before checkout
            </Text>
          </View>
          <View className="flex-row justify-between mx-5 mt-[40]">
            <BackButton />
            <View className="flex-row space-x-2 items-center">
              <View className="w-[10] h-[10] rounded bg-[#EDEDED] mr-1"></View>
              <View className="w-[10] h-[10] rounded bg-[#EDEDED] mr-1"></View>
              <View className="w-[10] h-[10] rounded bg-[#19213D] mr-1"></View>
              <View className="w-[10] h-[10] rounded bg-[#EDEDED]"></View>
            </View>

            <TouchableOpacity
              style={styles.NextButton}
              onPress={handleNextPress}
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
  skipContainer: {
    position: "absolute",
    top: 20,
    right: 0,
    zIndex: 99,
  },
  skipText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#19213D",
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

export default YourCartScreen;
