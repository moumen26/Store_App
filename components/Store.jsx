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

const Store = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Alimentation");
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

  return (
    <View>
      <View>
        <View
          style={[
            (activeTab === "Alimentation" ||
              activeTab === "Cosmetique" ||
              activeTab === "Detergent" ||
              activeTab === "Emballage" ||
              activeTab === "Makeup") &&
              styles.allTransparent,
          ]}
        >
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 10 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            className="space-x-1"
            style={styles.scrollViewHorizontal}
          >
            <TouchableOpacity
              style={[
                styles.buttonStore,
                activeTab === "Alimentation" && styles.storeToggle,
              ]}
              onPress={() => handleMenuClick("Alimentation")}
            >
              <Text
                style={[
                  styles.text,
                  activeTab === "Alimentation" && styles.storeToggle,
                ]}
              >
                Alimentation
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.buttonStore,
                activeTab === "Cosmetique" && styles.storeToggle,
              ]}
              onPress={() => handleMenuClick("Cosmetique")}
            >
              <Text
                style={[
                  styles.text,
                  activeTab === "Cosmetique" && styles.storeToggle,
                ]}
              >
                Cosmétique
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.buttonStore,
                activeTab === "Detergent" && styles.storeToggle,
              ]}
              onPress={() => handleMenuClick("Detergent")}
            >
              <Text
                style={[
                  styles.text,
                  activeTab === "Detergent" && styles.storeToggle,
                ]}
              >
                Detergent
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.buttonStore,
                activeTab === "Emballage" && styles.storeToggle,
              ]}
              onPress={() => handleMenuClick("Emballage")}
            >
              <Text
                style={[
                  styles.text,
                  activeTab === "Emballage" && styles.storeToggle,
                ]}
              >
                Emballage
              </Text>
            </TouchableOpacity>
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
        {activeTab === "Alimentation" && (
          <View>
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 15 }}
              vertical
              showsVerticalScrollIndicator={false}
            >
              <StoreCard
                title="Alimentation 1"
                onPress={() => navigation.navigate("HomeAlimentationScreen")}
              />
              <StoreCard
                title="Alimentation 2"
                onPress={() => navigation.navigate("HomeAlimentationScreen")}
              />
              <StoreCard
                title="Alimentation 3"
                onPress={() => navigation.navigate("HomeAlimentationScreen")}
              />
              <StoreCard
                title="Alimentation 4"
                onPress={() => navigation.navigate("HomeAlimentationScreen")}
              />
              <StoreCard
                title="Alimentation 3"
                onPress={() => navigation.navigate("HomeAlimentationScreen")}
              />
              <StoreCard
                title="Alimentation 3"
                onPress={() => navigation.navigate("HomeAlimentationScreen")}
              />
              <StoreCard
                title="Alimentation 3"
                onPress={() => navigation.navigate("HomeAlimentationScreen")}
              />
            </ScrollView>
          </View>
        )}
        {activeTab === "Cosmetique" && (
          <View>
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 15 }}
              vertical
              showsVerticalScrollIndicator={false}
            >
              <StoreCard
                title="Cosmetique 1"
                onPress={() => navigation.navigate("HomeCosmetiqueScreen")}
              />
              <StoreCard
                title="Cosmetique 2"
                onPress={() => navigation.navigate("HomeCosmetiqueScreen")}
              />
              <StoreCard
                title="Cosmetique 3"
                onPress={() => navigation.navigate("HomeCosmetiqueScreen")}
              />
            </ScrollView>
          </View>
        )}

        {activeTab === "Detergent" && (
          <View>
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 15 }}
              vertical
              showsVerticalScrollIndicator={false}
            >
              <StoreCard
                title="Detergent 1"
                onPress={() => navigation.navigate("HomeDetergentScreen")}
              />
              <StoreCard
                title="Detergent 2"
                onPress={() => navigation.navigate("HomeDetergentScreen")}
              />
              <StoreCard
                title="Detergent 3"
                onPress={() => navigation.navigate("HomeDetergentScreen")}
              />
            </ScrollView>
          </View>
        )}

        {activeTab === "Emballage" && (
          <View>
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 15 }}
              vertical
              showsVerticalScrollIndicator={false}
              className="storesClass"
            >
              <StoreCard
                title="Emballage 1"
                onPress={() => navigation.navigate("HomeEmballageScreen")}
              />
              <StoreCard
                title="Emballage 2"
                onPress={() => navigation.navigate("HomeEmballageScreen")}
              />
              <StoreCard
                title="Emballage 3"
                onPress={() => navigation.navigate("HomeEmballageScreen")}
              />
            </ScrollView>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  storesClass: {
    flex: 1,
    backgroundColor: "#F9F9FC",
    paddingTop: 10,
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
