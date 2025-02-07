import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
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
const NotificationItem = React.memo(({ item, onPress, onDelete }) => {
  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => onDelete(item._id)}
    >
      <EyeIcon size={24} color="white" />
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity onPress={() => onPress(item._id)}>
        <View style={styles.notificationItem}>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
});

// Component to render section headers (date)
const SectionHeader = React.memo(({ title }) => (
  <Text style={styles.dateText}>{title}</Text>
));

const NotificationScreen = () => {
  const route = useRoute();
  const {
    user,
    NotificationData,
    NotificationDataLoading,
    NotificationDataRefetch,
  } = route.params;

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
      setSnackbarMessage("You have to select a notification to mark as read");
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
        setSnackbarMessage(json.message);
        setSnackbarKey((prevKey) => prevKey + 1);
        return;
      } else {
        NotificationDataRefetch();
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification._id !== val)
        );
        setSubmitionLoading(false);
        setSnackbarType("success");
        setSnackbarMessage(json.message);
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

  // Render the main content
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-white pt-3 pb-10 h-full">
        <View className="mx-5 flex-row items-center justify-between">
          <BackButton />
          <Text className="text-center" style={styles.titleScreen}>
            Notifications
          </Text>
          <ReadedNotificationButton />
        </View>

        <View className="mx-5">
          <FlatList
            data={sections}
            renderItem={({ item }) => (
              <View>
                <SectionHeader title={item.title} />
                <FlatList
                  data={item.data}
                  renderItem={({ item }) => (
                    <NotificationItem
                      item={item}
                      onPress={(id) => console.log(`Marked as read: ${id}`)}
                      onDelete={openConfirmationModal}
                    />
                  )}
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

      <ConfirmationModal
        visible={confirmationNotificationModalVisible}
        onCancel={closeConfirmationModal}
        onConfirm={handleMarkAsReadNotification}
        modalTitle="Mark notification as read"
        modalSubTitle="Are you sure you want to mark this notification as read?"
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
    height: 80,
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
    height: 80,
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
