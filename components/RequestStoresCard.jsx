import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { StyleSheet } from "react-native";
import StoreCard from "./StoreCard";
import ConfirmationModal from "./ConfirmationModal";

// Helper function to capitalize first letter of each word
const capitalizeFirstLetter = (text) => {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const RequestStoresCard = ({ StoresData, CategoriesData }) => {
  // Sort categories alphabetically by name (A to Z)
  const sortedCategoriesData = useMemo(() => {
    if (!CategoriesData || CategoriesData.length === 0) return [];
    return [...CategoriesData].sort((a, b) => {
      const nameA = (a?.name || "").toLowerCase();
      const nameB = (b?.name || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [CategoriesData]);

  // Sort stores alphabetically by store name (A to Z)
  const sortedStoresData = useMemo(() => {
    if (!StoresData || StoresData.length === 0) return [];
    return [...StoresData].sort((a, b) => {
      const nameA = (a?.store?.storeName || "").toLowerCase();
      const nameB = (b?.store?.storeName || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [StoresData]);

  const [activeTab, setActiveTab] = useState(
    sortedCategoriesData[0]?._id || ""
  );
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalSubTitle, setModalSubTitle] = useState("");

  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Update activeTab when sortedCategoriesData changes
  useEffect(() => {
    if (sortedCategoriesData.length > 0 && !activeTab) {
      setActiveTab(sortedCategoriesData[0]._id);
    }
  }, [sortedCategoriesData, activeTab]);

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

  // Filter and sort stores based on active category
  const filteredAndSortedStores = useMemo(() => {
    const filtered = sortedStoresData.filter((store) =>
      store?.store?.categories.some((category) => category._id === activeTab)
    );

    // Sort filtered results alphabetically by store name
    return filtered.sort((a, b) => {
      const nameA = (a?.store?.storeName || "").toLowerCase();
      const nameB = (b?.store?.storeName || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [sortedStoresData, activeTab]);

  const renderStoreCard = ({ item }) => (
    <StoreCard
      key={item._id}
      title={capitalizeFirstLetter(item.store.storeName)}
      sousTitle={`${item.store.wilaya}, ${item.store.commune}`}
      buttonText={item?.status == "pending" ? "Pending" : "Rejected"}
      onPress={() => {
        if (item?.status == "pending") {
          setModalTitle("En attente");
          setModalSubTitle("Le magasin n'a pas encore accepté votre demande.");
        } else {
          setModalTitle("Rejeté");
          setModalSubTitle("Le magasin a rejeté votre demande.");
        }
        setModalVisible(true);
      }}
    />
  );

  const renderNoStores = () => (
    <Text style={styles.noStoresText}>
      Aucun magasin disponible pour cette catégorie.
    </Text>
  );

  return (
    <View>
      <View style={[styles.allTransparent]}>
        <FlatList
          data={sortedCategoriesData} // Use sorted categories
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(category) => category._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item._id}
              style={[
                styles.buttonStore,
                activeTab === item._id && styles.storeToggle,
              ]}
              onPress={() => handleMenuClick(item._id)}
            >
              <Text
                style={[
                  styles.text,
                  activeTab === item._id && styles.storeToggle,
                  {
                    fontSize: isSmallScreen ? 11 : isLargeScreen ? 15 : 11,
                  },
                ]}
              >
                {capitalizeFirstLetter(item.name)}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 10 }}
        />
      </View>
      <Animated.View
        style={[
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <FlatList
          data={filteredAndSortedStores} // Use filtered and sorted stores
          renderItem={renderStoreCard}
          keyExtractor={(store) => store._id}
          contentContainerStyle={{
            paddingHorizontal: 0,
            paddingTop: 15,
            height: "100%",
          }}
          ListEmptyComponent={renderNoStores}
        />
      </Animated.View>
      <ConfirmationModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        modalTitle={modalTitle}
        modalSubTitle={modalSubTitle}
        showButton={false}
      />
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
    minWidth: 120,
    width: "auto",
    height: 42,
    borderRadius: 40,
    paddingInline: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C9E4EE",
    borderWidth: 0.5,
    marginRight: 4,
    marginBottom: 2,
  },
  storeToggle: {
    backgroundColor: "#19213D",
    color: "#fff",
  },
  allTransparent: {
    backgroundColor: "transparent",
  },
});

export default RequestStoresCard;
