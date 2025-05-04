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
import { Swipeable } from "react-native-gesture-handler";
import BackButton from "../../components/BackButton";
import { EyeIcon } from "react-native-heroicons/outline";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useRoute } from "@react-navigation/native";
import Snackbar from "../../components/Snackbar";
import Config from "../config";
import ReadedNotificationButton from "../../components/ReadedNotificationButton";
import { ActivityIndicator } from "react-native-web";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import NotificationsLoading from "../loading/NotificationsLoading";

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
  ({ item, onDelete, isSmallScreen, isLargeScreen }) => {
    const renderRightActions = () => (
      <TouchableOpacity
        style={[
          styles.deleteButton,
          {
            width: isSmallScreen ? 70 : 80,
            borderRadius: isSmallScreen ? 12 : 15,
          },
        ]}
        onPress={() => onDelete(item._id)}
      >
        <EyeIcon
          size={isSmallScreen ? 20 : isLargeScreen ? 28 : 24}
          color="white"
        />
      </TouchableOpacity>
    );

    return (
      <Swipeable renderRightActions={renderRightActions}>
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
              numberOfLines={2}
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
      </Swipeable>
    );
  }
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
  const route = useRoute();
  const {
    user,
    NotificationData,
    NotificationDataLoading,
    NotificationDataRefetch,
  } = route.params;

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

  const [notifications, setNotifications] = useState([]);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [
    confirmationNotificationModalVisible,
    setConfirmationNotificationModalVisible,
  ] = useState(false);

  const [snackbarKey, setSnackbarKey] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [submitionLoading, setSubmitionLoading] = useState(false);

  // Initialize notifications with NotificationData when the component mounts
  useEffect(() => {
    if (NotificationData) {
      setNotifications(NotificationData);
    }
  }, [NotificationData]);

  // Group notifications by formatted date
  const groupedNotifications = useMemo(() => {
    return notifications.reduce((acc, notification) => {
      const formattedDate = formatDate(notification?.createdAt);
      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push(notification);
      return acc;
    }, {});
  }, [notifications]);

  // Map grouped notifications into a format that FlatList can use
  const sections = useMemo(() => {
    return Object.keys(groupedNotifications).map((date) => ({
      title: date,
      data: groupedNotifications[date],
    }));
  }, [groupedNotifications]);

  // Function to open the confirmation modal and set the notification to be deleted
  const openConfirmationModal = (id) => {
    setNotificationToDelete(id);
    setConfirmationNotificationModalVisible(true);
  };

  // Close the confirmation modal
  const closeConfirmationModal = () => {
    setConfirmationNotificationModalVisible(false);
    setNotificationToDelete(null);
  };

  // Handle the actual deletion of the notification
  const handleMarkAsReadNotification = () => {
    if (notificationToDelete) {
      handleSubmitMarkNotificationAsRead(notificationToDelete);
    } else {
      setSubmitionLoading(false);
      setSnackbarType("error");
      setSnackbarMessage(
        "Vous devez sélectionner une notification à marquer comme lue"
      );
      setSnackbarKey((prevKey) => prevKey + 1);
    }
  };

  // Handle marking a notification as read
  const handleSubmitMarkNotificationAsRead = async (val) => {
    setSubmitionLoading(true);
    try {
      const response = await fetch(
        `${Config.API_URL}/Notification/asRead/${val}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      const json = await response.json();
      if (!response.ok) {
        setSubmitionLoading(false);
        setSnackbarType("error");
        setSnackbarMessage(json.message || "Erreur lors de la mise à jour");
        setSnackbarKey((prevKey) => prevKey + 1);
        return;
      } else {
        NotificationDataRefetch();
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification._id !== val)
        );
        setSubmitionLoading(false);
        setSnackbarType("success");
        setSnackbarMessage(json.message || "Notification marquée comme lue");
        setSnackbarKey((prevKey) => prevKey + 1);
        closeConfirmationModal();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitionLoading(false);
      setNotificationToDelete(null);
    }
  };

  // Render loading state
  if (NotificationDataLoading) {
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
            Notifications
          </Text>
          <ReadedNotificationButton />
        </View>

        <View style={{ marginHorizontal: horizontalPadding }}>
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
                        onDelete={openConfirmationModal}
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
              <Text style={styles.emptyText}>Aucune notification</Text>
            </View>
          )}
        </View>
      </SafeAreaView>

      <ConfirmationModal
        visible={confirmationNotificationModalVisible}
        onCancel={closeConfirmationModal}
        onConfirm={handleMarkAsReadNotification}
        modalTitle="Marquer comme lue"
        modalSubTitle="Êtes-vous sûr de vouloir marquer cette notification comme lue ?"
      />
      {snackbarKey !== 0 && (
        <Snackbar
          key={snackbarKey}
          message={snackbarMessage}
          duration={2000}
          snackbarType={snackbarType}
        />
      )}
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
  row: {
    flexDirection: "row",
    justifyContent: "space-centre",
  },
  notificationItem: {
    minHeight: 80,
    borderWidth: 0.5,
    borderColor: "#C9E4EE",
  },
  deleteButton: {
    backgroundColor: "#ff6b6b",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 80,
    marginTop: 12,
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
  loadingText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#FF033E",
    fontWeight: "bold",
  },
});

export default NotificationScreen;
