import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "expo-router";
import WilayaDropdown from "../../components/DropDown";

const SignUpScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  const [expaneded, setExpaneded] = useState(false);
  const toggleExpanded = useCallback(() => setExpaneded(!expaneded), []);

  const toggleCheckbox = () => {
    setIsChecked((previousState) => !previousState);
  };

  const [selectedOption, setSelectedOption] = useState(null);
  const [showSelectOption, setShowSelectOption] = useState(false);

  const data = [
    { label: "Item 1", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
    { label: "Item 4", value: "4" },
    { label: "Item 5", value: "5" },
    { label: "Item 6", value: "6" },
    { label: "Item 7", value: "7" },
    { label: "Item 8", value: "8" },
  ];

  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.SignInScreen} className="bg-white h-full">
      <ScrollView
        className="mx-5"
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-col w-[70%] items-center">
          <Text className="mb-[16]" style={styles.textSignIn}>
            Create Account
          </Text>
          <Text style={styles.textSousSignIn}>
            Fill your information below or register with your social account.
          </Text>
        </View>
        <View className="mt-[36]">
          <View style={styles.inputClass}>
            <Text style={styles.textlabel}>Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex. Amine Faroukhi"
              placeholderTextColor="#888888"
            />
          </View>
          <View style={styles.inputClass}>
            <Text style={styles.textlabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="example@gmail.com"
              placeholderTextColor="#888888"
            />
          </View>
          <View style={styles.inputClass}>
            <Text style={styles.textlabel}>Password</Text>
            <View
              className="flex-row items-center justify-between"
              style={styles.passwordContainer}
            >
              <TextInput
                style={styles.textInputPassword}
                placeholder="********"
                secureTextEntry={!passwordVisible}
                placeholderTextColor="#888888"

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

          <View style={styles.inputClass}>
            <Text style={styles.textlabel}>Phone Number</Text>
            <View
              className="flex-row items-center"
              style={styles.passwordContainer}
            >
              <Text style={styles.textInputPassword}>+213</Text>
              <TextInput style={styles.textInputPhone} />
            </View>
          </View>
          <View style={styles.inputClass}>
            <Text style={styles.textlabel}>Commercial register number</Text>
            <TextInput
              style={styles.textInput}
              placeholder="26052002"
              placeholderTextColor="#888888"
            />
          </View>
          <View style={styles.row}>
            <View style={styles.inputClass}>
              <Text style={styles.textlabel}>Wilaya</Text>
              <WilayaDropdown data={data} dropDownTitle="Select Wilaya" />
            </View>
            <View style={styles.inputClass}>
              <Text style={styles.textlabel}>Commune</Text>
              <WilayaDropdown data={data} dropDownTitle="Select Commune" />
            </View>
          </View>
          <View className="flex-row ml-1 items-center">
            <TouchableOpacity
              style={[styles.checkbox, isChecked && styles.checked]}
              onPress={toggleCheckbox}
              className="mr-1"
            >
              {isChecked && <CheckIcon name="check" size={14} color="white" />}
            </TouchableOpacity>
            <View className="flex-row space-x-1">
              <Text style={styles.text} className="mr-1">
                Agree with
              </Text>
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
            onPress={() => navigation.navigate("VerifyCode/index")}
          >
            <Text style={styles.loginButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center space-x-1 mt-[28]">
            <Text style={styles.text} className="mr-1">
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignIn/index")}
            >
              <Text style={styles.textForgotPassword}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: 8,
    alignItems: "center",
    paddingVertical: 24,
    flexDirection: "column",
  },
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
    marginTop: 4,
    alignSelf: "center",
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
    marginTop: 4,
    alignSelf: "center",
  },
  textInputPassword: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  textInputPhone: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    width: "100%",
    height: "100%",
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
    // borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    backgroundColor: "#fff",
  },
  checked: {
    backgroundColor: "#26667E",
    borderColor: "#26667E",
  },
  inputClass: {
    flexDirection: "column",
    gap: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default SignUpScreen;
