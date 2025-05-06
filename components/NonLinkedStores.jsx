import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, FlatList } from "react-native";
import { StyleSheet } from "react-native";
import StoreCard from "./StoreCard";
import ConfirmationModal from "./ConfirmationModal";
import { useNavigation } from "expo-router";
import Snackbar from "./Snackbar";
import useAuthContext from "../app/hooks/useAuthContext";
import Config from "../app/config";

const NonLinkedStores = ({
  StoresData,
  CategoriesData,
  AllStoresDataRefetch,
}) => {
  const navigation = useNavigation();
  const { user } = useAuthContext();
  const [snackbarKey, setSnackbarKey] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");

  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(CategoriesData[0]?._id || "");
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);

  const [item, setItem] = useState(null);
  const openRequestModal = (val) => {
    setItem(val);
    setConfirmationModalVisible(true);
  };

  const closeConfirmationModal = () => {
    setItem(null);
    setConfirmationModalVisible(false);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleMenuClick = (tabId) => {
    setActiveTab(tabId);
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const filteredStores = StoresData.filter((store) =>
    store?.categories?.some((category) => category === activeTab)
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      key={item._id}
      style={[styles.buttonStore, activeTab === item._id && styles.storeToggle]}
      onPress={() => handleMenuClick(item._id)}
    >
      <Text style={[styles.text, activeTab === item._id && styles.storeToggle]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderStoreCard = ({ item }) => (
    <>
      <StoreCard
        key={item._id}
        title={item.storeName}
        sousTitle={`${item.wilaya}, ${item.commune}`}
        buttonText="Demander"
        onPress={() => openRequestModal(item)}
      />
    </>
  );

  const handleSubmitStoreAccess = async (storeId) => {
    setSubmitionLoading(true);
    try {
      const response = await fetch(
        `${Config.API_URL}/MyStores/${user?.info?.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            store: storeId,
          }),
        }
      );

      const json = await response.json();
      if (!response.ok) {
        setSubmitionLoading(false);
        setSnackbarType("error");
        setSnackbarMessage(json.message);
        setSnackbarKey((prevKey) => prevKey + 1);
        return;
      } else {
        setSubmitionLoading(false);
        setSnackbarType("success");
        setSnackbarMessage(json.message);
        setSnackbarKey((prevKey) => prevKey + 1);
        AllStoresDataRefetch();
        closeConfirmationModal();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitionLoading(false);
    }
  };

  return (
    <View className="mx-5">
      <View style={[styles.allTransparent]}>
        <FlatList
          data={CategoriesData}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderCategory}
          keyExtractor={(category) => category._id}
          contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 10 }}
        />
      </View>

      <Animated.View
        style={[
          styles.animatedContainer,
          { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <FlatList
          data={filteredStores}
          renderItem={(store) => renderStoreCard(store)}
          keyExtractor={(store) => store._id}
          contentContainerStyle={{
            paddingHorizontal: 0,
            paddingTop: 15,
            paddingBottom: 38,
            height: "100%",
            alignItems: "center",
          }}
          ListEmptyComponent={
            <Text style={styles.noStoresText}>
              Aucun magasin disponible pour cette catégorie.
            </Text>
          }
        />
      </Animated.View>
      <ConfirmationModal
        visible={confirmationModalVisible}
        onCancel={closeConfirmationModal}
        onConfirm={() => handleSubmitStoreAccess(item?._id)}
        isloading={submitionLoading}
        modalTitle="Demande d'accès au magasin"
        modalSubTitle={`Votre demande sera envoyée à l'administrateur du magasin "${item?.storeName}".`}
      />
      {snackbarKey !== 0 && (
        <Snackbar
          key={snackbarKey}
          message={snackbarMessage}
          duration={2000}
          snackbarType={snackbarType}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  noStoresText: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
  text: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
  },
  buttonStore: {
    width: 120,
    height: 42,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C9E4EE",
    borderWidth: 0.5,
    marginRight: 4,
  },
  allTransparent: {
    backgroundColor: "transparent",
  },
  containerScroll: {
    flexDirection: "column",
    gap: 16,
    paddingBottom: 38,
  },
  storeToggle: {
    backgroundColor: "#C9E4EE",
    color: "#63BBF5",
  },
});

export default NonLinkedStores;
