import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";

const VerifyCodeScreen = () => {
  return (
    <SafeAreaView className="bg-white pt-5 pb-1 h-full">
      <View className="mx-5">
        <BackButton />
      </View>
      <View style={styles.verifyContainer} className="mx-5 mt-[40]">
        <View style={styles.verifyContainer}>
          <Text style={styles.titleCategory}>Verify Code</Text>
          <View className="flex-col items-center">
            <Text style={styles.sousTitle}>
              Please enter the code we just sent to email
            </Text>
            <Text className="text-[#62B5CE]" style={styles.sousTitle}>
              example@gmail.com
            </Text>
          </View>
        </View>
        <View style={styles.codeInputs}>
          <TextInput
            style={styles.codeInput}
            placeholder="-"
            placeholderTextColor="#888888"
          />
          <TextInput
            style={styles.codeInput}
            placeholder="-"
            placeholderTextColor="#888888"
          />
          <TextInput
            style={styles.codeInput}
            placeholder="-"
            placeholderTextColor="#888888"
          />
          <TextInput
            style={styles.codeInput}
            placeholder="-"
            placeholderTextColor="#888888"
          />
        </View>
        <View className="flex-col justify-center items-center">
          <Text style={styles.textSousSignIn}>Didn't receive OTP?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
            <Text style={styles.textForgotPassword}>Resend code</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="mt-[24]"
          style={styles.loginButton}
          onPress={() => navigation.navigate("SignInScreen")}
        >
          <Text style={styles.loginButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  loginButton: {
    backgroundColor: "#26667E",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 340,
  },
  textSousSignIn: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    color: "#888888",
  },
  textForgotPassword: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    textDecorationLine: "underline",
  },
  titleCategory: {
    fontSize: 30,
    fontFamily: "Montserrat-Regular",
  },
  sousTitle: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
  },
  codeInput: {
    width: 60,
    height: 45,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    backgroundColor: "#F7F7F7",
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
});

export default VerifyCodeScreen;
