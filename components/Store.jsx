import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  FlatList,
  Dimensions,
} from "react-native";
import { StyleSheet } from "react-native";
import StoreCard from "./StoreCard";
import { useNavigation } from "expo-router";

// Get screen dimensions
const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

// Helper function to get responsive font size
const getResponsiveFontSize = (baseSize) => {
  const scale = screenWidth / 375; // Base width (iPhone X)
  const newSize = baseSize * scale;

  // Screen size categories
  if (screenWidth <= 360) {
    // Small screens
    return Math.max(newSize * 0.85, baseSize * 0.8);
  } else if (screenWidth <= 414) {
    // Medium screens
    return newSize;
  } else {
    // Large screens
    return Math.min(newSize * 1.1, baseSize * 1.3);
  }
};

// Helper function to get responsive dimensions
const getResponsiveDimension = (baseSize) => {
  const scale = screenWidth / 375;
  const newSize = baseSize * scale;

  if (screenWidth <= 360) {
    // Small screens
    return Math.max(newSize * 0.9, baseSize * 0.85);
  } else if (screenWidth <= 414) {
    // Medium screens
    return newSize;
  } else {
    // Large screens
    return Math.min(newSize * 1.1, baseSize * 1.2);
  }
};

const Store = ({ StoresData, CategoriesData }) => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(CategoriesData[0]?._id || "");
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

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
    store?.store?.categories.some((category) => category._id === activeTab)
  );

  const renderStoreCard = ({ item }) => (
    <StoreCard
      key={item._id}
      title={item.store.storeName}
      sousTitle={`${item.store.wilaya}, ${item.store.commune}`}
      buttonText="Acheter"
      onPress={() =>
        navigation.navigate("Store/index", {
          storeId: item.store._id,
          storeName: item.store.storeName,
          storeAddress: item.store.storeAddress,
        })
      }
    />
  );

  const renderNoStores = () => (
    <View style={styles.noStoresContainer}>
      <Text style={styles.noStoresText}>
        Aucun magasin disponible pour cette catégorie.
      </Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      {/* Categories horizontal scroll - fixed at top */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={CategoriesData}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(category) => category._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.buttonStore,
                activeTab === item._id && styles.storeToggle,
              ]}
              onPress={() => handleMenuClick(item._id)}
            >
              <Text
                style={[
                  styles.text,
                  activeTab === item._id && styles.storeToggleText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesContentContainer}
        />
      </View>

      {/* Stores vertical scroll - takes remaining space */}
      <Animated.View
        style={[
          styles.storesContainer,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <FlatList
          data={filteredStores}
          renderItem={renderStoreCard}
          keyExtractor={(store) => store._id}
          ListEmptyComponent={renderNoStores}
          contentContainerStyle={styles.storesContentContainer}
          showsVerticalScrollIndicator={true}
          bounces={true}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  categoriesContainer: {
    backgroundColor: "#FFFFFF",
    paddingBottom: getResponsiveDimension(10),
  },
  categoriesContentContainer: {
    paddingTop: getResponsiveDimension(10),
  },
  storesContainer: {
    flex: 1,
  },
  storesContentContainer: {
    paddingBottom: getResponsiveDimension(20),
    flexGrow: 1,
  },
  noStoresContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: getResponsiveDimension(40),
  },
  noStoresText: {
    fontSize: getResponsiveFontSize(13),
    fontFamily: "Montserrat-Regular",
    color: "#888888",
    textAlign: "center",
  },
  text: {
    fontFamily: "Montserrat-Regular",
    fontSize: getResponsiveFontSize(11),
    color: "#000000",
  },
  storeToggleText: {
    color: "#FFFFFF",
  },
  buttonStore: {
    minWidth: getResponsiveDimension(120),
    width: "auto",
    height: getResponsiveDimension(42),
    paddingHorizontal: getResponsiveDimension(14),
    borderRadius: getResponsiveDimension(40),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#E3EFFF",
    borderWidth: 0.5,
    marginRight: getResponsiveDimension(4),
  },
  storeToggle: {
    backgroundColor: "#19213D",
  },
});

export default Store;
