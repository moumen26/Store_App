import React, { useState, useEffect, useRef } from "react";
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
import { useNavigation } from "expo-router";

const Store = ({ StoresData, CategoriesData }) => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(CategoriesData[0]?._id || "");
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

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
    <Text style={styles.noStoresText}>
      Aucun magasin disponible pour cette catégorie.
    </Text>
  );

  return (
    <View>
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
                {
                  fontSize: isSmallScreen ? 11 : isLargeScreen ? 15 : 11,
                },
                activeTab === item._id && styles.storeToggle,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 10 }}
      />
      <Animated.View
        style={[
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
          contentContainerStyle={styles.containerScroll}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerScroll: {
    flexDirection: "column",
    paddingTop: 15,
    height: "auto",
  },
  noStoresText: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
  text: {
    fontFamily: "Montserrat-Regular",
  },
  buttonStore: {
    minWidth: 120,
    width: "auto",
    height: 42,
    paddingInline: 14,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#E3EFFF",
    borderWidth: 0.5,
    marginRight: 4,
  },
  storeToggle: {
    backgroundColor: "#19213D",
    color: "#fff",
  },
});

export default Store;
