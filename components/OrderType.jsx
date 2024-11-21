import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  BuildingStorefrontIcon,
  ClockIcon,
} from "react-native-heroicons/outline";

const LocationIcon = require("../assets/icons/Location.png");

const OrderType = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Delivery");
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

  const handleMenuClick = (tab) => {
    setActiveTab(tab);
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab);
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

  const handleChangePress = () => {
    navigation.navigate("ShippingAddress/index");
  };

  return (
    <View>
      <View>
        <View
          className="flex-row justify-around pb-[12]"
          style={[
            (activeTab === "Delivery" || activeTab === "Pickup") &&
              styles.orderTypeButtonContainer,
          ]}
        >
          <TouchableOpacity
            style={[
              styles.buttonOrderType,
              activeTab === "Delivery" && styles.orderTypeToggle,
            ]}
            onPress={() => handleMenuClick("Delivery")}
          >
            <Text
              style={[
                styles.text,
                activeTab === "Delivery" && styles.orderTypeToggleText,
              ]}
            >
              Delivery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonOrderType,
              activeTab === "Pickup" && styles.orderTypeToggle,
            ]}
            onPress={() => handleMenuClick("Pickup")}
          >
            <Text
              style={[
                styles.text,
                activeTab === "Pickup" && styles.orderTypeToggleText,
              ]}
            >
              Pickup
            </Text>
          </TouchableOpacity>
        </View>
        <Animated.View
          style={[
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {activeTab === "Delivery" && (
            <View className="pt-[12]">
              <Text style={styles.titleCategory}>Delivery Address</Text>
              <View className="flex-row justify-between items-center mt-[12]">
                <View style={styles.gapRow}>
                  <View style={styles.iconClass}>
                    <Image source={LocationIcon} />
                  </View>
                  <View style={styles.gapColumn}>
                    <Text style={styles.textPlace}>
                      {/* {AddressTitle} */}Home
                    </Text>
                    <Text style={styles.textdescription}>
                      {/* {AddressPlace} */}
                      Rue Yousfi Abdelkader, Blida
                    </Text>
                    <View style={styles.timeContainer}>
                      <ClockIcon size={16} color="#888888" />
                      <Text style={styles.textdescription}>
                        {/* {AddressTime} */}
                        25 minutes estimate arrived
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.changeButton}
                  onPress={handleChangePress}
                >
                  <Text style={styles.textChange}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {activeTab === "Pickup" && (
            <View className="pt-[12]">
              <Text style={styles.titleCategory}>Pickup Address</Text>
              <View className="flex-row items-center mt-[12]">
                <View style={styles.gapRow}>
                  <View style={styles.iconClass}>
                    <BuildingStorefrontIcon color="#26667E" size={20} />
                  </View>
                  <View style={styles.gapColumn}>
                    <Text style={styles.textPlace}>
                      {/* {AddressTitle} */}The Daily Grind Hub
                    </Text>
                    <Text style={styles.textdescription}>
                      {/* {AddressPlace} */}
                      Rue Douid Mohamed, Beni Tamou
                    </Text>
                    <View style={styles.timeContainer}>
                      <ClockIcon size={16} color="#888888" />
                      <Text style={styles.textdescription}>
                        {/* {AddressKilometrage} */}
                        1.5 km away from your location
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

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
    color: "#26667E",
  },
  buttonOrderType: {
    width: 160,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#F7F7F7",
    justifyContent: "center",
    alignItems: "center",
  },
  allTransparent: {
    backgroundColor: "transparent",
  },
  orderTypeToggle: {
    backgroundColor: "#26667E",
  },
  orderTypeToggleText: {
    color: "#fff",
  },
  orderTypeButtonContainer: {
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
    color: "#3E9CB9",
  },
});

export default OrderType;
