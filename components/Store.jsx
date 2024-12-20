import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { StyleSheet } from "react-native";
import StoreCard from "./StoreCard";
import { useNavigation } from "expo-router";

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
    store.store.categories.some((category) => category._id === activeTab)
  );

  return (
    <View>
      <View>
        <View style={[styles.allTransparent]}>
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 10 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {CategoriesData.map((category) => (
              <TouchableOpacity
                key={category._id}
                style={[
                  styles.buttonStore,
                  activeTab === category._id && styles.storeToggle,
                ]}
                onPress={() => handleMenuClick(category._id)}
              >
                <Text
                  style={[
                    styles.text,
                    activeTab === category._id && styles.storeToggle,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
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
        {CategoriesData.map((category) => (
          <View
            key={category._id}
            style={{ display: activeTab === category._id ? "flex" : "none" }}
          >
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 15 }}
              vertical
              showsVerticalScrollIndicator={false}
            >
              {filteredStores.length > 0 ? (
                filteredStores.map((store) => (
                  <StoreCard
                    key={store._id}
                    title={store.store.storeName}
                    sousTitle={`${store.store.wilaya}, ${store.store.commune}`}
                    onPress={() =>
                      navigation.navigate("Store/index", {
                        storeId: store.store._id,
                      })
                    }
                  />
                ))
              ) : (
                <Text style={styles.noStoresText}>
                  Aucun magasin disponible pour cette catégorie.
                </Text>
              )}
            </ScrollView>
          </View>
        ))}
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

export default Store;
