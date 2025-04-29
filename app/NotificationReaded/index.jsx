import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import BackButton from "../../components/BackButton";
import { useAuthContext } from "../hooks/useAuthContext";
import Config from "../config";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import NotificationsLoading from "../loading/NotificationsLoading";

// Axios instance for base URL configuration
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to format the date (today, yesterday, or specific dates)
const formatDate = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const dateObj = new Date(date);
  if (dateObj.toDateString() === today.toDateString()) {
    return "Aujourd'hui";
  } else if (dateObj.toDateString() === yesterday.toDateString()) {
    return "Hier";
  } else {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return dateObj.toLocaleDateString("fr-FR", options);
  }
};

// Function to format the time
const formatTime = (date) => {
  const options = { hour: "2-digit", minute: "2-digit" };
  return new Date(date).toLocaleTimeString("fr-FR", options);
};

// Component to render each notification item with responsive design
const NotificationItem = React.memo(
  ({ item, isSmallScreen, isLargeScreen }) => (
    <TouchableOpacity>
      <View
        style={[
          styles.notificationItem,
          {
            padding: isSmallScreen ? 12 : 14,
            marginTop: isSmallScreen ? 8 : 12,
            borderRadius: isSmallScreen ? 12 : 15,
          },
        ]}
      >
        <Text
          style={[
            styles.message,
            { fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12 },
          ]}
        >
          {item.message}
        </Text>
        <Text
          style={[
            styles.time,
            { fontSize: isSmallScreen ? 10 : isLargeScreen ? 13 : 12 },
          ]}
        >
          {formatTime(item.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  )
);

// Component to render section headers (date) with responsive design
const SectionHeader = React.memo(({ title, isSmallScreen, isLargeScreen }) => (
  <Text
    style={[
      styles.dateText,
      {
        fontSize: isSmallScreen ? 12 : isLargeScreen ? 16 : 14,
        marginTop: isSmallScreen ? 14 : 18,
      },
    ]}
  >
    {title}
  </Text>
));

const NotificationScreen = () => {
  const { user } = useAuthContext();

  // Get screen dimensions
  const { width, height } = useWindowDimensions();

  // Calculate responsive values
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Responsive spacing calculations
  const horizontalPadding = width * 0.05;
  const verticalSpacing = height * 0.025;
  const smallSpacing = height * 0.01;

  // --------------------------------------------APIs--------------------------------------------
  // Function to fetch public publicities data
  const fetchReadedNotificationData = async () => {
    try {
      const response = await api.get(
        `/Notification/client/read/${user?.info?.id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      // Check if the response is valid
      if (response.status !== 200) {
        const errorData = await response.data;
        if (errorData.error.statusCode == 404) {
          return []; // Return an empty array for 404 errors
        } else {
          throw new Error("Error receiving readed notification data");
        }
      }

      // Return the data from the response
      return await response.data;
    } catch (error) {
      // Handle if the request fails with status code 401 or 404
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        return []; // Return an empty array for 401 and 404 errors
      }
      throw new Error(error?.message || "Network error");
    }
  };

  const {
    data: ReadedNotificationData,
    error: ReadedNotificationDataError,
    isLoading: ReadedNotificationDataLoading,
    refetch: ReadedNotificationDataRefetch,
  } = useQuery({
    queryKey: ["ReadedNotificationData", user?.token], // Ensure token is part of the query key
    queryFn: fetchReadedNotificationData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    retry: 2,
    retryDelay: 1000,
  });

  // Refetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.token) {
        ReadedNotificationDataRefetch();
      }
      return () => {};
    }, [user?.token])
  );

  // Group notifications by formatted date
  const groupedNotifications = useMemo(() => {
    if (!Array.isArray(ReadedNotificationData)) return {};
    return ReadedNotificationData?.reduce((acc, notification) => {
      const formattedDate = formatDate(notification?.createdAt);
      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push(notification);
      return acc;
    }, {});
  }, [ReadedNotificationData]);

  // Map grouped notifications into a format that FlatList can use
  const sections = useMemo(() => {
    return Object.keys(groupedNotifications).map((date) => ({
      title: date,
      data: groupedNotifications[date],
    }));
  }, [groupedNotifications]);

  // Render loading state
  if (ReadedNotificationDataLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={[styles.container, { marginHorizontal: horizontalPadding }]}
        >
          <View style={styles.containerLoadingtextScreen}>
            <ShimmerPlaceholder
              style={[styles.textScreen, { width: width * 0.6 }]}
            />
          </View>
          <NotificationsLoading />
        </View>
      </SafeAreaView>
    );
  }

  // Render error state
  if (ReadedNotificationDataError) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Erreur lors du chargement des notifications:{" "}
          {ReadedNotificationDataError.message}
        </Text>
      </SafeAreaView>
    );
  }

  // Render the main content
  return (
    <GestureHandlerRootView style={styles.rootView}>
      <SafeAreaView style={styles.safeArea}>
        <View
          style={[
            styles.headerContainer,
            {
              marginHorizontal: horizontalPadding,
              marginBottom: verticalSpacing,
            },
          ]}
        >
          <BackButton />
          <Text
            style={[
              styles.titleScreen,
              {
                fontSize: isSmallScreen ? 18 : isLargeScreen ? 24 : 20,
              },
            ]}
          >
            Notifications archivées
          </Text>
          <View
            style={[
              styles.vide,
              {
                width: isSmallScreen ? 32 : 40,
                height: isSmallScreen ? 32 : 40,
              },
            ]}
          ></View>
        </View>

        <View style={{ marginHorizontal: horizontalPadding,  }}>
          {sections.length > 0 ? (
            <FlatList
              data={sections}
              renderItem={({ item }) => (
                <View>
                  <SectionHeader
                    title={item.title}
                    isSmallScreen={isSmallScreen}
                    isLargeScreen={isLargeScreen}
                  />
                  <FlatList
                    data={item.data}
                    renderItem={({ item }) => (
                      <NotificationItem
                        item={item}
                        isSmallScreen={isSmallScreen}
                        isLargeScreen={isLargeScreen}
                      />
                    )}
                    keyExtractor={(notification) => notification._id}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              )}
              keyExtractor={(section) => section.title}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: Platform.OS === "ios" ? 50 : 30,
              }}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucune notification archivée</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 10 : 3,
    paddingBottom: 10,
    height: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  container: {
    flexDirection: "column",
    gap: 16,
  },
  textScreen: {
    height: 20,
    borderRadius: 4,
  },
  containerLoadingtextScreen: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    height: 40,
  },
  dateText: {
    fontFamily: "Montserrat-Medium",
    color: "#7C7C7C",
  },
  message: {
    fontFamily: "Montserrat-Regular",
    flex: 1,
  },
  time: {
    fontFamily: "Montserrat-Regular",
    textAlign: "right",
    color: "#7C7C7C",
  },
  titleScreen: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  vide: {
    // Dimensions set dynamically
  },
  notificationItem: {
    minHeight: 80,
    borderWidth: 0.5,
    borderColor: "#C9E4EE",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 300,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#FF033E",
    textAlign: "center",
  },
});

export default NotificationScreen;
