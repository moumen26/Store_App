import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const ConfirmationModal = ({
  visible,
  onCancel,
  onConfirm,
  modalTitle,
  modalSubTitle,
  showButton = true,
  isloading = false,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalBackground}>
        {!isloading ? (
          <View style={styles.confirmationModal}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalSubtitle}>{modalSubTitle}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={onCancel}>
                <Text style={styles.modalButtonTextColor}>Cancel</Text>
              </TouchableOpacity>
              {showButton && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={onConfirm}
                >
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.confirmationModal}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalSubtitle}>{modalSubTitle}</Text>
            <ActivityIndicator size="large" color="#26667E" />
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(201, 228, 238, 0.7)",
  },
  confirmationModal: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: wp(80),
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Montserrat-Bold",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
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
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalButtonTextColor: {
    color: "#26667E",
    fontSize: 16,
  },
});

export default ConfirmationModal;
