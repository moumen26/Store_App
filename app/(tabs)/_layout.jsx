import React from "react";
import { Tabs } from "expo-router";
import {
  Cog8ToothIcon,
  HeartIcon,
  HomeIcon,
  ShoppingCartIcon,
} from "react-native-heroicons/solid";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#26667E",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "white",
          borderWidth: 1,
          borderTopColor: "#888888",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: "absolute",
          overflow: "hidden",
          height: 80,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <HomeIcon name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <HeartIcon name="saved" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <ShoppingCartIcon name="cart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Cog8ToothIcon name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
