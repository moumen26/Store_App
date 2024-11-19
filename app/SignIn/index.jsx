import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { EyeIcon } from "react-native-heroicons/outline";

const FacebookIconVector = require("../../assets/icons/Facebook.png");

const SignInScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.SignInScreen} className="bg-white h-full">
      <View className="flex-col items-center">
        <Text className="mb-[16]" style={styles.textSignIn}>
          Sign in
        </Text>
        <Text style={styles.textSousSignIn}>
          Hi Welcome back, you've been missed
        </Text>
      </View>
      <View className="mt-[36]">
        <View className="flex-col space-y-[6] mb-[16]">
          <Text style={styles.textlabel}>Email</Text>
          <TextInput style={styles.textInput} placeholder="example@gmail.com" />
        </View>
        <View className="flex-col space-y-[6]">
          <Text style={styles.textlabel}>Password</Text>
          <View
            className="flex-row items-center justify-between"
            style={styles.passwordContainer}
          >
            <TextInput
              style={styles.textInputPassword}
              placeholder="********"
              secureTextEntry={!passwordVisible}
              //   value={password}
              //   onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeIcon}
            >
              <EyeIcon
                name={passwordVisible ? "visibility" : "visibility-off"}
                size={20}
                color="#888888"
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity className="mt-[26]">
          <Text style={styles.textForgotPassword} className="text-right">
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="mt-[24]" style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>
        <View className="flex-row items-center justify-center space-x-4 mt-[24]">
          <View style={styles.lineSignup} className="mr-1"></View>
          <Text style={styles.textSignUp}>Or Sign up with</Text>
          <View style={styles.lineSignup} className="ml-1"></View>
        </View>
        <TouchableOpacity
          className="mt-[24] flex-row items-center space-x-4"
          style={styles.loginButtonFacebook}
        >
          <Image source={FacebookIconVector} className="mr-3"/>
          <Text style={styles.loginButtonFacebookText} className="ml-1">
            Sign Up with Facebook
          </Text>
        </TouchableOpacity>
        <View className="flex-row justify-center items-center space-x-1 mt-[24]">
          <Text style={styles.textSousSignIn} className="mr-1">Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp/index")}>
            <Text style={styles.textForgotPassword}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SignInScreen: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  textSignIn: {
    fontSize: 30,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  textSousSignIn: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    color: "#888888",
  },
  textlabel: {
    color: "#888888",
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  passwordContainer: {
    width: 340,
    height: 50,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  textInput: {
    width: 340,
    height: 50,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  textInputPassword: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  textForgotPassword: {
    fontSize: 13,
    color: "#26667E",
    fontFamily: "Montserrat-Regular",
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "#26667E",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  lineSignup: {
    width: 60,
    height: 0.3,
    backgroundColor: "#000",
  },
  textSignUp: {
    fontSize: 13,
    color: "#888888",
    fontFamily: "Montserrat-Regular",
  },
  loginButtonFacebook: {
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 50,
    borderWidth: 0.5,
    borderColor: "#C9E4EE",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonFacebookText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
});

export default SignInScreen;
