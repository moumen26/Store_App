import React from "react";
import { Tabs } from "expo-router";
import { Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Cog8ToothIcon,
  HeartIcon,
  HomeIcon,
  ShoppingCartIcon,
  BuildingStorefrontIcon,
} from "react-native-heroicons/solid";
import ProtectedScreen from "../util/ProtectedScreen";

const AnimatedTabIcon = ({ Icon, focused, color, name, size = 24 }) => {
  const scaleValue = React.useRef(
    new Animated.Value(focused ? 1.2 : 1)
  ).current;
  const opacityValue = React.useRef(
    new Animated.Value(focused ? 1 : 0.7)
  ).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: focused ? 1.2 : 1,
        useNativeDriver: true,
        tension: 100,
        friction: 7,
      }),
      Animated.timing(opacityValue, {
        toValue: focused ? 1 : 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleValue }],
        opacity: opacityValue,
      }}
    >
      <Icon name={name} size={size} color={color} />
    </Animated.View>
  );
};

const TabLayout = () => {
  const insets = useSafeAreaInsets();

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
            paddingTop: 4,
            paddingBottom: insets.bottom || 3,
            position: "absolute",
            overflow: "hidden",
            height: 45 + (insets.bottom || 0),
            zIndex: 1000,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Accueil",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon
                Icon={HomeIcon}
                focused={focused}
                color={color}
                name="home"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="stores"
          options={{
            title: "Magasins",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon
                Icon={BuildingStorefrontIcon}
                focused={focused}
                color={color}
                name="stores"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: "Enregistré",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon
                Icon={HeartIcon}
                focused={focused}
                color={color}
                name="saved"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Commandes",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon
                Icon={ShoppingCartIcon}
                focused={focused}
                color={color}
                name="orders"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Paramètres",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon
                Icon={Cog8ToothIcon}
                focused={focused}
                color={color}
                name="settings"
              />
            ),
          }}
        />
      </Tabs>
    </ProtectedScreen>
  );
};

export default TabLayout;
