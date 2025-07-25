import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackButton from "../../components/BackButton";
import ShippingAddressCard from "../../components/ShippingAddressCard";
import useAuthContext from "../hooks/useAuthContext";
import Snackbar from "../../components/Snackbar";
import {
  UserIcon,
  MapPinIcon,
  MapIcon,
  PencilIcon,
} from "react-native-heroicons/outline";
import Config from "../config";

const ShippingAddressScreen = memo(() => {
  const { cart, user, dispatch } = useAuthContext();
  const route = useRoute();
  const { storeId } = route.params;
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [snackbarKey, setSnackbarKey] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("error");

  // State for map selection modal
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // For address modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    location: "Sélectionnez un lieu sur la carte",
  });

  // Filter cart items for the current store
  const storeCart = useMemo(
    () => cart?.filter((item) => item.store === storeId) || [],
    [cart, storeId]
  );

  const handleSelectItem = useCallback((index) => {
    setSelectedIndex(index);
  }, []);

  const handleApplyPress = useCallback(() => {
    if (!storeCart || storeCart.length === 0) {
      setSnackbarType("error");
      setSnackbarMessage(
        "Veuillez sélectionner des produits avant de choisir une adresse."
      );
      setSnackbarKey((prevKey) => prevKey + 1);
      return;
    }
    if (selectedIndex == null) {
      setSnackbarType("error");
      setSnackbarMessage("Veuillez sélectionner une adresse.");
      setSnackbarKey((prevKey) => prevKey + 1);
      return;
    }

    const selectedAddress = user?.info?.storeAddresses?.find(
      (item) => item._id === selectedIndex
    );
    if (selectedAddress) {
      dispatch({
        type: "ADD_TO_CART_ADDRESS",
        payload: { selectedAddress, storeId },
      });
      setSelectedIndex(null);
      navigation.goBack();
    } else {
      setSnackbarType("error");
      setSnackbarMessage("Adresse sélectionnée introuvable.");
      setSnackbarKey((prevKey) => prevKey + 1);
    }
  }, [storeCart, selectedIndex, user, dispatch, storeId, navigation]);

  const handleAddAddress = () => {
    setAddressToEdit(null);
    setNewAddress({
      name: "",
      address: "",
      location: "Sélectionnez un lieu sur la carte",
    });
    setModalVisible(true);
  };

  const handleEditAddress = (addressId) => {
    const addressToEdit = user?.info?.storeAddresses?.find(
      (address) => address._id === addressId
    );

    if (addressToEdit) {
      setAddressToEdit(addressToEdit);
      setNewAddress({
        name: addressToEdit.name || "",
        address: addressToEdit.address || "",
        location: addressToEdit.location || "Sélectionnez un lieu sur la carte",
      });
      setModalVisible(true);
    } else {
      setSnackbarType("error");
      setSnackbarMessage("Adresse introuvable.");
      setSnackbarKey((prevKey) => prevKey + 1);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    // Reset form data
    setNewAddress({
      name: "",
      address: "",
      location: "Sélectionnez un lieu sur la carte",
    });
    setAddressToEdit(null);
  };

  const openLocationPicker = () => {
    // Open the map modal for location selection
    setMapModalVisible(true);
  };

  const handleLocationSelect = (location) => {
    // Update the address with the selected location
    setNewAddress((prev) => ({
      ...prev,
      location: location.address,
      coordinates: location.coordinates, // Store coordinates for backend
    }));

    // Close the map modal
    setMapModalVisible(false);
  };

  const handleSaveAddress = async () => {
    if (submitting) return;

    setSubmitting(true);

    try {
      // If we're editing an existing address
      if (addressToEdit) {
        await updateExistingAddress();
      } else {
        // Validate inputs
        if (!newAddress.name.trim()) {
          closeModal();
          setSnackbarType("error");
          setSnackbarMessage("Veuillez entrer un nom pour cette adresse");
          setSnackbarKey((prevKey) => prevKey + 1);
          return;
        }

        if (!newAddress.address.trim()) {
          closeModal();
          setSnackbarType("error");
          setSnackbarMessage("Veuillez saisir une adresse");
          setSnackbarKey((prevKey) => prevKey + 1);
          return;
        }
        // If we're adding a new address
        await addNewAddress();
      }
    } catch (error) {
      console.error("Error saving address:", error);
      setSnackbarType("error");
      setSnackbarMessage(
        error.response?.data?.message ||
          "Échec de l'opération. Veuillez réessayer."
      );
      setSnackbarKey((prevKey) => prevKey + 1);
    } finally {
      setSubmitting(false);
    }
  };

  const addNewAddress = async () => {
    const response = await fetch(
      `${Config.API_URL}/Client/add/address/${user.info.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          name: newAddress.name,
          addr: newAddress.address,
          location: newAddress.location,
        }),
      }
    );

    const json = await response.json();
    if (!response.ok) {
      closeModal();
      setSnackbarType("error");
      setSnackbarMessage(json.message);
      setSnackbarKey((prevKey) => prevKey + 1);
      return;
    }

    const newAddressAdded = json.address;

    // Update locally with an estimated structure
    const updatedAddresses = [
      ...(user?.info?.storeAddresses || []),
      {
        _id: newAddressAdded._id,
        name: newAddressAdded.name,
        address: newAddressAdded.address,
        location: newAddressAdded.location,
      },
    ];

    dispatch({
      type: "UPDATE_USER",
      payload: {
        ...user,
        info: {
          ...user.info,
          storeAddresses: updatedAddresses,
        },
      },
    });

    setSnackbarType("success");
    setSnackbarMessage(json.message || "Adresse ajoutée avec succès");
    setSnackbarKey((prevKey) => prevKey + 1);
    closeModal();
  };

  const updateExistingAddress = async () => {
    const response = await fetch(
      `${Config.API_URL}/Client/update/address/${user.info.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          addressId: addressToEdit._id,
          name: newAddress.name,
          addr: newAddress.address,
          location: newAddress.location,
        }),
      }
    );

    const json = await response.json();
    if (!response.ok) {
      closeModal();
      setSnackbarType("error");
      setSnackbarMessage(json.message);
      setSnackbarKey((prevKey) => prevKey + 1);
      return;
    }

    // Update the address in the local state
    const updatedAddresses = user?.info?.storeAddresses.map((address) =>
      address._id === addressToEdit._id
        ? {
            ...address,
            name: newAddress.name,
            address: newAddress.address,
            location: newAddress.location,
          }
        : address
    );

    dispatch({
      type: "UPDATE_USER",
      payload: {
        ...user,
        info: {
          ...user.info,
          storeAddresses: updatedAddresses,
        },
      },
    });

    setSnackbarType("success");
    setSnackbarMessage(json.message);
    setSnackbarKey((prevKey) => prevKey + 1);
    closeModal();
  };

  const handleDeleteAddress = (addressId) => {
    Alert.alert(
      "Supprimer l'adresse",
      "Êtes-vous sûr de vouloir supprimer cette adresse?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => confirmDeleteAddress(addressId),
        },
      ]
    );
  };

  const confirmDeleteAddress = async (addressId) => {
    try {
      const response = await fetch(
        `${Config.API_URL}/Client/delete/address/${user.info.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            addressId: addressId,
          }),
        }
      );

      const json = await response.json();
      if (!response.ok) {
        setSnackbarType("error");
        setSnackbarMessage(json.message || "Échec de la suppression");
        setSnackbarKey((prevKey) => prevKey + 1);
        return;
      }

      // Update local state
      const updatedAddresses = user?.info?.storeAddresses.filter(
        (address) => address._id !== addressId
      );

      dispatch({
        type: "UPDATE_USER",
        payload: {
          ...user,
          info: {
            ...user.info,
            storeAddresses: updatedAddresses,
          },
        },
      });

      setSnackbarType("success");
      setSnackbarMessage(json.message || "Adresse supprimée avec succès");
      setSnackbarKey((prevKey) => prevKey + 1);

      // Clear selection if the deleted address was selected
      if (selectedIndex === addressId) {
        setSelectedIndex(null);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      setSnackbarType("error");
      setSnackbarMessage("Échec de la suppression de l'adresse");
      setSnackbarKey((prevKey) => prevKey + 1);
    }
  };

  const renderItems = useCallback(
    () =>
      user?.info?.storeAddresses?.map((item) => (
        <ShippingAddressCard
          key={item?._id}
          index={item?._id}
          AddressTitle={item?.name}
          AddressPlace={item?.address}
          AddressTime={`${25} minutes estimate arrived`}
          isSelected={item?._id === selectedIndex}
          onSelect={handleSelectItem}
          onEdit={handleEditAddress}
          onDelete={handleDeleteAddress}
        />
      )),
    [
      user,
      selectedIndex,
      handleSelectItem,
      handleEditAddress,
      handleDeleteAddress,
    ]
  );
  return (
    <View style={{ flex: 1, position: "relative" }}>
      {/* Snackbar with proper positioning - higher z-index than modal */}
      {snackbarKey !== 0 && (
        <View
          style={[
            styles.snackbarWrapper,
            modalVisible && styles.snackbarWrapperOverModal,
          ]}
        >
          <Snackbar
            key={snackbarKey}
            message={snackbarMessage}
            duration={3000}
            snackbarType={snackbarType}
            position="bottom"
          />
        </View>
      )}

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.titleScreen}>Adresses de livraison</Text>
          <View style={styles.emptyView} />
        </View>
        <View style={styles.scrollContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderItems()}
          </ScrollView>
        </View>
        <View style={styles.addAddressContainer}>
          <TouchableOpacity
            style={styles.addAddressButton}
            onPress={handleAddAddress}
          >
            <Text style={styles.addAddressText}>
              + Ajouter une nouvelle adresse
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={styles.navigationClass}
          className="bg-white w-full h-[80px] absolute left-0 bottom-0 flex-row items-center justify-around pb-3"
        >
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyPress}
          >
            <Text style={styles.applyButtonText}>Appliquer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Add/Edit Address Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {addressToEdit
                ? "Modifier l'adresse"
                : "Ajouter une nouvelle adresse"}
            </Text>

            <View style={styles.modalContentContainer}>
              {/* Name Field */}
              <Text style={styles.modalLabel}>Nom</Text>
              <View style={styles.inputChange}>
                <UserIcon size={20} color="#888888" />
                <TextInput
                  style={styles.modalInput}
                  value={newAddress.name}
                  onChangeText={(text) =>
                    setNewAddress((prev) => ({ ...prev, name: text }))
                  }
                  placeholder="Maison, Travail, etc."
                />
              </View>

              {/* Address Field */}
              <Text style={styles.modalLabel}>Adresse</Text>
              <View style={styles.inputChange}>
                <MapPinIcon size={20} color="#888888" />
                <TextInput
                  style={styles.modalInput}
                  value={newAddress.address}
                  onChangeText={(text) =>
                    setNewAddress((prev) => ({ ...prev, address: text }))
                  }
                  placeholder="Adresse complète"
                />
              </View>

              {/* Location Field */}
              <Text style={styles.modalLabel}>Lieu</Text>
              <TouchableOpacity
                style={styles.locationSelector}
                onPress={openLocationPicker}
                activeOpacity={0.7}
              >
                <MapIcon size={20} color="#19213D" />
                <Text
                  style={[
                    styles.locationText,
                    newAddress.location ===
                      "Sélectionnez un lieu sur la carte" &&
                      styles.locationPlaceholder,
                  ]}
                >
                  {newAddress.location === "Sélectionnez un lieu sur la carte"
                    ? newAddress.location
                    : newAddress.location.length > 30
                    ? newAddress.location.substring(0, 30) + "..."
                    : newAddress.location}
                </Text>
                <View style={styles.mapButton}>
                  <Text style={styles.mapButtonText}>Sélectionner</Text>
                </View>
              </TouchableOpacity>
            </View>

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
                  submitting && styles.disabledButton,
                ]}
                onPress={handleSaveAddress}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {addressToEdit ? "Mettre à jour" : "Enregistrer"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Map Location Selection Modal */}
      <Modal
        visible={mapModalVisible}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView style={styles.mapModalContainer}>
          <View style={styles.mapHeader}>
            <TouchableOpacity
              style={styles.closeMapButton}
              onPress={() => setMapModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Annuler</Text>
            </TouchableOpacity>
            <Text style={styles.mapTitleText}>Sélectionner un lieu</Text>
            <View style={{ width: 70 }} />
          </View>

          {/* Map View Placeholder - would be replaced with actual Google Maps component */}
          <View style={styles.mapContainer}>
            <Text style={styles.mapPlaceholderText}>
              La carte Google s'afficherait ici
            </Text>
            <Text style={styles.mapInstructionText}>
              Appuyez sur la carte pour sélectionner votre emplacement
            </Text>
          </View>

          {/* Sample Location Options */}
          <View style={styles.locationOptionsContainer}>
            <Text style={styles.locationOptionTitle}>Lieux suggérés</Text>

            <TouchableOpacity
              style={styles.locationOption}
              onPress={() =>
                handleLocationSelect({
                  address: "123 Rue Principale, Paris, 75001",
                  coordinates: { lat: 48.8566, lng: 2.3522 },
                })
              }
            >
              <MapPinIcon size={20} color="#19213D" />
              <View style={styles.locationOptionTextContainer}>
                <Text style={styles.locationOptionName}>Domicile</Text>
                <Text style={styles.locationOptionAddress}>
                  123 Rue Principale, Paris, 75001
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.locationOption}
              onPress={() =>
                handleLocationSelect({
                  address: "456 Avenue des Champs-Élysées, Paris, 75008",
                  coordinates: { lat: 48.8738, lng: 2.295 },
                })
              }
            >
              <MapPinIcon size={20} color="#19213D" />
              <View style={styles.locationOptionTextContainer}>
                <Text style={styles.locationOptionName}>Travail</Text>
                <Text style={styles.locationOptionAddress}>
                  456 Avenue des Champs-Élysées, Paris, 75008
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.locationOption}
              onPress={() =>
                handleLocationSelect({
                  address: "789 Rue de Rivoli, Paris, 75001",
                  coordinates: { lat: 48.8606, lng: 2.3376 },
                })
              }
            >
              <MapPinIcon size={20} color="#19213D" />
              <View style={styles.locationOptionTextContainer}>
                <Text style={styles.locationOptionName}>À proximité</Text>
                <Text style={styles.locationOptionAddress}>
                  789 Rue de Rivoli, Paris, 75001
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  snackbarWrapper: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    zIndex: 10000,
    alignItems: "center",
  },
  snackbarWrapperOverModal: {
    zIndex: 20000, // Higher z-index when modal is visible
    elevation: 25, // Higher elevation for Android
    bottom: "40%", // Position it in the middle of the screen when modal is open
  },
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  emptyView: {
    width: 40,
    height: 40,
  },
  scrollContainer: {
    marginHorizontal: 20,
    // borderTopWidth: 1,
    // borderColor: "#F7F7F7",
    paddingTop: 18,
    height: "70%",
  },
  scrollContent: {
    flexGrow: 1,
    gap: 18,
  },
  row: {
    borderBottomWidth: 1,
    borderColor: "#F7F7F7",
    marginBottom: 10,
    paddingBottom: 5,
  },
  addressActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 5,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginRight: 15,
  },
  editButtonText: {
    color: "#19213D",
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    marginLeft: 5,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    color: "#FF6B6B",
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
  },
  addAddressContainer: {
    marginHorizontal: 20,
    marginTop: 40,
  },
  addAddressButton: {
    borderColor: "#888888",
    borderWidth: 0.3,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dotted",
  },
  addAddressText: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
  },
  applyButton: {
    backgroundColor: "#19213D",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 340,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  navigationClass: {
    borderColor: "#888888",
    borderWidth: 0.5,
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  disabledButton: {
    backgroundColor: "#84a7b5", // Lighter color to indicate disabled state
  },
  // Modal styles (remaining styles unchanged)
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(201, 228, 238, 0.7)",
    zIndex: 15000, // Set z-index lower than snackbar over modal
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
  modalContentContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Montserrat-Medium",
    marginBottom: 15,
    textAlign: "center",
    color: "#19213D",
  },
  modalLabel: {
    fontSize: 14,
    fontFamily: "Montserrat-Medium",
    marginBottom: 5,
    color: "#555",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
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
  locationSelector: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 45,
    borderColor: "#19213D",
    marginTop: 5,
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#e8f4f8", // Light blue background to indicate it's tappable
  },
  locationText: {
    marginLeft: 10,
    fontFamily: "Montserrat-Regular",
    color: "#333",
    flex: 1,
  },
  locationPlaceholder: {
    color: "#666",
    fontStyle: "italic",
  },
  mapButton: {
    backgroundColor: "#19213D",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 5,
  },
  mapButtonText: {
    color: "white",
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
  },
  modalButton: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    padding: 12,
    width: 130,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#19213D",
  },
  // Map modal styles
  mapModalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  mapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  closeMapButton: {
    padding: 5,
    width: 70,
  },
  closeButtonText: {
    color: "#19213D",
    fontSize: 16,
    fontFamily: "Montserrat-Medium",
  },
  mapTitleText: {
    fontSize: 18,
    fontFamily: "Montserrat-Medium",
  },
  mapContainer: {
    height: 300,
    backgroundColor: "#e8f4f8",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontFamily: "Montserrat-Medium",
    color: "#19213D",
    marginBottom: 10,
  },
  mapInstructionText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#666",
  },
  locationOptionsContainer: {
    padding: 15,
  },
  locationOptionTitle: {
    fontSize: 16,
    fontFamily: "Montserrat-Medium",
    marginBottom: 15,
    color: "#333",
  },
  locationOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  locationOptionTextContainer: {
    marginLeft: 15,
  },
  locationOptionName: {
    fontSize: 16,
    fontFamily: "Montserrat-Medium",
    color: "#333",
  },
  locationOptionAddress: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#666",
    marginTop: 3,
  },
});

export default ShippingAddressScreen;
