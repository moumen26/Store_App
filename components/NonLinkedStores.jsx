import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, FlatList } from "react-native";
import { StyleSheet } from "react-native";
import StoreCard from "./StoreCard";
import ConfirmationModal from "./ConfirmationModal";
import { useNavigation } from "expo-router";
import Snackbar from "./Snackbar";
import useAuthContext from "../app/hooks/useAuthContext";
import Config from "../app/config";

const NonLinkedStores = ({ StoresData, CategoriesData, AllStoresDataRefetch }) => {
  const navigation = useNavigation();
  const { user } = useAuthContext();
  const [snackbarKey, setSnackbarKey] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("#FF0000");
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(CategoriesData[0]?._id || "");
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);

  const openRequestModal = () => {
    setConfirmationModalVisible(true);
  };

  const closeConfirmationModal = () => {
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
        buttonText="Request"
        onPress={openRequestModal}
      />
      <ConfirmationModal
        visible={confirmationModalVisible}
        onCancel={closeConfirmationModal}
        onConfirm={() => handleSubmitStoreAccess(item._id)}
        isloading={submitionLoading}
        modalTitle="Access Store Permission"
        modalSubTitle={`Your request will be sent to the administrator of ${item.storeName}`}
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
        setSnackbarColor("#FF0000");
        setSnackbarMessage(json.message);
        setSnackbarKey((prevKey) => prevKey + 1);
        return;
      } else {
        setSubmitionLoading(false);
        setSnackbarColor("#00FF00");
        setSnackbarMessage(json.message);
        setSnackbarKey((prevKey) => prevKey + 1);
        AllStoresDataRefetch();
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
          {
            height: "70%",
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <FlatList
          data={filteredStores}
          renderItem={renderStoreCard}
          keyExtractor={(store) => store._id}
          contentContainerStyle={{
            paddingHorizontal: 0,
            paddingTop: 15,
          }}
          ListEmptyComponent={
            <Text style={styles.noStoresText}>
              Aucun magasin disponible pour cette catégorie.
            </Text>
          }
        />
      </Animated.View>
      {snackbarKey !== 0 && (
        <Snackbar
          key={snackbarKey}
          message={snackbarMessage}
          duration={2000}
          actionText="Close"
          backgroundColor={snackbarColor}
          textColor="white"
          actionTextColor="yellow"
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
  storeToggle: {
    backgroundColor: "#C9E4EE",
    color: "#26667E",
  },
});

export default NonLinkedStores;
