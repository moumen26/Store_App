import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { Link, useNavigation } from "expo-router";
import { ArrowRightIcon } from "react-native-heroicons/outline";
import useAuthContext from "../hooks/useAuthContext";

const StepIntoImg = require("../../assets/images/StepInto.png");

// Get screen dimensions
const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

// Helper function to get responsive font size
const getResponsiveFontSize = (baseSize) => {
  const scale = screenWidth / 375; // Base width (iPhone X)
  const newSize = baseSize * scale;

  // Screen size categories
  if (screenWidth <= 360) {
    // Small screens
    return Math.max(newSize * 0.85, baseSize * 0.8);
  } else if (screenWidth <= 414) {
    // Medium screens
    return newSize;
  } else {
    // Large screens
    return Math.min(newSize * 1.1, baseSize * 1.3);
  }
};

// Helper function to get responsive dimensions
const getResponsiveDimension = (baseSize) => {
  const scale = screenWidth / 375;
  const newSize = baseSize * scale;

  if (screenWidth <= 360) {
    // Small screens
    return Math.max(newSize * 0.9, baseSize * 0.85);
  } else if (screenWidth <= 414) {
    // Medium screens
    return newSize;
  } else {
    // Large screens
    return Math.min(newSize * 1.1, baseSize * 1.2);
  }
};

const StepIntoScreen = () => {
  const navigation = useNavigation();
  const { markStepIntoAsSeen, completeAllOnboarding } = useAuthContext();

  // Calculate responsive heights
  const imageContainerHeight = screenHeight * 0.5; // 60% of screen height
  const containerHeight = imageContainerHeight; // 100% of ImageContainer height
  const imageHeight = imageContainerHeight * 0.9; // 90% of ImageContainer height (bigger image)
  const imageWidth = getResponsiveDimension(500); // Responsive image width

  const handleGetStarted = async () => {
    try {
      await markStepIntoAsSeen();
      navigation.navigate("YourCart/index");
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

  // Create dynamic styles
  const dynamicStyles = StyleSheet.create({
    ImageContainer: {
      width: "100%",
      height: imageContainerHeight,
      position: "relative",
      overflow: "hidden",
    },
    Container: {
      position: "absolute",
      width: 5000,
      height: containerHeight + 4504, // Keep the same proportion for the circular background
      top: -4504,
      left: -2305,
      backgroundColor: "#E7F2F7",
      zIndex: 1,
      borderRadius: 4000,
    },
    Image: {
      position: "absolute",
      bottom: 0, // Position at the end (bottom) of the Container
      left: "50%", // Center horizontally
      transform: [{ translateX: -imageWidth / 2 }], // Offset by half the responsive width
      width: imageWidth, // Responsive image width
      height: imageHeight,
      resizeMode: "contain",
      zIndex: 99,
    },
  });

  return (
    <View className="bg-white h-full">
      <View
        style={dynamicStyles.ImageContainer}
        className="flex items-center justify-center"
      >
        <View style={dynamicStyles.Container}></View>
        <Image style={dynamicStyles.Image} source={StepIntoImg} />
      </View>
      <View className="mx-5 mt-[24] flex justify-center">
        <View
          style={{
            height: getResponsiveDimension(90),
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Text style={styles.title}>Entrez dans notre</Text>
          <Text style={styles.title} className="text-[#19213D]">
            monde de magasins
          </Text>
        </View>
        <View
          style={{
            height: getResponsiveDimension(50),
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Text style={styles.description}>
            Plongez-vous dans notre monde de magasins diversifiés, offrant tout
            ce dont vous avez besoin sous un même toit
          </Text>
        </View>
        <TouchableOpacity
          className="mt-[48]"
          style={styles.loginButton}
          onPress={handleGetStarted}
        >
          <Text style={styles.loginButtonText}>Commencer</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center space-x-1 mt-[28]">
          <Text style={styles.text}>Vous avez déjà un compte ?</Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.textForgotPassword}>Se connecter</Text>
          </TouchableOpacity>
        </View>


      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textForgotPassword: {
    fontSize: getResponsiveFontSize(13),
    color: "#19213D",
    fontFamily: "Montserrat-Regular",
    textDecorationLine: "underline",
    marginLeft: 5,
  },
  text: {
    fontSize: getResponsiveFontSize(13),
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#19213D",
    borderRadius: 10,
    height: getResponsiveDimension(50),
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  loginButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: getResponsiveFontSize(16),
    fontFamily: "Montserrat-Regular",
  },
  title: {
    fontFamily: "Montserrat-Regular",
    fontSize: getResponsiveFontSize(30),
    textAlign: "center",
  },
  description: {
    fontFamily: "Montserrat-Regular",
    fontSize: getResponsiveFontSize(13),
    textAlign: "center",
    color: "#888888",
  },
  NextButton: {
    // Add your NextButton styles here if missing
    backgroundColor: "#19213D",
    borderRadius: getResponsiveDimension(25),
    width: getResponsiveDimension(50),
    height: getResponsiveDimension(50),
    justifyContent: "center",
    alignItems: "center",
  },
  NextButtonPlaceHolder: {
    width: getResponsiveDimension(50),
    height: getResponsiveDimension(50),
  },
});

export default StepIntoScreen;
