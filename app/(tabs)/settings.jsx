import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
      icon: <UserIcon color="#26667E" size={18} />,
      label: "Nom",
      value: `${user.info.firstName} ${user.info.lastName}`,
      type: "fullname",
    },
    {
      id: "email",
      icon: <EnvelopeIcon color="#26667E" size={18} />,
      label: "Email",
      value: user.info.email,
      type: "email",
    },
    {
      id: "password",
      icon: <LockClosedIcon color="#26667E" size={18} />,
      label: "Mot de passe",
      value: "••••••••",
      type: "password",
    },
    {
      id: "phone",
      icon: <PhoneIcon color="#26667E" size={18} />,
      label: "Numero de téléphone",
      value: user.info.phoneNumber,
      type: "phone",
    },
    {
      id: "delete",
      icon: <TrashIcon color="#26667E" size={18} />,
      label: "Supprimer le compte",
      value: "Continuer",
      type: "delete",
    },
  ]);

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
  console.log(snackbarKey);
  console.log(snackbarMessage);
  console.log(snackbarType);

  
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
            lastName: inputValues.lastName
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
            oldPassword: passwordValues.oldPassword
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
        setSettings(prevSettings => 
          prevSettings.map(setting => 
            setting.id === "name" ? {...setting, value: newFullName} : setting
          )
        );
        
        // Update auth context
        dispatch({ 
          type: 'UPDATE_USER', 
          payload: { 
            ...user, 
            info: { 
              ...user.info, 
              firstName: inputValues.firstName, 
              lastName: inputValues.lastName 
            } 
          } 
        });
      } 
      else if (currentSetting.type === "email") {
        setSettings(prevSettings => 
          prevSettings.map(setting => 
            setting.id === "email" ? {...setting, value: inputValues.email} : setting
          )
        );
        
        // Update auth context
        dispatch({ 
          type: 'UPDATE_USER', 
          payload: { 
            ...user, 
            info: { 
              ...user.info, 
              email: inputValues.email 
            } 
          } 
        });
      } 
      else if (currentSetting.type === "phone") {
        setSettings(prevSettings => 
          prevSettings.map(setting => 
            setting.id === "phone" ? {...setting, value: inputValues.phoneNumber} : setting
          )
        );
        
        // Update auth context
        dispatch({ 
          type: 'UPDATE_USER', 
          payload: { 
            ...user, 
            info: { 
              ...user.info, 
              phoneNumber: inputValues.phoneNumber 
            } 
          } 
        });
      }

      setSnackbarType("success");
      setSnackbarMessage(json.message || "Profil mis à jour avec succès");
      setSnackbarKey((prevKey) => prevKey + 1);
      closeModal();
      
    } catch (err) {
      console.error("Update error:", err);
      setSnackbarType("error");
      setSnackbarMessage("Une erreur s'est produite lors de la mise à jour du profil");
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
    switch (currentSetting.type) {
      case "fullname":
        return (
          <>
            <Text style={styles.modalLabel}>Prénom</Text>
            <View style={styles.inputChange}>
              <UserIcon size={20} color="#888888" />
              <TextInput
                style={styles.modalInput}
                value={inputValues.firstName}
                onChangeText={(text) => setInputValues(prev => ({...prev, firstName: text}))}
                placeholder="Prénom"
              />
            </View>
            
            <Text style={styles.modalLabel}>Nom</Text>
            <View style={styles.inputChange}>
              <UserIcon size={20} color="#888888" />
              <TextInput
                style={styles.modalInput}
                value={inputValues.lastName}
                onChangeText={(text) => setInputValues(prev => ({...prev, lastName: text}))}
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
              <EnvelopeIcon size={20} color="#888888" />
              <TextInput
                style={styles.modalInput}
                value={inputValues.email}
                onChangeText={(text) => setInputValues(prev => ({...prev, email: text}))}
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
              <PhoneIcon size={20} color="#888888" />
              <TextInput
                style={styles.modalInput}
                value={inputValues.phoneNumber}
                onChangeText={(text) => setInputValues(prev => ({...prev, phoneNumber: text}))}
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
              <LockClosedIcon size={20} color="#888888" />
              <TextInput
                style={styles.passwordInput}
                value={passwordValues.oldPassword}
                onChangeText={(text) => setPasswordValues(prev => ({...prev, oldPassword: text}))}
                placeholder="Ancien mot de passe"
                secureTextEntry={!showOldPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => setShowOldPassword(!showOldPassword)}
                style={styles.eyeIcon}
              >
                {showOldPassword ? (
                  <EyeSlashIcon size={20} color="#888888" />
                ) : (
                  <EyeIcon size={20} color="#888888" />
                )}
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalLabel}>Nouveau mot de passe</Text>
            <View style={styles.inputChange}>
              <LockClosedIcon size={20} color="#888888" />
              <TextInput
                style={styles.passwordInput}
                value={passwordValues.newPassword}
                onChangeText={(text) => setPasswordValues(prev => ({...prev, newPassword: text}))}
                placeholder="Nouveau mot de passe"
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeIcon}
              >
                {showNewPassword ? (
                  <EyeSlashIcon size={20} color="#888888" />
                ) : (
                  <EyeIcon size={20} color="#888888" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.passwordHelp}>
              Le mot de passe doit contenir au moins 8 caractères, une majuscule, 
              une minuscule, un chiffre et un caractère spécial.
            </Text>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="bg-white pt-3 pb-1 relative h-full">
      {/* Snackbar notifications */}
      {snackbarKey != 0 && (
        <Snackbar
          key={snackbarKey}
          message={snackbarMessage}
          duration={3000}
          snackbarType={snackbarType}
        />
      )}
      <Text className="text-center mb-[20]" style={styles.titleScreen}>
        Paramètres{" "}
      </Text>
      <View className="mx-5">
        <Text style={styles.text}>Compte</Text>
        <View style={styles.settingsItems} className="mt-[20]">
          {settings.map((setting, index) => (
            <TouchableOpacity
              key={index}
              style={styles.settingItem}
              className="w-full flex-row items-center justify-between"
              onPress={() => {
                if (setting.id === "delete") {
                  setDeleteConfirmationVisible(true);
                } else {
                  openModal(setting);
                }
              }}
            >
              <View style={styles.settingsIconTitle}>
                {setting.icon}
                <Text style={styles.textItemRegular}>{setting.label}</Text>
              </View>
              <View style={styles.settingsIconTitle}>
                <Text style={styles.textItemMeduim}>{setting.value}</Text>
                <ArrowRightIcon color="#26667E" size={18} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonVersion} className="mx-5 mt-[140]">
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={openConfirmationLogOutModal}
        >
          <Text style={styles.textItemRegular}>Se Déconnecter</Text>
        </TouchableOpacity>
        <View className="flex-col items-center space-y-[1]">
          <Text style={styles.textVersion}>Version de l'application 0.0.1</Text>
          <Text style={styles.textItemRegular}>Tous droits réservés</Text>
        </View>
      </View>

      {/* Profile Update Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Modifier {currentSetting?.label}
            </Text>
            
            {renderModalContent()}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={closeModal}
                disabled={submitting}
              >
                <Text style={styles.buttonTextCancel}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton, 
                  styles.confirmButton,
                  submitting && styles.disabledButton
                ]}
                onPress={handleUpdateProfile}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sauvegarder</Text>
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
          <View style={styles.modalContent}>
            <Text style={styles.deleteModalText}>
              Êtes-vous sûr de vouloir supprimer votre compte ?
            </Text>
            <Text style={styles.deleteModalSubtext}>
              Cette action est irréversible et toutes vos données seront perdues.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setDeleteConfirmationVisible(false)}
              >
                <Text style={styles.buttonTextCancel}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDeleteAccount}
              >
                <Text style={styles.buttonText}>Supprimer</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
  navigationClass: {
    borderColor: "#888888",
    borderWidth: 0.5,
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  navigationText: {
    fontSize: 10,
    fontFamily: "Montserrat-Regular",
  },
  textItemRegular: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
  },
  textItemMeduim: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
  },
  settingItem: {
    height: 45,
    borderBottomWidth: 0.5,
    borderColor: "#3E9CB9",
  },
  settingsIconTitle: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  logoutButton: {
    borderColor: "#888888",
    borderWidth: 0.3,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dotted",
  },
  textVersion: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(201, 228, 238, 0.4)",
  },
  modalContent: {
    width: 320,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "Montserrat-Medium",
    marginBottom: 15,
    textAlign: "center",
  },
  modalLabel: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    marginBottom: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
  },
  buttonTextCancel: {
    color: "black",
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
  },
  deleteModalText: {
    fontSize: 16,
    fontFamily: "Montserrat-Medium",
    textAlign: "center",
    marginBottom: 10,
  },
  deleteModalSubtext: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    marginBottom: 20,
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
    height: 40,
    borderColor: "#ccc",
    marginTop: 5,
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    marginBottom: 15,
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
    width: "85%",
    fontFamily: "Montserrat-Regular",
  },
  passwordHelp: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    color: "#666",
    marginTop: -10,
  },
  eyeIcon: {
    padding: 5,
  },
  modalButton: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    padding: 10,
    width: 120,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#26667E",
  },
  deleteButton: {
    backgroundColor: "#FF033E",
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default Settings;