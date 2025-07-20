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

const ResetPassword = () => {
  const navigation = useNavigation();

  // Get screen dimensions
  const { width, height } = useWindowDimensions();

  // Calculate responsive values
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Responsive spacing calculations
  const horizontalPadding = width * 0.05;
  const verticalSpacing = height * 0.025;
  const topMargin = isSmallScreen ? 30 : isLargeScreen ? 50 : 40;
  const buttonHeight = isSmallScreen ? 45 : isLargeScreen ? 55 : 50;

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
            marginTop: topMargin,
          },
        ]}
      >
        <Text
          style={[
            styles.titleCategory,
            { fontSize: isSmallScreen ? 26 : isLargeScreen ? 34 : 30 },
          ]}
        >
          Réinitialiser le mot de passe
        </Text>
        <Text
          style={[
            styles.sousTitle,
            { fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13 },
          ]}
        >
          Entrez votre numéro de téléphone pour recevoir un code
        </Text>

        <View
          style={[styles.column, { marginTop: verticalSpacing, width: "100%" }]}
        >
          <Text
            style={[
              styles.textlabel,
              { fontSize: isSmallScreen ? 13 : isLargeScreen ? 16 : 14 },
            ]}
          >
            Numéro de téléphone
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                height: buttonHeight,
                borderRadius: isSmallScreen ? 8 : 10,
                paddingLeft: isSmallScreen ? 12 : 15,
                paddingRight: isSmallScreen ? 12 : 15,
                fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12,
              },
            ]}
            placeholder="+213 000 000 000"
            placeholderTextColor="#888888"
            // value={}
            // onChangeText={}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.loginButton,
            {
              marginTop: verticalSpacing,
              height: buttonHeight,
              borderRadius: isSmallScreen ? 8 : 10,
            },
          ]}
          // onPress={() => navigation.navigate("SignInScreen")}
        >
          <Text
            style={[
              styles.loginButtonText,
              { fontSize: isSmallScreen ? 14 : isLargeScreen ? 18 : 16 },
            ]}
          >
            Envoyer le code
          </Text>
        </TouchableOpacity>
        <View
          style={[styles.linkContainer, { marginTop: verticalSpacing * 0.5 }]}
        >
          <Text
            style={[
              styles.textSousSignIn,
              { fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13 },
            ]}
          >
            Vous vous souvenez de votre mot de passe ?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn/index")}>
            <Text
              style={[
                styles.textForgotPassword,
                { fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13 },
              ]}
            >
              Se connecter
            </Text>
          </TouchableOpacity>
        </View>
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
  resetPassword: {
    width: "100%",
    flexDirection: "column",
    gap: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontFamily: "Montserrat-Regular",
  },
  loginButton: {
    backgroundColor: "#19213D",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  textSousSignIn: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    color: "#888888",
    marginRight: 4,
  },
  titleCategory: {
    textAlign: "left",
    fontFamily: "Montserrat-Regular",
  },
  sousTitle: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  verifyContainer: {
    flexDirection: "column",
    gap: 12,
    alignItems: "center",
  },
  codeInputs: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  textlabel: {
    color: "#888888",
    fontFamily: "Montserrat-Regular",
  },
  textInput: {
    width: "100%",
    backgroundColor: "#F7F7F7",
    fontFamily: "Montserrat-Regular",
  },
  column: {
    flexDirection: "column",
    gap: 20,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  textForgotPassword: {
    color: "#19213D",
    marginTop: 12,
    fontFamily: "Montserrat-Regular",
    textDecorationLine: "underline",
  },
});

export default ResetPassword;
