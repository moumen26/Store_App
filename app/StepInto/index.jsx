import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Link, useNavigation } from "expo-router";
import { ArrowRightIcon } from "react-native-heroicons/outline";
import useAuthContext from "../hooks/useAuthContext";

const StepIntoImg = require("../../assets/images/StepInto.png");

const StepIntoScreen = () => {
  const navigation = useNavigation();
  const { markStepIntoAsSeen, completeAllOnboarding } = useAuthContext();

  const handleGetStarted = async () => {
    try {
      await markStepIntoAsSeen();
      navigation.navigate("Discover/index");
    } catch (error) {
      console.error("Error marking StepInto as seen:", error);
    }
  };

  const handleSignIn = async () => {
    try {
      // Complete all onboarding when skipping
      await completeAllOnboarding();
      navigation.navigate("SignIn/index");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };
  
  return (
    <View className="bg-white h-full">
      <View
        style={styles.ImageContainer}
        className="flex items-center justify-center"
      >
        <View style={styles.Container}></View>
        <Image style={styles.Image} source={StepIntoImg} />
      </View>
      <View className="mx-5 mt-[24] flex justify-center">
        <View className="flex h-[90] items-center justify-center">
          <Text style={styles.title}>Entrez dans notre Monde</Text>
          <Text style={styles.title} className="text-[#19213D]">
            de Magasins
          </Text>
        </View>
        <View className="flex items-center justify-center h-[50]">
          <Text style={styles.description}>
            Plongez-vous dans notre monde de magasins diversifiés, offrant tout
            ce dont vous avez besoin sous un même toit
          </Text>
        </View>
        <TouchableOpacity
          className="mt-[24]"
          style={styles.loginButton}
          onPress={handleGetStarted}
        >
          <Text style={styles.loginButtonText}>Commençons</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center space-x-1 mt-[28]">
          <Text style={styles.text}>Vous avez déjà un compte ?</Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.textForgotPassword}>Se connecter</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between mx-5 mt-[40]">
          {/* <BackButton /> */}
          <View className="flex-row space-x-2 items-center">
            <View className="w-[10] h-[10] rounded bg-[#EDEDED] mr-1"></View>
            <View className="w-[10] h-[10] rounded bg-[#19213D] mr-1"></View>
            <View className="w-[10] h-[10] rounded bg-[#EDEDED]"></View>
          </View>

          <TouchableOpacity style={styles.NextButton}>
            <ArrowRightIcon color="#fff" size={18} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textForgotPassword: {
    fontSize: 13,
    color: "#19213D",
    fontFamily: "Montserrat-Regular",
    textDecorationLine: "underline",
  },
  text: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#19213D",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  loginButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  ImageContainer: {
    width: "100%",
    height: 192,
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
    width: 400,
    height: "100%",
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

export default StepIntoScreen;
