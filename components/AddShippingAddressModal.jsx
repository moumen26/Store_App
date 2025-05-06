import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import {
  UserIcon,
  MapPinIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
const LocationIcon = require("../assets/icons/Location.png");

const AddShippingAddressModal = ({
  visible,
  onClose,
  onSave,
  loading = false,
}) => {
  const [addressValues, setAddressValues] = useState({
    name: "",
    address: "",
    location: "",
  });

  const [showMapSelector, setShowMapSelector] = useState(false);

  const handleSave = () => {
    if (onSave) {
      onSave(addressValues);
    }
  };

  const handleLocationSelect = () => {
    // Here you would implement the logic to show Google Maps for location selection
    // For now we'll just toggle a placeholder state
    setShowMapSelector(true);
  };

  // Mock function to simulate selecting a location from map
  const selectLocation = (location) => {
    setAddressValues((prev) => ({
      ...prev,
      location: location || "Selected Location",
    }));
    setShowMapSelector(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ajouter une adresse</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <XMarkIcon size={20} color="#555" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContentContainer}>
            {/* Name field */}
            <Text style={styles.modalLabel}>Nom de l'adresse</Text>
            <View style={styles.inputChange}>
              <UserIcon size={20} color="#888888" />
              <TextInput
                style={styles.modalInput}
                value={addressValues.name}
                onChangeText={(text) =>
                  setAddressValues((prev) => ({ ...prev, name: text }))
                }
                placeholder="Ex: Domicile, Bureau, etc."
              />
            </View>

            {/* Address field */}
            <Text style={styles.modalLabel}>Adresse complète</Text>
            <View style={styles.inputChange}>
              <MapPinIcon size={20} color="#888888" />
              <TextInput
                style={styles.modalInput}
                value={addressValues.address}
                onChangeText={(text) =>
                  setAddressValues((prev) => ({ ...prev, address: text }))
                }
                placeholder="Entrez votre adresse"
                multiline={true}
                numberOfLines={2}
              />
            </View>

            {/* Location field - This opens the map */}
            <Text style={styles.modalLabel}>Emplacement géographique</Text>
            <TouchableOpacity
              style={styles.locationSelector}
              onPress={handleLocationSelect}
            >
              <Image source={LocationIcon} style={styles.locationIcon} />
              <Text
                style={
                  addressValues.location
                    ? styles.locationText
                    : styles.locationPlaceholder
                }
              >
                {addressValues.location || "Sélectionner sur la carte"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.buttonTextCancel}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.confirmButton,
                loading && styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sauvegarder</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Map selector modal */}
      <Modal
        visible={showMapSelector}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.mapContainer}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>Sélectionner un emplacement</Text>
            <TouchableOpacity onPress={() => setShowMapSelector(false)}>
              <XMarkIcon size={24} color="#63BBF5" />
            </TouchableOpacity>
          </View>

          {/* This is where you would integrate the Google Maps component */}
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>Carte Google Maps</Text>
            <Text style={styles.mapInstructions}>
              Intégrez ici votre composant Google Maps pour la sélection
              d'emplacement
            </Text>

            {/* Mock buttons for demonstration */}
            <TouchableOpacity
              style={styles.mockLocationButton}
              onPress={() => selectLocation("123 Rue de Paris, 75001 Paris")}
            >
              <Text style={styles.buttonText}>
                Sélectionner cet emplacement
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(201, 228, 238, 0.7)",
  },
  modalContent: {
    width: 320,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  closeButton: {
    padding: 5,
  },
  modalContentContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Montserrat-Medium",
    color: "#63BBF5",
  },
  modalLabel: {
    fontSize: 14,
    fontFamily: "Montserrat-Medium",
    marginBottom: 5,
    color: "#555",
  },
  inputChange: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    minHeight: 45,
    borderColor: "#ccc",
    marginTop: 5,
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "white",
  },
  modalInput: {
    minHeight: 40,
    paddingLeft: 10,
    width: "100%",
    fontFamily: "Montserrat-Regular",
  },
  locationSelector: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 45,
    borderColor: "#ccc",
    marginTop: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "white",
  },
  locationIcon: {
    marginRight: 10,
  },
  locationText: {
    fontFamily: "Montserrat-Regular",
    color: "#333",
  },
  locationPlaceholder: {
    fontFamily: "Montserrat-Regular",
    color: "#888",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    padding: 12,
    width: 130,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
  },
  buttonTextCancel: {
    color: "#555",
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
  },
  confirmButton: {
    backgroundColor: "#63BBF5",
  },
  disabledButton: {
    opacity: 0.7,
  },
  // Map modal styles
  mapContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  mapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "white",
  },
  mapTitle: {
    fontSize: 18,
    fontFamily: "Montserrat-Medium",
    color: "#63BBF5",
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  mapPlaceholderText: {
    fontSize: 20,
    fontFamily: "Montserrat-Medium",
    marginBottom: 20,
  },
  mapInstructions: {
    textAlign: "center",
    fontFamily: "Montserrat-Regular",
    color: "#666",
    marginHorizontal: 30,
    marginBottom: 30,
  },
  mockLocationButton: {
    backgroundColor: "#63BBF5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});

export default AddShippingAddressModal;
