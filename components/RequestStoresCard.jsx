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
import ConfirmationModal from "./ConfirmationModal";

const RequestStoresCard = ({ StoresData, CategoriesData }) => {
  const [activeTab, setActiveTab] = useState(CategoriesData[0]?._id || "");
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalSubTitle, setModalSubTitle] = useState("");

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
          data={CategoriesData}
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
                {item.name}
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
          data={filteredStores}
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
