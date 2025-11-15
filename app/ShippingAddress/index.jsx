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
  Dimensions,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackButton from "../../components/BackButton";
import ShippingAddressCard from "../../components/ShippingAddressCard";
import useAuthContext from "../hooks/useAuthContext";
import Snackbar from "../../components/Snackbar";
import { UserIcon, MapPinIcon } from "react-native-heroicons/outline";
import Config from "../config";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");

const ShippingAddressScreen = memo(() => {
  const { cart, user, dispatch } = useAuthContext();
  const route = useRoute();
  const { storeId } = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Calculate responsive values
  const isSmallScreen = width < 375;
  const bottomBarHeight =
    Platform.OS === "android"
      ? (isSmallScreen ? 40 : 50) + insets.bottom
      : isSmallScreen
      ? 70
      : 80;

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [snackbarKey, setSnackbarKey] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("error");

  // For address modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
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

  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "Nous avons besoin de votre permission pour accéder à votre position."
        );
        setLoadingLocation(false);
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Reverse geocoding to get address
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addresses.length > 0) {
        const addr = addresses[0];
        const fullAddress = [
          addr.streetNumber,
          addr.street,
          addr.city,
          addr.region,
          addr.postalCode,
          addr.country,
        ]
          .filter(Boolean)
          .join(", ");

        setNewAddress((prev) => ({
          ...prev,
          address: fullAddress,
        }));

        setSnackbarType("success");
        setSnackbarMessage("Position récupérée avec succès!");
        setSnackbarKey((prevKey) => prevKey + 1);
      }
    } catch (error) {
      console.error("Erreur de localisation:", error);
      setSnackbarType("error");
      setSnackbarMessage(
        "Impossible de récupérer votre position. Veuillez réessayer."
      );
      setSnackbarKey((prevKey) => prevKey + 1);
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleAddAddress = () => {
    setAddressToEdit(null);
    setNewAddress({
      name: "",
      address: "",
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
    setNewAddress({
      name: "",
      address: "",
    });
    setAddressToEdit(null);
  };

  const handleSaveAddress = async () => {
    if (submitting) return;

    setSubmitting(true);

    try {
      if (addressToEdit) {
        await updateExistingAddress();
      } else {
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

    const updatedAddresses = [
      ...(user?.info?.storeAddresses || []),
      {
        _id: newAddressAdded._id,
        name: newAddressAdded.name,
        address: newAddressAdded.address,
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

    const updatedAddresses = user?.info?.storeAddresses.map((address) =>
      address._id === addressToEdit._id
        ? {
            ...address,
            name: newAddress.name,
            address: newAddress.address,
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
          style={[
            styles.navigationClass,
            {
              height: bottomBarHeight,
              paddingBottom:
                Platform.OS === "android" ? insets.bottom / 1.5 : 0,
            },
          ]}
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
              <Text style={styles.modalLabel}>Nom</Text>
              <View style={styles.inputChange}>
                <UserIcon size={20} color="#888888" />
                <TextInput
                  style={styles.modalInput}
                  value={newAddress.name}
                  onChangeText={(text) =>
                    setNewAddress((prev) => ({ ...prev, name: text }))
                  }
                  placeholder="Maison, Dépot, etc."
                  placeholderTextColor="#888888"
                />
              </View>

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
                  placeholderTextColor="#888888"
                />
              </View>

              {/* Location Button */}
              <TouchableOpacity
                style={styles.locationButton}
                onPress={getCurrentLocation}
                disabled={loadingLocation}
              >
                {loadingLocation ? (
                  <ActivityIndicator size="small" color="#19213D" />
                ) : (
                  <>
                    {/* <MapPinIcon size={18} color="#19213D" /> */}
                    <Text style={styles.locationButtonText}>
                      Utiliser ma position actuelle
                    </Text>
                  </>
                )}
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
    zIndex: 20000,
    elevation: 25,
    bottom: "40%",
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
    paddingTop: 18,
    height: "70%",
  },
  scrollContent: {
    flexGrow: 1,
    gap: 18,
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
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderColor: "#888888",
    borderWidth: 0.5,
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  disabledButton: {
    backgroundColor: "#84a7b5",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(201, 228, 238, 0.7)",
    zIndex: 15000,
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
    borderRadius: 8,
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
    minHeight: 45,
    borderColor: "#ccc",
    marginTop: 5,
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "white",
  },
  modalInput: {
    flex: 1,
    minHeight: 45,
    paddingLeft: 10,
    fontFamily: "Montserrat-Regular",
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
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF7FA",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 10,
    gap: 8,
  },
  locationButtonText: {
    fontSize: 13,
    fontFamily: "Montserrat-Medium",
    color: "#19213D",
  },
});

export default ShippingAddressScreen;
