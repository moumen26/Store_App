import React, { useRef, useState, useCallback, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import {
  BuildingStorefrontIcon,
  ClockIcon,
} from "react-native-heroicons/outline";

const LocationIcon = require("../assets/icons/Location.png");

const OrderType = memo(
  ({ storeId, storeCart, navigation, handleChangeType }) => {
    const [activeTab, setActiveTab] = useState("");
    const opacityAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleChangeActiveTab = useCallback(
      (val) => {
        setActiveTab(val);
        handleChangeType(val);
      },
      [handleChangeType]
    );

    const animateTabChange = useCallback(() => {
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }, [opacityAnim]);

    const handleMenuClick = useCallback(
      (tab) => {
        handleChangeActiveTab(tab);
        animateTabChange();
      },
      [handleChangeActiveTab, animateTabChange]
    );

    const handleChangePress = useCallback(() => {
      navigation.navigate("ShippingAddress/index", { storeId });
    }, [navigation, storeId]);

    const renderDeliveryContent = () => (
      <View style={styles.tabContent}>
        <View style={styles.headerRow}>
          <Text style={styles.titleCategory}>Adresse de livraison</Text>
          {!storeCart[0]?.shippingAddress && (
            <TouchableOpacity
              style={styles.changeButton}
              onPress={handleChangePress}
            >
              <Text style={styles.textChange}>Ajouter</Text>
            </TouchableOpacity>
          )}
        </View>
        {storeCart[0]?.shippingAddress && (
          <View style={styles.addressContainer}>
            <View style={styles.gapRow}>
              <View style={styles.iconClass}>
                <Image source={LocationIcon} />
              </View>
              <View style={styles.gapColumn}>
                <Text style={styles.textPlace}>
                  {storeCart[0]?.shippingAddress?.name}
                </Text>
                <Text style={styles.textdescription}>
                  {storeCart[0]?.shippingAddress?.address}
                </Text>
                <View style={styles.timeContainer}>
                  <ClockIcon size={16} color="#888888" />
                  <Text style={styles.textdescription}>
                    25 minutes estimate arrived
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.changeButton}
              onPress={handleChangePress}
            >
              <Text style={styles.textChange}>Modifier</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );

    const renderPickupContent = () => (
      <View style={styles.tabContent}>
        <Text style={styles.titleCategory}>Adresse de retrait</Text>
        <View style={styles.addressContainer}>
          <View style={styles.gapRow}>
            <View style={styles.iconClass}>
              <BuildingStorefrontIcon color="#19213D" size={20} />
            </View>
            <View style={styles.gapColumn}>
              <Text style={styles.textPlace}>The Daily Grind Hub</Text>
              <Text style={styles.textdescription}>
                Rue Douid Mohamed, Beni Tamou
              </Text>
              <View style={styles.timeContainer}>
                <ClockIcon size={16} color="#888888" />
                <Text style={styles.textdescription}>
                  1.5 km away from your location
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );

    return (
      <View>
        <View style={styles.orderTypeButtonContainer}>
          <TouchableOpacity
            style={[
              styles.buttonOrderType,
              activeTab === "delivery" && styles.orderTypeToggle,
            ]}
            onPress={() => handleMenuClick("delivery")}
          >
            <Text
              style={[
                styles.text,
                activeTab === "delivery" && styles.orderTypeToggleText,
              ]}
            >
              Livraison
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonOrderType,
              activeTab === "pickup" && styles.orderTypeToggle,
            ]}
            onPress={() => handleMenuClick("pickup")}
          >
            <Text
              style={[
                styles.text,
                activeTab === "pickup" && styles.orderTypeToggleText,
              ]}
            >
              Retrait
            </Text>
          </TouchableOpacity>
        </View>
        <Animated.View
          style={{ opacity: opacityAnim, transform: [{ scale: scaleAnim }] }}
        >
          {activeTab === "delivery" && renderDeliveryContent()}
          {activeTab === "pickup" && renderPickupContent()}
        </Animated.View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  iconClass: { width: 20 },
  gapRow: {
    flexDirection: "row",
    gap: 4,
  },
  gapColumn: {
    flexDirection: "column",
    gap: 4,
  },
  changeButton: {
    width: 65,
    height: 24,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#C9E4EE",
    justifyContent: "center",
    alignItems: "center",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#19213D",
  },
  buttonOrderType: {
    width: 160,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#F7F7F7",
    justifyContent: "center",
    alignItems: "center",
  },
  orderTypeToggle: {
    backgroundColor: "#19213D",
  },
  orderTypeToggleText: {
    color: "#fff",
  },
  orderTypeButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#F7F7F7",
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
  textPlace: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  textdescription: {
    fontFamily: "Montserrat-Regular",
    fontSize: 11,
    color: "#888888",
  },
  textChange: {
    fontFamily: "Montserrat-Regular",
    fontSize: 11,
    color: "#19213D",
  },
  tabContent: {
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
});

export default OrderType;
