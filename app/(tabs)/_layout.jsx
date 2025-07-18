import React from "react";
import { Tabs } from "expo-router";
import {
  Cog8ToothIcon,
  HeartIcon,
  HomeIcon,
  ShoppingCartIcon,
  BuildingStorefrontIcon,
} from "react-native-heroicons/solid";
import ProtectedScreen from "../util/ProtectedScreen";

const TabLayout = () => {
  return (
    <ProtectedScreen>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#19213D",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "white",
            borderWidth: 1,
            borderTopColor: "#E3EFFF",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            position: "absolute",
            overflow: "hidden",
            height: 70,
            zIndex: 1000,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Accueil",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <HomeIcon name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="stores"
          options={{
            title: "Magasins",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <BuildingStorefrontIcon name="stores" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: "Enregistré",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <HeartIcon name="saved" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Commandes",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <ShoppingCartIcon name="orders" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Paramètres",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Cog8ToothIcon name="settings" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedScreen>
  );
};

export default TabLayout;
