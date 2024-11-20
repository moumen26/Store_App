import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowRightIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  TrashIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "expo-router";

const settings = () => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [currentSetting, setCurrentSetting] = useState({});
  const [currentValue, setCurrentValue] = useState("");
  const [newValue, setNewValue] = useState("");

  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);

  const [settings, setSettings] = useState([
    {
      id: "name",
      icon: <UserIcon color="#26667E" size={18} />,
      label: "Name",
      value: "Ex. Faroukhi Amine",
    },
    {
      id: "email",
      icon: <EnvelopeIcon color="#26667E" size={18} />,
      label: "Email",
      value: "example@gmail.com",
    },
    {
      id: "password",
      icon: <LockClosedIcon color="#26667E" size={18} />,
      label: "Password",
      value: "mot*****",
    },
    {
      id: "phone",
      icon: <PhoneIcon color="#26667E" size={18} />,
      label: "Phone Number",
      value: "+213 791 46 78 48",
    },
    {
      id: "delete",
      icon: <TrashIcon color="#26667E" size={18} />,
      label: "Delete Account",
      value: "Continue",
    },
  ]);

  const handleLogOut = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "SignIn/index" }],
    });
  };

  const openModal = (setting) => {
    setCurrentSetting(setting);
    setCurrentValue(setting.value);
    setNewValue(setting.value);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setDeleteConfirmationVisible(false);
  };

  const saveSetting = () => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === currentSetting.id
          ? { ...setting, value: newValue }
          : setting
      )
    );
    closeModal();
  };

  const confirmDeleteAccount = () => {
    // Implement logic to delete account here
    // For demonstration, let's reset to sign-in screen
    navigation.reset({
      index: 0,
      routes: [{ name: "SignInScreen" }],
    });
  };

  return (
    <SafeAreaView className="bg-white pt-5 pb-1 relative h-full">
      <Text className="text-center mb-[20]" style={styles.titleScreen}>
        Settings
      </Text>
      <View className="mx-5">
        <Text style={styles.text}>Account</Text>
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
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
          <Text style={styles.textItemRegular}>Log Out</Text>
        </TouchableOpacity>
        <View className="flex-col items-center space-y-[1]">
          <Text style={styles.textVersion}>App Version 0.0.1</Text>
          <Text style={styles.textItemRegular}>All Rights Reserved</Text>
        </View>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.textItemRegular}>{currentSetting.label}</Text>
            <TextInput
              style={styles.modalInput}
              value={currentValue}
              editable={false}
            />
            <TextInput
              style={styles.modalInput}
              value={newValue}
              onChangeText={setNewValue}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={saveSetting}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.buttonTextCancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={deleteConfirmationVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.deleteModalText}>
              Are you sure you want to delete your account?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.buttonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={confirmDeleteAccount}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#3E9CB9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#F7F7F7",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#3E9CB9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
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
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    marginBottom: 20,
  },
  settingsItems: {
    flexDirection: "column",
    gap: 6,
  },
  buttonVersion: {
    flexDirection: "column",
    gap: 40,
  },
});

export default settings;
