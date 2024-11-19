import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import {
  CheckIcon,
  ChevronDownIcon,
  EyeIcon,
} from "react-native-heroicons/outline";
import SelectOption from "../../components/SelectOption";
import { useNavigation } from "expo-router";

const SignUpScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  const toggleCheckbox = () => {
    setIsChecked((previousState) => !previousState);
  };

  const [selectedOption, setSelectedOption] = useState(null);
  const [showSelectOption, setShowSelectOption] = useState(false);

  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.SignInScreen} className="bg-white h-full">
      <View className="flex-col w-[70%] items-center">
        <Text className="mb-[16]" style={styles.textSignIn}>
          Create Account
        </Text>
        <Text style={styles.textSousSignIn}>
          Fill your information below or register with your social account.
        </Text>
      </View>
      <View className="mt-[36]">
        <View className="flex-col space-y-[6] mb-[16]">
          <Text style={styles.textlabel}>Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ex. Amine Faroukhi"
          />
        </View>
        <View className="flex-col space-y-[6] mb-[16]">
          <Text style={styles.textlabel}>Email</Text>
          <TextInput style={styles.textInput} placeholder="example@gmail.com" />
        </View>
        <View className="flex-col space-y-[6] mb-[16]">
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
        <View className="flex-col space-y-[6] mb-[16]">
          <Text style={styles.textlabel}>Phone Number</Text>
          <View
            className="flex-row items-center"
            style={styles.passwordContainer}
          >
            <Text style={styles.textInputPassword}>+213</Text>
            <TextInput style={styles.textInputPassword} />
          </View>
        </View>
        <TouchableOpacity
          style={styles.selectOption}
          onPress={() => setShowSelectOption(true)}
          className="flex-row mb-[16]"
        >
          <Text style={styles.textlabel}>Wilaya</Text>
          <ChevronDownIcon size={15} color="#26667E" />
        </TouchableOpacity>
        <SelectOption
          options={["Option 1", "Option 2", "Option 3"]}
          visible={showSelectOption}
          onSelect={(option) => {
            setSelectedOption(option);
            setShowSelectOption(false);
          }}
        />
        <View className="flex-row ml-1 items-center">
          <TouchableOpacity
            style={[styles.checkbox, isChecked && styles.checked]}
            onPress={toggleCheckbox}
            className="mr-1"
          >
            {isChecked && <CheckIcon name="check" size={15} color="white" />}
          </TouchableOpacity>
          <View className="flex-row space-x-1">
            <Text style={styles.text} className='mr-1'>Agree with</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignIn/index")}
            >
              <Text style={styles.textForgotPassword}>Terms & Condition</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className="mt-[24]"
          style={styles.loginButton}
          onPress={() => navigation.navigate("VerifyCodeScreen")}
        >
          <Text style={styles.loginButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center space-x-1 mt-[28]">
          <Text style={styles.text} className="mr-1">Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn/index")}>
            <Text style={styles.textForgotPassword}>Sign In</Text>
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
  text: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
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
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 0.5,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    backgroundColor: "#fff",
  },
  checked: {
    backgroundColor: "#26667E",
  },
  selectOption: {
    width: 110,
    height: 30,
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: "#3E9CB9",
    borderWidth: 0.5,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default SignUpScreen;
