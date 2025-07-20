import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { ArrowRightIcon } from "react-native-heroicons/outline";
import BackButton from "../../components/BackButton";
import { useNavigation } from "expo-router";
import { useAuthContext } from "../hooks/useAuthContext";

const Track = require("../../assets/images/Track.png");

const YourOrdersScreen = () => {
  const navigation = useNavigation();
  const { markYourOrdersAsSeen, completeAllOnboarding } = useAuthContext();

  const handleNextPress = async () => {
    try {
      await markYourOrdersAsSeen();
      // Navigate to SignIn since this is the last onboarding screen
      navigation.navigate("SignIn/index");
    } catch (error) {
      console.error("Error marking YourOrders as seen:", error);
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

  const handleBack = () => {
    // Navigate back to YourCart screen
    navigation.navigate("YourCart/index");
  };

  return (
    <>
      <View className="bg-white h-full">
        <View
          style={styles.ImageContainer}
          className="flex items-center justify-center"
        >
          <View style={styles.Container}></View>
          <Image style={styles.Image} source={Track} />
          <TouchableOpacity
            onPress={handleSkip}
            className="mx-5"
            style={styles.skipContainer}
          >
            <Text style={styles.skipText}>Passer</Text>
          </TouchableOpacity>
        </View>
        <View className="mx-5 mt-[24] flex justify-center">
          <View className="flex h-[90] items-center justify-center">
            <Text style={styles.title}>Restez informé avec</Text>
            <Text style={styles.title} className="text-[#19213D]">
              Vos Commandes
            </Text>
          </View>
          <View className="flex items-center justify-center h-[50]">
            <Text style={styles.description}>
              Restez à jour sur le statut de vos commandes et suivez leur
              progression en toute simplicité
            </Text>
          </View>
          <View className="flex-row justify-between mx-5 mt-[40]">
            <TouchableOpacity onPress={handleBack}>
              <BackButton />
            </TouchableOpacity>
            <View className="flex-row space-x-2 items-center">
              <View className="w-[10] h-[10] rounded bg-[#EDEDED] mr-1"></View>
              <View className="w-[10] h-[10] rounded bg-[#EDEDED] mr-1"></View>
              <View className="w-[10] h-[10] rounded bg-[#19213D]"></View>
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

export default YourOrdersScreen;
