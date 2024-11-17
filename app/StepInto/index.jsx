import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Link } from "expo-router";

const StepIntoImg = require("../../assets/images/StepInto.png");

const StepIntoScreen = () => {
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
          <Text style={styles.title}>Step into our World</Text>
          <Text style={styles.title} className="text-[#26667E]">
            of Stores
          </Text>
        </View>
        <View className="flex items-center justify-center h-[50]">
          <Text style={styles.description}>
            Immerse yourself in our world of diverse stores, offering everything
            you need under one roof
          </Text>
        </View>
        <View className="mt-[24]" style={styles.loginButton}>
          <Link href={"/Discover"}>
            <Text style={styles.loginButtonText}>Let’s get Started</Text>
          </Link>
        </View>
        <View className="flex-row justify-center items-center space-x-1 mt-[28]">
          <Text style={styles.text}>Already have an account?</Text>
          <Link href={"/SignIn"}>
            <Text style={styles.textForgotPassword}>Sign In</Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textForgotPassword: {
    fontSize: 13,
    color: "#26667E",
    fontFamily: "Montserrat-Regular",
    textDecorationLine: "underline",
  },
  text: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#26667E",
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
