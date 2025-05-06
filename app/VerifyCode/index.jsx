import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import { useNavigation } from "@react-navigation/native";

const VerifyCodeScreen = () => {
  const navigation = useNavigation();

  // Get screen dimensions
  const { width, height } = useWindowDimensions();

  // Calculate responsive values
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Responsive spacing calculations
  const horizontalPadding = width * 0.05;
  const buttonWidth = width * 0.85;
  const buttonHeight = isSmallScreen ? 45 : isLargeScreen ? 55 : 50;
  const codeInputSize = isSmallScreen ? 50 : isLargeScreen ? 70 : 60;
  const codeInputHeight = isSmallScreen ? 40 : isLargeScreen ? 50 : 45;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ marginHorizontal: horizontalPadding }}>
        <BackButton />
      </View>
      <View
        style={[
          styles.verifyContainer,
          {
            marginHorizontal: horizontalPadding,
            marginTop: isSmallScreen ? 30 : 40,
          },
        ]}
      >
        <View style={styles.verifyContainer}>
          <Text
            style={[
              styles.titleCategory,
              { fontSize: isSmallScreen ? 26 : isLargeScreen ? 34 : 30 },
            ]}
          >
            Vérifier le code
          </Text>
          <View style={styles.emailContainer}>
            <Text
              style={[
                styles.sousTitle,
                { fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13 },
              ]}
            >
              Veuillez entrer le code que nous venons d'envoyer à votre email
            </Text>
            <Text
              style={[
                styles.emailText,
                { fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13 },
              ]}
            >
              exemple@gmail.com
            </Text>
          </View>
        </View>
        <View style={[styles.codeInputs, { gap: isSmallScreen ? 8 : 10 }]}>
          <TextInput
            style={[
              styles.codeInput,
              {
                width: codeInputSize,
                height: codeInputHeight,
                borderRadius: isSmallScreen ? 8 : 10,
                fontSize: isSmallScreen ? 14 : isLargeScreen ? 18 : 16,
              },
            ]}
            placeholder="-"
            placeholderTextColor="#888888"
          />
          <TextInput
            style={[
              styles.codeInput,
              {
                width: codeInputSize,
                height: codeInputHeight,
                borderRadius: isSmallScreen ? 8 : 10,
                fontSize: isSmallScreen ? 14 : isLargeScreen ? 18 : 16,
              },
            ]}
            placeholder="-"
            placeholderTextColor="#888888"
          />
          <TextInput
            style={[
              styles.codeInput,
              {
                width: codeInputSize,
                height: codeInputHeight,
                borderRadius: isSmallScreen ? 8 : 10,
                fontSize: isSmallScreen ? 14 : isLargeScreen ? 18 : 16,
              },
            ]}
            placeholder="-"
            placeholderTextColor="#888888"
          />
          <TextInput
            style={[
              styles.codeInput,
              {
                width: codeInputSize,
                height: codeInputHeight,
                borderRadius: isSmallScreen ? 8 : 10,
                fontSize: isSmallScreen ? 14 : isLargeScreen ? 18 : 16,
              },
            ]}
            placeholder="-"
            placeholderTextColor="#888888"
          />
        </View>
        <View style={styles.resendContainer}>
          <Text
            style={[
              styles.textSousSignIn,
              { fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13 },
            ]}
          >
            Vous n'avez pas reçu le code ?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
            <Text
              style={[
                styles.textForgotPassword,
                { fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13 },
              ]}
            >
              Renvoyer le code
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.loginButton,
            {
              width: buttonWidth,
              height: buttonHeight,
              borderRadius: isSmallScreen ? 8 : 10,
              marginTop: isSmallScreen ? 20 : 24,
            },
          ]}
          onPress={() => navigation.navigate("SignInScreen")}
        >
          <Text
            style={[
              styles.loginButtonText,
              { fontSize: isSmallScreen ? 14 : isLargeScreen ? 18 : 16 },
            ]}
          >
            Vérifier
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 10 : 3,
    height: "100%",
  },
  loginButtonText: {
    color: "#fff",
    fontFamily: "Montserrat-Regular",
  },
  loginButton: {
    backgroundColor: "#63BBF5",
    justifyContent: "center",
    alignItems: "center",
  },
  textSousSignIn: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    color: "#888888",
  },
  textForgotPassword: {
    fontFamily: "Montserrat-Regular",
    textDecorationLine: "underline",
    color: "#63BBF5",
  },
  titleCategory: {
    fontFamily: "Montserrat-Regular",
  },
  sousTitle: {
    fontFamily: "Montserrat-Regular",
  },
  emailText: {
    color: "#62B5CE",
    fontFamily: "Montserrat-Regular",
  },
  codeInput: {
    textAlign: "center",
    fontFamily: "Montserrat-Regular",
    backgroundColor: "#F7F7F7",
  },
  verifyContainer: {
    flexDirection: "column",
    gap: 12,
    alignItems: "center",
  },
  emailContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  codeInputs: {
    flexDirection: "row",
    alignItems: "center",
  },
  resendContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default VerifyCodeScreen;
