import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
  useWindowDimensions,
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

  // Get screen dimensions
  const { width, height } = useWindowDimensions();

  // Calculate responsive values
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Responsive spacing calculations
  const horizontalPadding = width * 0.05;
  const headerWidth = width * 0.85;
  const inputHeight = isSmallScreen ? 45 : isLargeScreen ? 55 : 50;
  const buttonHeight = isSmallScreen ? 45 : isLargeScreen ? 55 : 50;
  const checkboxSize = isSmallScreen ? 14 : isLargeScreen ? 18 : 16;

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
      throw new Error("Erreur lors de la récupération des données des villes");
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
      setSnackbarMessage("Vous devez accepter les termes et conditions");
      setSnackbarKey((prev) => prev + 1);
      return;
    }

    if (password != confirmPassword) {
      setSnackbarType("error");
      setSnackbarMessage("Les mots de passe ne correspondent pas");
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
        "Une erreur s'est produite lors de la création de votre compte. Veuillez réessayer plus tard."
      );
      setSnackbarKey((prev) => prev + 1);
    } finally {
      setSubmissionLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        extraScrollHeight={50}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.container,
          { paddingHorizontal: horizontalPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.headerContainer, { width: headerWidth }]}>
          <Text
            style={[
              styles.textSignIn,
              {
                fontSize: isSmallScreen ? 26 : isLargeScreen ? 34 : 30,
                marginBottom: isSmallScreen ? 14 : 16,
              },
            ]}
          >
            Créer un compte
          </Text>
          <Text
            style={[
              styles.textSousSignIn,
              { fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13 },
            ]}
          >
            Remplissez vos informations ci-dessous ou inscrivez-vous avec votre
            compte social.
          </Text>
        </View>

        <View style={{ marginTop: isSmallScreen ? 30 : 36 }}>
          <View
            style={[
              styles.inputClass,
              { marginBottom: isSmallScreen ? 14 : 16 },
            ]}
          >
            <Text
              style={[
                styles.textlabel,
                { fontSize: isSmallScreen ? 13 : isLargeScreen ? 16 : 14 },
              ]}
            >
              Prénom
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  height: inputHeight,
                  borderRadius: isSmallScreen ? 8 : 10,
                  fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12,
                },
              ]}
              placeholder="Ex. Amine"
              placeholderTextColor="#888888"
              value={firstName}
              onChangeText={setFirstName}
              returnKeyType="next"
            />
          </View>

          <View
            style={[
              styles.inputClass,
              { marginBottom: isSmallScreen ? 14 : 16 },
            ]}
          >
            <Text
              style={[
                styles.textlabel,
                { fontSize: isSmallScreen ? 13 : isLargeScreen ? 16 : 14 },
              ]}
            >
              Nom de famille
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  height: inputHeight,
                  borderRadius: isSmallScreen ? 8 : 10,
                  fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12,
                },
              ]}
              placeholder="Ex. Faroukhi"
              placeholderTextColor="#888888"
              value={lastName}
              onChangeText={setLastName}
              returnKeyType="next"
            />
          </View>

          <View
            style={[
              styles.inputClass,
              { marginBottom: isSmallScreen ? 14 : 16 },
            ]}
          >
            <Text
              style={[
                styles.textlabel,
                { fontSize: isSmallScreen ? 13 : isLargeScreen ? 16 : 14 },
              ]}
            >
              Numéro de téléphone
            </Text>
            <View
              style={[
                styles.passwordContainer,
                {
                  height: inputHeight,
                  borderRadius: isSmallScreen ? 8 : 10,
                },
              ]}
            >
              <TextInput
                style={[
                  styles.textInputPhone,
                  { fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12 },
                ]}
                placeholder="07XXXXXXXX"
                placeholderTextColor="#888888"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                returnKeyType="next"
              />
            </View>
          </View>

          <View
            style={[
              styles.inputClass,
              { marginBottom: isSmallScreen ? 14 : 16 },
            ]}
          >
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
                {
                  height: inputHeight,
                  borderRadius: isSmallScreen ? 8 : 10,
                },
              ]}
            >
              <TextInput
                style={[
                  styles.textInputPassword,
                  { fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12 },
                ]}
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
                  size={isSmallScreen ? 18 : isLargeScreen ? 22 : 20}
                  color="#888888"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[
              styles.inputClass,
              { marginBottom: isSmallScreen ? 14 : 16 },
            ]}
          >
            <Text
              style={[
                styles.textlabel,
                { fontSize: isSmallScreen ? 13 : isLargeScreen ? 16 : 14 },
              ]}
            >
              Confirmer le mot de passe
            </Text>
            <View
              style={[
                styles.passwordContainer,
                {
                  height: inputHeight,
                  borderRadius: isSmallScreen ? 8 : 10,
                },
              ]}
            >
              <TextInput
                style={[
                  styles.textInputPassword,
                  { fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12 },
                ]}
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
                  size={isSmallScreen ? 18 : isLargeScreen ? 22 : 20}
                  color="#888888"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[
              styles.inputClass,
              { marginBottom: isSmallScreen ? 14 : 16 },
            ]}
          >
            <Text
              style={[
                styles.textlabel,
                { fontSize: isSmallScreen ? 13 : isLargeScreen ? 16 : 14 },
              ]}
            >
              Email
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  height: inputHeight,
                  borderRadius: isSmallScreen ? 8 : 10,
                  fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12,
                },
              ]}
              placeholder="exemple@gmail.com"
              placeholderTextColor="#888888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          <View
            style={[
              styles.inputClass,
              { marginBottom: isSmallScreen ? 14 : 16 },
            ]}
          >
            <Text
              style={[
                styles.textlabel,
                { fontSize: isSmallScreen ? 13 : isLargeScreen ? 16 : 14 },
              ]}
            >
              Numéro d'enregistrement commercial
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  height: inputHeight,
                  borderRadius: isSmallScreen ? 8 : 10,
                  fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12,
                },
              ]}
              placeholder="26052002"
              placeholderTextColor="#888888"
              value={commercialRegister}
              onChangeText={setCommercialRegister}
              returnKeyType="next"
            />
          </View>

          <View style={[styles.row, { gap: isSmallScreen ? 8 : 12 }]}>
            <View style={[styles.inputClass, { flex: 1 }]}>
              <Text
                style={[
                  styles.textlabel,
                  { fontSize: isSmallScreen ? 13 : isLargeScreen ? 16 : 14 },
                ]}
              >
                Wilaya
              </Text>
              <WilayaDropdown
                data={wilayas}
                dropDownTitle="Sélectionner la Wilaya"
                onSelect={(value) => setSelectedWilaya(value)}
              />
            </View>
            <View style={[styles.inputClass, { flex: 1 }]}>
              <Text
                style={[
                  styles.textlabel,
                  { fontSize: isSmallScreen ? 13 : isLargeScreen ? 16 : 14 },
                ]}
              >
                Commune
              </Text>
              <WilayaDropdown
                data={communes}
                dropDownTitle="Sélectionner la Commune"
                onSelect={(value) => setSelectedCommune(value)}
              />
            </View>
          </View>

          <View
            style={[
              styles.checkboxContainer,
              { marginTop: isSmallScreen ? 14 : 16 },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.checkbox,
                isChecked && styles.checked,
                {
                  width: checkboxSize,
                  height: checkboxSize,
                  borderRadius: isSmallScreen ? 2 : 3,
                },
              ]}
              onPress={() => setIsChecked(!isChecked)}
            >
              {isChecked && (
                <CheckIcon
                  name="check"
                  size={checkboxSize * 0.7}
                  color="white"
                />
              )}
            </TouchableOpacity>
            <View style={styles.termsContainer}>
              <Text
                style={[
                  styles.text,
                  { fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13 },
                ]}
              >
                Accepter les{" "}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("SignIn/index")}
              >
                <Text
                  style={[
                    styles.textForgotPassword,
                    { fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13 },
                  ]}
                >
                  Termes et conditions
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              {
                height: buttonHeight,
                borderRadius: isSmallScreen ? 8 : 10,
                marginTop: isSmallScreen ? 20 : 24,
              },
            ]}
            onPress={handleSignUp}
            disabled={submissionLoading}
          >
            <Text
              style={[
                styles.loginButtonText,
                { fontSize: isSmallScreen ? 14 : isLargeScreen ? 18 : 16 },
              ]}
            >
              {submissionLoading ? "Traitement..." : "S'inscrire"}
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.footerContainer,
              { marginTop: isSmallScreen ? 24 : 28 },
            ]}
          >
            <Text
              style={[
                styles.text,
                { fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13 },
              ]}
            >
              Vous avez déjà un compte ?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignIn/index")}
            >
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
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: Platform.OS === "android" ? 20 : 24,
    flexDirection: "column",
    width: "100%",
  },
  headerContainer: {
    alignItems: "center",
  },
  textSignIn: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  textSousSignIn: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    color: "#888888",
  },
  text: {
    fontFamily: "Montserrat-Regular",
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
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 4,
  },
  textInput: {
    width: "100%",
    backgroundColor: "#F7F7F7",
    paddingLeft: 15,
    paddingRight: 15,
    fontFamily: "Montserrat-Regular",
    marginTop: 4,
  },
  textInputPassword: {
    fontFamily: "Montserrat-Regular",
    flex: 1,
  },
  textInputPhone: {
    fontFamily: "Montserrat-Regular",
    width: "100%",
    height: "100%",
  },
  eyeIcon: {
    padding: 8,
  },
  textForgotPassword: {
    color: "#63BBF5",
    fontFamily: "Montserrat-Regular",
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "#63BBF5",
    justifyContent: "center",
    alignItems: "center",
    // width: "100%",
  },
  loginButtonText: {
    color: "#fff",
    fontFamily: "Montserrat-Regular",
  },
  checkbox: {
    borderWidth: 0.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#888888",
  },
  checked: {
    backgroundColor: "#63BBF5",
    borderColor: "#63BBF5",
  },
  inputClass: {
    flexDirection: "column",
    gap: 4,
  },
  row: {
    flexDirection: "row",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
});

export default SignUpScreen;
