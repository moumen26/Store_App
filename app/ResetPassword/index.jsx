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

const ResetPassword = () => {
  return (
    <SafeAreaView className="bg-white pt-3 h-full">
      <View className="mx-5">
        <BackButton />
      </View>
      <View style={styles.verifyContainer} className="mx-5 mt-[40]">
        <Text style={styles.titleCategory}>Reset Password</Text>
        <Text style={styles.sousTitle}>
          Enter your phone number to receive a code
        </Text>

        <View styles={styles.column} className="mt-[26] w-full">
          <Text style={styles.textlabel}>Phone Number</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Phone number"
            placeholderTextColor="#888888"
            // value={}
            // onChangeText={}
          />
        </View>

        <TouchableOpacity
          className="mt-[24]"
          style={styles.loginButton}
          onPress={() => navigation.navigate("SignInScreen")}
        >
          <Text style={styles.loginButtonText}>Send Rest Password</Text>
        </TouchableOpacity>
        <View className="flex-row justify-center items-center space-x-1 mt-[12]">
          <Text style={styles.textSousSignIn} className="mr-1">
            You remember your password ?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp/index")}>
            <Text style={styles.textForgotPassword}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  resetPassword: {
    width: "100%",
    flexDirection: "column",
    gap: 10,
  },
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
    width: "100%",
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
    textAlign: "left",
    fontSize: 30,
    fontFamily: "Montserrat-Regular",
  },
  sousTitle: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
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
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  textInput: {
    width: "100%",
    height: 50,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    marginTop: 4,
  },
  column: {
    flexDirection: "column",
    gap: 20,
  },
  textForgotPassword: {
    fontSize: 13,
    color: "#26667E",
    fontFamily: "Montserrat-Regular",
    textDecorationLine: "underline",
  },
});

export default ResetPassword;
