import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline";
import { useAuthContext } from "../hooks/useAuthContext.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "../config.jsx";

const FacebookIconVector = require("../../assets/icons/Facebook.png");

const SignInScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { dispatch, completeAllOnboarding } = useAuthContext();

  // Complete onboarding when user reaches SignIn screen
  useEffect(() => {
    const completeOnboarding = async () => {
      try {
        await completeAllOnboarding();
      } catch (error) {
        console.error("Error completing onboarding on SignIn:", error);
      }
    };

    completeOnboarding();
  }, [completeAllOnboarding]);

  // Get screen dimensions
  const { width, height } = useWindowDimensions();

  // Calculate responsive values
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Responsive spacing calculations
  const horizontalPadding = width * 0.05;
  const buttonHeight = isSmallScreen ? 45 : isLargeScreen ? 55 : 50;
  const inputHeight = isSmallScreen ? 45 : isLargeScreen ? 55 : 50;

  const handleLogin = async () => {
    setError("");
    try {
      const response = await fetch(`${Config.API_URL}/Auth/signin/client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserName: userName,
          Password: password,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.message);
      } else {
        await AsyncStorage.setItem("user", JSON.stringify(json));
        dispatch({ type: "LOGIN", payload: json });
        // navigation.navigate("(tabs)");
        navigation.reset({
          index: 0,
          routes: [{ name: "(tabs)" }],
        });
        setPassword("");
        setUserName("");
        setError("");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.SignInScreen}>
      <View style={styles.headerContainer}>
        <Text
          style={[
            styles.textSignIn,
            { fontSize: isSmallScreen ? 26 : isLargeScreen ? 34 : 30 },
          ]}
        >
          Se connecter
        </Text>
        <Text
          style={[
            styles.textSousSignIn,
            { fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13 },
          ]}
        >
          Bonjour, heureux de vous revoir. Votre présence nous a manqué.
        </Text>
      </View>
      <View
        style={{
          marginHorizontal: horizontalPadding,
          marginTop: isSmallScreen ? 30 : 36,
        }}
      >
        <View
          style={[styles.column, { marginBottom: isSmallScreen ? 14 : 16 }]}
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
              { height: inputHeight, borderRadius: isSmallScreen ? 8 : 10 },
            ]}
            placeholder="+213 000 00 00 00"
            placeholderTextColor="#888888"
            value={userName}
            onChangeText={setUserName}
          />
        </View>
        <View style={styles.column}>
          <Text
            style={[
              styles.textlabel,
              { fontSize: isSmallScreen ? 13 : isLargeScreen ? 16 : 14 },
            ]}
          >
            Mot de passe
          </Text>
          <View
            style={[
              styles.passwordContainer,
              { height: inputHeight, borderRadius: isSmallScreen ? 8 : 10 },
            ]}
          >
            <TextInput
              style={[
                styles.textInputPassword,
                { fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12 },
              ]}
              placeholder="********"
              placeholderTextColor="#888888"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeIcon}
            >
              {passwordVisible ? (
                <EyeSlashIcon
                  size={isSmallScreen ? 18 : isLargeScreen ? 22 : 20}
                  color="#888888"
                />
              ) : (
                <EyeIcon
                  size={isSmallScreen ? 18 : isLargeScreen ? 22 : 20}
                  color="#888888"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={{ marginTop: isSmallScreen ? 22 : 26 }}
          onPress={() => navigation.navigate("ResetPassword/index")}
        >
          <Text
            style={[
              styles.textForgotPassword,
              { fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13 },
            ]}
          >
            Mot de passe oublié ?
          </Text>
        </TouchableOpacity>
        <Text
          style={[styles.errorText, { marginTop: isSmallScreen ? 12 : 16 }]}
        >
          {error}
        </Text>
        <TouchableOpacity
          style={[
            styles.loginButton,
            {
              height: buttonHeight,
              borderRadius: isSmallScreen ? 8 : 10,
              marginTop: isSmallScreen ? 20 : 24,
            },
          ]}
          onPress={() => handleLogin()}
        >
          <Text
            style={[
              styles.loginButtonText,
              { fontSize: isSmallScreen ? 14 : isLargeScreen ? 18 : 16 },
            ]}
          >
            Se connecter
          </Text>
        </TouchableOpacity>
        {/* <View
          style={[
            styles.dividerContainer,
            { marginTop: isSmallScreen ? 20 : 24 },
          ]}
        >
          <View
            style={[
              styles.lineSignup,
              { width: isSmallScreen ? 50 : isLargeScreen ? 80 : 60 },
            ]}
          />
          <Text
            style={[
              styles.textSignUp,
              { fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13 },
            ]}
          >
            Ou inscrivez-vous avec
          </Text>
          <View
            style={[
              styles.lineSignup,
              { width: isSmallScreen ? 50 : isLargeScreen ? 80 : 60 },
            ]}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.loginButtonFacebook,
            {
              height: buttonHeight,
              marginTop: isSmallScreen ? 20 : 24,
              borderRadius: isSmallScreen ? 8 : 10,
            },
          ]}
        >
          <Image
            source={FacebookIconVector}
            style={{
              width: isSmallScreen ? 18 : isLargeScreen ? 26 : 22,
              height: isSmallScreen ? 18 : isLargeScreen ? 26 : 22,
              objectFit: "contain",
            }}
          />
          <Text
            style={[
              styles.loginButtonFacebookText,
              {
                fontSize: isSmallScreen ? 14 : isLargeScreen ? 18 : 16,
                marginLeft: isSmallScreen ? 8 : 12,
              },
            ]}
          >
            Inscrivez-vous avec Facebook
          </Text>
        </TouchableOpacity> */}
        <View
          style={[
            styles.footerContainer,
            { marginTop: isSmallScreen ? 20 : 24 },
          ]}
        >
          <Text
            style={[
              styles.textSousSignIn,
              { fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13 },
            ]}
          >
            Vous n'avez pas de compte ?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp/index")}>
            <Text
              style={[
                styles.textForgotPassword,
                { fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13 },
              ]}
            >
              S'inscrire
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SignInScreen: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: Platform.OS === "android" ? 20 : 0,
  },
  headerContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 16,
  },
  textSignIn: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    marginBottom: 16,
  },
  textSousSignIn: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    color: "#888888",
  },
  textlabel: {
    color: "#888888",
    fontFamily: "Montserrat-Regular",
  },
  passwordContainer: {
    width: "100%",
    backgroundColor: "#F7F7F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 4,
  },
  textInput: {
    width: "100%",
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 15,
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    marginTop: 4,
  },
  textInputPassword: {
    flex: 1,
    fontFamily: "Montserrat-Regular",
  },
  eyeIcon: {
    padding: 8,
  },
  textForgotPassword: {
    color: "#19213D",
    fontFamily: "Montserrat-Regular",
    textDecorationLine: "underline",
    textAlign: "right",
  },
  errorText: {
    color: "red",
    width: "100%",
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#19213D",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontFamily: "Montserrat-Regular",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  lineSignup: {
    height: 0.3,
    backgroundColor: "#000",
  },
  textSignUp: {
    color: "#888888",
    fontFamily: "Montserrat-Regular",
  },
  loginButtonFacebook: {
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#C9E4EE",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonFacebookText: {
    color: "#000",
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  column: {
    flexDirection: "column",
    gap: 4,
  },
});

export default SignInScreen;
