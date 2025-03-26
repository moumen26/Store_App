import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { CheckIcon, EyeIcon } from "react-native-heroicons/outline";
import { useNavigation } from "expo-router";
import WilayaDropdown from "../../components/DropDown";
import useAuthContext from "../hooks/useAuthContext";
import { useQuery } from "@tanstack/react-query";
import Config from "../config";
import Snackbar from "../../components/Snackbar.jsx";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthContext();

  // State for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [commercialRegister, setCommercialRegister] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");

  // State for UI
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [snackbarKey, setSnackbarKey] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [submissionLoading, setSubmissionLoading] = useState(false);

  // Fetch cities data
  const fetchCitiesData = async () => {
    const response = await fetch(`${Config.API_URL}/Cities/fr`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode === 404) return [];
      throw new Error("Error fetching cities data");
    }
    return response.json();
  };

  const {
    data: citiesData,
    isLoading: citiesLoading,
    error: citiesError,
  } = useQuery({
    queryKey: ["citiesData"],
    queryFn: fetchCitiesData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  // Filter wilayas and communes
  const wilayas =
    citiesData
      ?.filter((city) => city.codeC == `${city.codeW}001`)
      .map((city) => ({ value: city.codeW, label: city.wilaya })) || [];

  const communes = selectedWilaya
    ? citiesData
        ?.filter(
          (city) =>
            city.codeW == selectedWilaya && city.codeC != `${city.codeW}001`
        )
        .map((city) => ({ value: city.codeC, label: city.baladiya })) || []
    : [];

  // Handle form submission
  const handleSignUp = async () => {
    if (!isChecked) {
      setSnackbarType("error");
      setSnackbarMessage("You must agree to the terms and conditions");
      setSnackbarKey((prev) => prev + 1);
      return;
    }

    if (password != confirmPassword) {
      setSnackbarType("error");
      setSnackbarMessage("Passwords do not match");
      setSnackbarKey((prev) => prev + 1);
      return;
    }
    setSubmissionLoading(true);

    try {
      const response = await fetch(`${Config.API_URL}/Auth/signup/client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Email: email,
          Password: password,
          FirstName: firstName,
          LastName: lastName,
          PhoneNumber: phone,
          Wilaya: selectedWilaya,
          Commune: selectedCommune,
          R_Commerce: commercialRegister,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setSnackbarType("error");
        setSnackbarMessage(json.message);
        setSnackbarKey((prev) => prev + 1);
        return;
      }

      setSnackbarType("success");
      setSnackbarMessage(json.message);
      setSnackbarKey((prev) => prev + 1);
      navigation.navigate("SignIn/index");
    } catch (err) {
      console.error(err);
      setSnackbarType("error");
      setSnackbarMessage(
        "An error occurred while creating your account. Please try again later."
      );
      setSnackbarKey((prev) => prev + 1);
    } finally {
      setSubmissionLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <KeyboardAwareScrollView
        extraScrollHeight={50}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
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

        <View className="mt-[36] mx-5">
          <View style={styles.inputClass}>
            <Text style={styles.textlabel}>First name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex. Amine"
              placeholderTextColor="#888888"
              value={firstName}
              onChangeText={setFirstName}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputClass}>
            <Text style={styles.textlabel}>Last name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex. Faroukhi"
              placeholderTextColor="#888888"
              value={lastName}
              onChangeText={setLastName}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputClass}>
            <Text style={styles.textlabel}>Phone Number</Text>
            <View
              className="flex-row items-center"
              style={styles.passwordContainer}
            >
              <TextInput
                style={styles.textInputPhone}
                placeholder="07XXXXXXXX"
                placeholderTextColor="#888888"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                returnKeyType="next"
              />
            </View>
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
                value={password}
                onChangeText={setPassword}
                returnKeyType="next"
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
            <Text style={styles.textlabel}>Confirm password</Text>
            <View
              className="flex-row items-center justify-between"
              style={styles.passwordContainer}
            >
              <TextInput
                style={styles.textInputPassword}
                placeholder="********"
                secureTextEntry={!confirmPasswordVisible}
                placeholderTextColor="#888888"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                returnKeyType="next"
              />
              <TouchableOpacity
                onPress={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
                style={styles.eyeIcon}
              >
                <EyeIcon
                  name={
                    confirmPasswordVisible ? "visibility" : "visibility-off"
                  }
                  size={20}
                  color="#888888"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputClass}>
            <Text style={styles.textlabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="example@gmail.com"
              placeholderTextColor="#888888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputClass}>
            <Text style={styles.textlabel}>Commercial register number</Text>
            <TextInput
              style={styles.textInput}
              placeholder="26052002"
              placeholderTextColor="#888888"
              value={commercialRegister}
              onChangeText={setCommercialRegister}
              returnKeyType="next"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.inputClass}>
              <Text style={styles.textlabel}>Wilaya</Text>
              <WilayaDropdown
                data={wilayas}
                dropDownTitle="Select Wilaya"
                onSelect={(value) => setSelectedWilaya(value)}
              />
            </View>
            <View style={styles.inputClass}>
              <Text style={styles.textlabel}>Commune</Text>
              <WilayaDropdown
                data={communes}
                dropDownTitle="Select Commune"
                onSelect={(value) => setSelectedCommune(value)}
              />
            </View>
          </View>

          <View className="flex-row ml-1 items-center">
            <TouchableOpacity
              style={[styles.checkbox, isChecked && styles.checked]}
              onPress={() => setIsChecked(!isChecked)}
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
            onPress={handleSignUp}
            disabled={submissionLoading}
          >
            <Text style={styles.loginButtonText}>
              {submissionLoading ? "Processing..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center space-x-1 mt-[28] pb-4">
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
      </KeyboardAwareScrollView>

      {snackbarKey !== 0 && (
        <Snackbar
          key={snackbarKey}
          message={snackbarMessage}
          duration={6000}
          snackbarType={snackbarType}
        />
      )}
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
    width: "100%",
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
    width: "100%",
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
    width: "100%",
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
    gap: 12,
  },
});
export default SignUpScreen;
