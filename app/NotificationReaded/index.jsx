import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
    return "Today";
  } else if (dateObj.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return dateObj.toLocaleDateString(undefined, options);
  }
};

// Function to format the time
const formatTime = (date) => {
  const options = { hour: "2-digit", minute: "2-digit" };
  return new Date(date).toLocaleTimeString(undefined, options);
};

// Component to render each notification item
const NotificationItem = React.memo(({ item }) => (
  <TouchableOpacity>
    <View style={styles.notificationItem}>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
    </View>
  </TouchableOpacity>
));

// Component to render section headers (date)
const SectionHeader = React.memo(({ title }) => (
  <Text style={styles.dateText}>{title}</Text>
));

const NotificationScreen = () => {
  const { user } = useAuthContext();

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
      <SafeAreaView className="bg-white pt-3 pb-12 relative h-full">
        <View className="mx-5" style={styles.containerLoading}>
          <View style={styles.containerLoadingtextScreen}>
            <ShimmerPlaceholder style={styles.textScreen} />
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
          Error loading notifications: {ReadedNotificationDataError.message}
        </Text>
      </SafeAreaView>
    );
  }

  // Render the main content
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-white pt-3 pb-10 h-full">
        <View className="mx-5 flex-row items-center justify-between">
          <BackButton />
          <Text className="text-center" style={styles.titleScreen}>
            Archive notifications
          </Text>
          <View style={styles.Vide}></View>
        </View>

        <View className="mx-5">
          <FlatList
            data={sections}
            renderItem={({ item }) => (
              <View>
                <SectionHeader title={item.title} />
                <FlatList
                  data={item.data}
                  renderItem={({ item }) => <NotificationItem item={item} />}
                  keyExtractor={(notification) => notification._id}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
            keyExtractor={(section) => section.title}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={{ marginBottom: 30 }} />}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  dateText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#7C7C7C",
    marginTop: 18,
  },
  message: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    flex: 1,
  },
  time: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    textAlign: "right",
    color: "#7C7C7C",
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  Vide: {
    width: 40,
    height: 40,
  },
  container: {
    flexGrow: 1,
    gap: 8,
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-centre",
  },
  notificationItem: {
    height: "fit-content",
    minHeigh: 80,
    padding: 14,
    marginTop: 12,
    borderWidth: 0.5,
    borderColor: "#C9E4EE",
    borderRadius: 15,
  },
  deleteButton: {
    backgroundColor: "#ff6b6b",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    minHeight: 80, 
    height: "100%", 
    marginTop: 12,
    borderRadius: 15,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#FF033E",
    fontWeight: "bold",
  },
  containerLoadingtextScreen: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    height: 40,
  },
  containerLoading: {
    flexDirection: "column",
    gap: 16,
  },
});

export default NotificationScreen;
