import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowRightIcon } from "react-native-heroicons/outline";
import { useAuthContext } from "../hooks/useAuthContext";

const Home = require("../../assets/images/Home.png");

const DiscoverScreen = () => {
  const navigation = useNavigation();
  const { markDiscoverAsSeen, completeAllOnboarding } = useAuthContext();

  // Get screen dimensions
  const { width, height } = useWindowDimensions();

  // Calculate responsive values
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Responsive spacing calculations
  const horizontalPadding = width * 0.05;
  const verticalSpacing = height * 0.025;

  // Calculate image container height based on screen size
  const imageContainerHeight = isSmallScreen
    ? height * 0.45
    : isMediumScreen
    ? height * 0.5
    : height * 0.55;

  // Calculate image dimensions
  const imageWidth = isSmallScreen
    ? width * 0.7
    : isMediumScreen
    ? width * 0.6
    : width * 0.5;
  const imageHeight = imageContainerHeight * 0.9;

  const handleNextPress = async () => {
    try {
      await markDiscoverAsSeen();
      navigation.navigate("YourCart/index");
    } catch (error) {
      console.error("Error marking Discover as seen:", error);
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
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={[styles.imageContainer, { height: imageContainerHeight }]}>
        <View style={styles.circleContainer}></View>
        <Image
          style={[
            styles.image,
            {
              width: imageWidth,
              height: imageHeight,
              bottom: isSmallScreen ? -30 : isMediumScreen ? -50 : -70,
            },
          ]}
          source={Home}
        />
        <TouchableOpacity
          onPress={handleSkip}
          style={[
            styles.skipContainer,
            { right: horizontalPadding, top: 50 }
          ]}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.contentContainer,
          {
            marginHorizontal: horizontalPadding,
            marginTop: verticalSpacing,
          },
        ]}
      >
        <View
          style={[styles.titleContainer, { height: isSmallScreen ? 70 : 90 }]}
        >
          <Text
            style={[
              styles.title,
              { fontSize: isSmallScreen ? 24 : isLargeScreen ? 36 : 30 },
            ]}
          >
            Découvrez le monde
          </Text>
          <Text
            style={[
              styles.title,
              {
                fontSize: isSmallScreen ? 24 : isLargeScreen ? 36 : 30,
                color: "#19213D",
              },
            ]}
          >
            de votre magasin
          </Text>
        </View>

        <View
          style={[
            styles.descriptionContainer,
            { height: isSmallScreen ? 40 : 50 },
          ]}
        >
          <Text
            style={[
              styles.description,
              { fontSize: isSmallScreen ? 12 : isLargeScreen ? 16 : 13 },
            ]}
          >
            Le magasin est le premier tout-en-un au monde
          </Text>
        </View>

        <View
          style={[
            styles.navigationRow,
            {
              marginHorizontal: width * 0.05,
              marginTop: isSmallScreen ? height * 0.03 : height * 0.04,
            },
          ]}
        >
          <View
            style={[
              styles.vide,
              {
                width: isSmallScreen ? 32 : 40,
                height: isSmallScreen ? 32 : 40,
              },
            ]}
          ></View>

          <View style={styles.indicatorContainer}>
            <View style={styles.inactiveIndicator}></View>
            <View style={styles.activeIndicator}></View>
            <View style={[styles.inactiveIndicator, { marginRight: 0 }]}></View>
          </View>

          <TouchableOpacity
            style={[
              styles.nextButton,
              {
                width: isSmallScreen ? 32 : 40,
                height: isSmallScreen ? 32 : 40,
                borderRadius: isSmallScreen ? 16 : 20,
              },
            ]}
            onPress={handleNextPress}
          >
            <ArrowRightIcon color="#fff" size={isSmallScreen ? 16 : 18} />
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
  vide: {
    // Dimensions set dynamically
  },
  nextButton: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#19213D",
    backgroundColor: "#19213D",
    borderWidth: 1,
  },
  imageContainer: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  circleContainer: {
    position: "absolute",
    width: 5000,
    height: 5000,
    top: -4504,
    left: -2305,
    backgroundColor: "#E7F2F7",
    zIndex: 1,
    borderRadius: 4000,
  },
  image: {
    position: "absolute",
    resizeMode: "contain",
    zIndex: 99,
  },
  skipContainer: {
    position: "absolute",
    zIndex: 99,
  },
  skipText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#19213D",
  },
  contentContainer: {
    justifyContent: "center",
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  descriptionContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    color: "#888888",
  },
  navigationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  activeIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#19213D",
    marginRight: 4,
  },
  inactiveIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EDEDED",
    marginRight: 4,
  },
});

export default DiscoverScreen;