import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, FlatList } from "react-native";
import { StyleSheet } from "react-native";
import StoreCard from "./StoreCard";
import ConfirmationModal from "./ConfirmationModal";
import { useNavigation } from "expo-router";

const NonLinkedStores = ({ StoresData, CategoriesData }) => {
  const navigation = useNavigation();
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
    store?.categories.some((category) => category === activeTab)
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
        modalTitle="Access Store Permission"
        modalSubTitle={`Your request will be sent to the administrator of ${item.storeName}`}
      />
    </>
  );

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
