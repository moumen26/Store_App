import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  useWindowDimensions,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  ArrowRightIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  TrashIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "expo-router";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import ConfirmationModal from "../../components/ConfirmationModal";
import Snackbar from "../../components/Snackbar";
import Config from "../config";

const Settings = () => {
  const navigation = useNavigation();
  const { logout } = useLogout();
  const { user, dispatch } = useAuthContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSetting, setCurrentSetting] = useState({});

  // Get screen dimensions
  const { width, height } = useWindowDimensions();

  // Calculate responsive values
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Responsive spacing calculations
  const horizontalPadding = width * 0.05;
  const verticalSpacing = height * 0.025;
  const smallSpacing = height * 0.01;
  const modalWidth = isSmallScreen
    ? width * 0.85
    : isLargeScreen
    ? width * 0.5
    : width * 0.8;

  // For regular fields
  const [inputValues, setInputValues] = useState({
    firstName: user.info.firstName,
    lastName: user.info.lastName,
    email: user.info.email,
    phoneNumber: user.info.phoneNumber,
  });

  // For password change
  const [passwordValues, setPasswordValues] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);

  const [settings, setSettings] = useState(() => [
    {
      id: "name",
      icon: <UserIcon color="#63BBF5" size={isSmallScreen ? 16 : 18} />,
      label: "Nom",
      value: `${user.info.firstName} ${user.info.lastName}`,
      type: "fullname",
    },
    {
      id: "email",
      icon: <EnvelopeIcon color="#63BBF5" size={isSmallScreen ? 16 : 18} />,
      label: "Email",
      value: user.info.email,
      type: "email",
    },
    {
      id: "password",
      icon: <LockClosedIcon color="#63BBF5" size={isSmallScreen ? 16 : 18} />,
      label: "Mot de passe",
      value: "••••••••",
      type: "password",
    },
    {
      id: "phone",
      icon: <PhoneIcon color="#63BBF5" size={isSmallScreen ? 16 : 18} />,
      label: "Numero de téléphone",
      value: user.info.phoneNumber,
      type: "phone",
    },
    {
      id: "delete",
      icon: <TrashIcon color="#63BBF5" size={isSmallScreen ? 16 : 18} />,
      label: "Supprimer le compte",
      value: "Continuer",
      type: "delete",
    },
  ]);

  // Update icons size when screen dimensions change
  useFocusEffect(
    useCallback(() => {
      setSettings((prevSettings) =>
        prevSettings.map((setting) => ({
          ...setting,
          icon: React.cloneElement(setting.icon, {
            size: isSmallScreen ? 16 : 18,
          }),
        }))
      );
    }, [isSmallScreen])
  );

  const handleLogOut = () => {
    logout();
  };

  const openModal = (setting) => {
    setCurrentSetting(setting);

    // Reset password fields when opening password modal
    if (setting.type === "password") {
      setPasswordValues({
        oldPassword: "",
        newPassword: "",
      });
    }

    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setDeleteConfirmationVisible(false);
  };

  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);

  const openConfirmationLogOutModal = () => {
    setConfirmationModalVisible(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalVisible(false);
  };

  const [snackbarKey, setSnackbarKey] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (submitting) return;

    setSubmitting(true);
    let updateData = {};

    try {
      // Prepare data based on current setting type
      switch (currentSetting.type) {
        case "fullname":
          updateData = {
            firstName: inputValues.firstName,
            lastName: inputValues.lastName,
          };
          break;
        case "email":
          updateData = { email: inputValues.email };
          break;
        case "phone":
          updateData = { phoneNumber: inputValues.phoneNumber };
          break;
        case "password":
          updateData = {
            password: passwordValues.newPassword,
            oldPassword: passwordValues.oldPassword,
          };
          break;
        default:
          throw new Error("Invalid setting type");
      }

      const response = await fetch(
        `${Config.API_URL}/Client/update/profile/${user?.info?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setSnackbarType("error");
        setSnackbarMessage(json.message || "Une erreur s'est produite");
        setSnackbarKey((prevKey) => prevKey + 1);
        return;
      }

      // Update local state with new values
      if (currentSetting.type === "fullname") {
        const newFullName = `${inputValues.firstName} ${inputValues.lastName}`;
        setSettings((prevSettings) =>
          prevSettings.map((setting) =>
            setting.id === "name" ? { ...setting, value: newFullName } : setting
          )
        );

        // Update auth context
        dispatch({
          type: "UPDATE_USER",
          payload: {
            ...user,
            info: {
              ...user.info,
              firstName: inputValues.firstName,
              lastName: inputValues.lastName,
            },
          },
        });
      } else if (currentSetting.type === "email") {
        setSettings((prevSettings) =>
          prevSettings.map((setting) =>
            setting.id === "email"
              ? { ...setting, value: inputValues.email }
              : setting
          )
        );

        // Update auth context
        dispatch({
          type: "UPDATE_USER",
          payload: {
            ...user,
            info: {
              ...user.info,
              email: inputValues.email,
            },
          },
        });
      } else if (currentSetting.type === "phone") {
        setSettings((prevSettings) =>
          prevSettings.map((setting) =>
            setting.id === "phone"
              ? { ...setting, value: inputValues.phoneNumber }
              : setting
          )
        );

        // Update auth context
        dispatch({
          type: "UPDATE_USER",
          payload: {
            ...user,
            info: {
              ...user.info,
              phoneNumber: inputValues.phoneNumber,
            },
          },
        });
      }

      setSnackbarType("success");
      setSnackbarMessage(json.message || "Profil mis à jour avec succès");
      setSnackbarKey((prevKey) => prevKey + 1);
      closeModal();
    } catch (err) {
      console.error("Update error:", err);
      setSnackbarType("error");
      setSnackbarMessage(
        "Une erreur s'est produite lors de la mise à jour du profil"
      );
      setSnackbarKey((prevKey) => prevKey + 1);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteAccount = () => {
    // // Implement logic to delete account here
    // setDeleteConfirmationVisible(false);
    // // For now, just show a success message
    // setSnackbarType("success");
    // setSnackbarMessage("Fonctionnalité à implémenter: Suppression de compte");
    // setSnackbarKey((prevKey) => prevKey + 1);
  };

  // Render the appropriate modal content based on setting type
  const renderModalContent = () => {
    const iconSize = isSmallScreen ? 18 : 20;

    switch (currentSetting.type) {
      case "fullname":
        return (
          <>
            <Text style={styles.modalLabel}>Prénom</Text>
            <View style={styles.inputChange}>
              <UserIcon size={iconSize} color="#888888" />
              <TextInput
                style={styles.modalInput}
                value={inputValues.firstName}
                onChangeText={(text) =>
                  setInputValues((prev) => ({ ...prev, firstName: text }))
                }
                placeholder="Prénom"
              />
            </View>

            <Text style={styles.modalLabel}>Nom</Text>
            <View style={styles.inputChange}>
              <UserIcon size={iconSize} color="#888888" />
              <TextInput
                style={styles.modalInput}
                value={inputValues.lastName}
                onChangeText={(text) =>
                  setInputValues((prev) => ({ ...prev, lastName: text }))
                }
                placeholder="Nom"
              />
            </View>
          </>
        );

      case "email":
        return (
          <>
            <Text style={styles.modalLabel}>Email</Text>
            <View style={styles.inputChange}>
              <EnvelopeIcon size={iconSize} color="#888888" />
              <TextInput
                style={styles.modalInput}
                value={inputValues.email}
                onChangeText={(text) =>
                  setInputValues((prev) => ({ ...prev, email: text }))
                }
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </>
        );

      case "phone":
        return (
          <>
            <Text style={styles.modalLabel}>Numéro de téléphone</Text>
            <View style={styles.inputChange}>
              <PhoneIcon size={iconSize} color="#888888" />
              <TextInput
                style={styles.modalInput}
                value={inputValues.phoneNumber}
                onChangeText={(text) =>
                  setInputValues((prev) => ({ ...prev, phoneNumber: text }))
                }
                placeholder="Numéro de téléphone"
                keyboardType="phone-pad"
              />
            </View>
          </>
        );

      case "password":
        return (
          <>
            <Text style={styles.modalLabel}>Ancien mot de passe</Text>
            <View style={styles.inputChange}>
              <LockClosedIcon size={iconSize} color="#888888" />
              <TextInput
                style={styles.passwordInput}
                value={passwordValues.oldPassword}
                onChangeText={(text) =>
                  setPasswordValues((prev) => ({ ...prev, oldPassword: text }))
                }
                placeholder="Ancien mot de passe"
                secureTextEntry={!showOldPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowOldPassword(!showOldPassword)}
                style={styles.eyeIcon}
              >
                {showOldPassword ? (
                  <EyeSlashIcon size={iconSize} color="#888888" />
                ) : (
                  <EyeIcon size={iconSize} color="#888888" />
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Nouveau mot de passe</Text>
            <View style={styles.inputChange}>
              <LockClosedIcon size={iconSize} color="#888888" />
              <TextInput
                style={styles.passwordInput}
                value={passwordValues.newPassword}
                onChangeText={(text) =>
                  setPasswordValues((prev) => ({ ...prev, newPassword: text }))
                }
                placeholder="Nouveau mot de passe"
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeIcon}
              >
                {showNewPassword ? (
                  <EyeSlashIcon size={iconSize} color="#888888" />
                ) : (
                  <EyeIcon size={iconSize} color="#888888" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.passwordHelp}>
              Le mot de passe doit contenir au moins 8 caractères, une
              majuscule, une minuscule, un chiffre et un caractère spécial.
            </Text>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, position: "relative" }}>
      {/* Snackbar rendering directly with higher z-index */}
      {snackbarKey !== 0 && (
        <View style={[styles.snackbarWrapper, { bottom: height * 0.1 }]}>
          <Snackbar
            key={snackbarKey}
            message={snackbarMessage}
            duration={3000}
            snackbarType={snackbarType}
            position="bottom"
          />
        </View>
      )}

      <SafeAreaView style={styles.container}>
        <Text
          style={[
            styles.titleScreen,
            {
              fontSize: isSmallScreen ? 18 : isLargeScreen ? 24 : 20,
              marginBottom: verticalSpacing * 0.5,
            },
          ]}
        >
          Paramètres
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? 120 : 100,
          }}
        >
          <View
            style={[
              styles.mainContent,
              { marginHorizontal: horizontalPadding },
            ]}
          >
            <Text
              style={[
                styles.text,
                { fontSize: isSmallScreen ? 14 : isLargeScreen ? 18 : 16 },
              ]}
            >
              Compte
            </Text>

            <View
              style={[
                styles.settingsItems,
                { marginTop: verticalSpacing * 0.5 },
              ]}
            >
              {settings.map((setting, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.settingItem,
                    {
                      height: isSmallScreen ? 40 : isLargeScreen ? 55 : 45,
                      borderBottomWidth: 0.5,
                    },
                  ]}
                  onPress={() => {
                    if (setting.id === "delete") {
                      setDeleteConfirmationVisible(true);
                    } else {
                      openModal(setting);
                    }
                  }}
                >
                  <View
                    style={[
                      styles.settingsIconTitle,
                      { gap: isSmallScreen ? 2 : 4 },
                    ]}
                  >
                    {setting.icon}
                    <Text
                      style={[
                        styles.textItemRegular,
                        {
                          fontSize: isSmallScreen
                            ? 12
                            : isLargeScreen
                            ? 15
                            : 13,
                        },
                      ]}
                    >
                      {setting.label}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.settingsIconTitle,
                      { gap: isSmallScreen ? 2 : 4 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.textItemMedium,
                        {
                          fontSize: isSmallScreen
                            ? 11
                            : isLargeScreen
                            ? 14
                            : 12,
                        },
                      ]}
                    >
                      {setting.value}
                    </Text>
                    <ArrowRightIcon
                      color="#63BBF5"
                      size={isSmallScreen ? 16 : 18}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View
            style={[
              styles.buttonVersion,
              {
                marginTop: verticalSpacing * 8,
                marginHorizontal: horizontalPadding,
                marginBottom: verticalSpacing,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.logoutButton,
                { height: isSmallScreen ? 45 : isLargeScreen ? 60 : 50 },
              ]}
              onPress={openConfirmationLogOutModal}
            >
              <Text
                style={[
                  styles.textItemRegular,
                  { fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13 },
                ]}
              >
                Se Déconnecter
              </Text>
            </TouchableOpacity>

            <View style={[styles.versionContainer, { gap: smallSpacing / 2 }]}>
              <Text
                style={[
                  styles.textVersion,
                  { fontSize: isSmallScreen ? 12 : isLargeScreen ? 14 : 13 },
                ]}
              >
                Version de l'application 0.0.1
              </Text>
              <Text
                style={[
                  styles.textItemRegular,
                  { fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13 },
                ]}
              >
                Tous droits réservés
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Profile Update Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              {
                width: modalWidth,
                padding: isSmallScreen ? 15 : 20,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                {
                  fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18,
                  marginBottom: verticalSpacing / 2,
                },
              ]}
            >
              Modifier {currentSetting?.label}
            </Text>

            <View
              style={[
                styles.modalContentContainer,
                { padding: isSmallScreen ? 10 : 15 },
              ]}
            >
              {renderModalContent()}
            </View>

            <View style={[styles.modalButtons, { marginTop: verticalSpacing }]}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    padding: isSmallScreen ? 10 : 12,
                    width: isSmallScreen ? modalWidth * 0.38 : modalWidth * 0.4,
                  },
                ]}
                onPress={closeModal}
                disabled={submitting}
              >
                <Text
                  style={[
                    styles.buttonTextCancel,
                    { fontSize: isSmallScreen ? 13 : 14 },
                  ]}
                >
                  Annuler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  submitting && styles.disabledButton,
                  {
                    padding: isSmallScreen ? 10 : 12,
                    width: isSmallScreen ? modalWidth * 0.38 : modalWidth * 0.4,
                  },
                ]}
                onPress={handleUpdateProfile}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text
                    style={[
                      styles.buttonText,
                      { fontSize: isSmallScreen ? 13 : 14 },
                    ]}
                  >
                    Sauvegarder
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        visible={deleteConfirmationVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              {
                width: modalWidth,
                padding: isSmallScreen ? 15 : 20,
              },
            ]}
          >
            <Text
              style={[
                styles.deleteModalText,
                {
                  fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18,
                  marginBottom: verticalSpacing / 2,
                },
              ]}
            >
              Êtes-vous sûr de vouloir supprimer votre compte ?
            </Text>
            <Text
              style={[
                styles.deleteModalSubtext,
                {
                  fontSize: isSmallScreen ? 13 : 14,
                  marginBottom: verticalSpacing,
                },
              ]}
            >
              Cette action est irréversible et toutes vos données seront
              perdues.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    padding: isSmallScreen ? 10 : 12,
                    width: isSmallScreen ? modalWidth * 0.38 : modalWidth * 0.4,
                  },
                ]}
                onPress={() => setDeleteConfirmationVisible(false)}
              >
                <Text
                  style={[
                    styles.buttonTextCancel,
                    { fontSize: isSmallScreen ? 13 : 14 },
                  ]}
                >
                  Annuler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.deleteButton,
                  {
                    padding: isSmallScreen ? 10 : 12,
                    width: isSmallScreen ? modalWidth * 0.38 : modalWidth * 0.4,
                  },
                ]}
                onPress={confirmDeleteAccount}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { fontSize: isSmallScreen ? 13 : 14 },
                  ]}
                >
                  Supprimer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={confirmationModalVisible}
        onCancel={closeConfirmationModal}
        onConfirm={handleLogOut}
        modalTitle="Confirmer la déconnexion"
        modalSubTitle="Vous serez déconnecté de votre compte."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  snackbarWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10000,
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 10 : 12,
    paddingBottom: 4,
  },
  mainContent: {
    flex: 1,
  },
  text: {
    fontFamily: "Montserrat-Regular",
  },
  titleScreen: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  textItemRegular: {
    fontFamily: "Montserrat-Regular",
  },
  textItemMedium: {
    fontFamily: "Montserrat-Medium",
  },
  settingItem: {
    borderColor: "#63BBF5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  settingsIconTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutButton: {
    borderColor: "#888888",
    borderWidth: 0.3,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dotted",
  },
  textVersion: {
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
  versionContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(201, 228, 238, 0.7)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContentContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginVertical: 5,
  },
  modalTitle: {
    fontFamily: "Montserrat-Medium",
    textAlign: "center",
    color: "#63BBF5",
  },
  modalLabel: {
    fontFamily: "Montserrat-Medium",
    marginBottom: 5,
    color: "#555",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonText: {
    color: "white",
    fontFamily: "Montserrat-Medium",
  },
  buttonTextCancel: {
    color: "#555",
    fontFamily: "Montserrat-Regular",
  },
  deleteModalText: {
    fontFamily: "Montserrat-Medium",
    textAlign: "center",
    color: "#FF033E",
  },
  deleteModalSubtext: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    color: "#666",
  },
  settingsItems: {
    flexDirection: "column",
    gap: 6,
  },
  buttonVersion: {
    flexDirection: "column",
    gap: 40,
  },
  inputChange: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 45,
    borderColor: "#ccc",
    marginTop: 5,
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "white",
  },
  modalInput: {
    height: 40,
    paddingLeft: 10,
    width: "100%",
    fontFamily: "Montserrat-Regular",
  },
  passwordInput: {
    height: 40,
    paddingLeft: 10,
    flex: 2,
    fontFamily: "Montserrat-Regular",
  },
  passwordHelp: {
    fontFamily: "Montserrat-Regular",
    color: "#666",
    marginTop: -5,
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: "#63BBF5",
  },
  eyeIcon: {
    padding: 5,
  },
  modalButton: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  confirmButton: {
    backgroundColor: "#63BBF5",
  },
  deleteButton: {
    backgroundColor: "#FF033E",
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default Settings;
