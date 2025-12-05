import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { ArrowRightIcon } from "react-native-heroicons/outline";
import BackButton from "../../components/BackButton";
import { useNavigation } from "expo-router";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Cart = require("../../assets/images/Cart.png");

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

const YourCartScreen = () => {
  const navigation = useNavigation();
  const { markYourCartAsSeen, completeAllOnboarding } = useAuthContext();
  const insets = useSafeAreaInsets();

  // Calculate responsive values
  const horizontalPadding = screenWidth * 0.05;
  const verticalSpacing = screenHeight * 0.025;

  // Calculate responsive heights
  const imageContainerHeight = screenHeight * 0.5; // 60% of screen height
  const containerHeight = imageContainerHeight; // 100% of ImageContainer height
  const imageHeight = imageContainerHeight * 0.9; // 90% of ImageContainer height
  const imageWidth = getResponsiveDimension(500); // Responsive image width

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

  // Create dynamic styles
  const dynamicStyles = StyleSheet.create({
    ImageContainer: {
      width: "100%",
      height: imageContainerHeight,
      position: "relative",
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
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
      bottom: "-10%", // Position at the end (bottom) of the Container
      left: "50%", // Center horizontally
      transform: [{ translateX: -imageWidth / 2 }], // Offset by half the responsive width
      width: imageWidth,
      height: imageHeight,
      resizeMode: "contain",
      zIndex: 99,
    },
  });

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={dynamicStyles.ImageContainer}>
        <View style={dynamicStyles.Container}></View>
        <Image style={dynamicStyles.Image} source={Cart} />
        <TouchableOpacity
          onPress={handleSkip}
          style={[
            styles.skipContainer,
            {
              right: horizontalPadding,
              top: getResponsiveDimension(60),
            },
          ]}
        >
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginHorizontal: horizontalPadding,
          marginTop: verticalSpacing,
          justifyContent: "center",
          display: "flex",
        }}
      >
        <View
          style={{
            height: getResponsiveDimension(90),
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            paddingHorizontal: getResponsiveDimension(10),
          }}
        >
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
            Votre Panier
          </Text>
          <Text
            style={[styles.title, { color: "#19213D" }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            d'Achats
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
            Vérifiez vos articles sélectionnés avant de passer commande
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: screenWidth * 0.05,
            marginTop: getResponsiveDimension(40),
            alignItems: "center",
          }}
        >
          <BackButton />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: getResponsiveDimension(10),
                height: getResponsiveDimension(10),
                borderRadius: getResponsiveDimension(5),
                backgroundColor: "#EDEDED",
                marginRight: 4,
              }}
            ></View>
            <View
              style={{
                width: getResponsiveDimension(10),
                height: getResponsiveDimension(10),
                borderRadius: getResponsiveDimension(5),
                backgroundColor: "#19213D",
                marginRight: 4,
              }}
            ></View>
            <View
              style={{
                width: getResponsiveDimension(10),
                height: getResponsiveDimension(10),
                borderRadius: getResponsiveDimension(5),
                backgroundColor: "#EDEDED",
              }}
            ></View>
          </View>

          <TouchableOpacity
            style={[
              styles.NextButton,
              {
                width:
                  screenWidth <= 360
                    ? 35
                    : screenWidth <= 414
                    ? 45
                    : screenWidth <= 768
                    ? 55
                    : 65,
                height:
                  screenWidth <= 360
                    ? 35
                    : screenWidth <= 414
                    ? 45
                    : screenWidth <= 768
                    ? 55
                    : 65,
                borderRadius:
                  (screenWidth <= 360
                    ? 35
                    : screenWidth <= 414
                    ? 45
                    : screenWidth <= 768
                    ? 55
                    : 65) / 2,
              },
            ]}
            onPress={handleNextPress}
          >
            <ArrowRightIcon
              color="#fff"
              size={
                screenWidth <= 360
                  ? 16
                  : screenWidth <= 414
                  ? 18
                  : screenWidth <= 768
                  ? 22
                  : 26
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  NextButton: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#19213D",
    backgroundColor: "#19213D",
    borderWidth: 1,
  },
  skipContainer: {
    position: "absolute",
    zIndex: 99,
  },
  skipText: {
    fontSize: getResponsiveFontSize(14),
    fontFamily: "Montserrat-Regular",
    color: "#19213D",
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
});

export default YourCartScreen;
