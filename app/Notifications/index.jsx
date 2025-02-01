import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Swipeable } from "react-native-gesture-handler";
import BackButton from "../../components/BackButton";
import { TrashIcon } from "react-native-heroicons/outline";
import ConfirmationModal from "../../components/ConfirmationModal";

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

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [
    confirmationNotificationModalVisible,
    setConfirmationNotificationModalVisible,
  ] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  // Simulate fetching data from the database
  useEffect(() => {
    const fetchNotifications = async () => {
      // Simulate some notifications from your database
      const data = [
        {
          id: "1",
          message:
            "Your request to access [Store Name] has been approved. You can now browse their store.",
          date: "2025-02-01T14:30:00Z",
        },
        {
          id: "2",
          message:
            "Your request to access [Store Name] has been approved. You can now browse their store.",
          date: "2025-01-31T09:00:00Z",
        },
        {
          id: "3",
          message:
            "Your request to access [Store Name] has been approved. You can now browse their store.",
          date: "2025-01-30T16:45:00Z",
        },
        {
          id: "4",
          message:
            "Your request to access [Store Name] has been approved. You can now browse their store.",
          date: "2025-01-31T11:20:00Z",
        },
        {
          id: "5",
          message:
            "Your request to access [Store Name] has been approved. You can now browse their store.",
          date: "2025-02-01T10:10:00Z",
        },
      ];
      setNotifications(data);
    };

    fetchNotifications();
  }, []);

  // Group notifications by formatted date
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const formattedDate = formatDate(notification.date);
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(notification);
    return acc;
  }, {});

  // Map grouped notifications into a format that FlatList can use
  const sections = Object.keys(groupedNotifications).map((date) => ({
    title: date,
    data: groupedNotifications[date],
  }));

  // Render each notification group
  const renderItem = ({ item }) => {
    // Function to render swipeable component
    const renderRightActions = () => {
      return (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => openConfirmationModal(item)}
        >
          <TrashIcon size={24} color="white" />
        </TouchableOpacity>
      );
    };

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableOpacity
          onPress={() => console.log(`Marked as read: ${item.id}`)}
        >
          <View style={styles.notificationItem}>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{formatTime(item.date)}</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  // Function to open the confirmation modal and set the notification to be deleted
  const openConfirmationModal = (item) => {
    setNotificationToDelete(item);
    setConfirmationNotificationModalVisible(true);
  };

  // Close the confirmation modal
  const closeConfirmationModal = () => {
    setConfirmationNotificationModalVisible(false);
    setNotificationToDelete(null);
  };

  // Handle the actual deletion of the notification
  const handleDeleteNotification = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification.id !== notificationToDelete.id
      )
    );
    closeConfirmationModal();
  };

  // Render the section headers (date)
  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.dateText}>{title}</Text>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-white pt-3 pb-10 h-full">
        <View className="mx-5 flex-row items-center justify-between">
          <BackButton />
          <Text className="text-center" style={styles.titleScreen}>
            Notifications
          </Text>
          <View style={styles.Vide}></View>
        </View>

        <View className="mx-5">
          <FlatList
            data={sections}
            renderItem={({ item }) => (
              <View>
                {renderSectionHeader({ section: item })}
                <FlatList
                  data={item.data}
                  renderItem={renderItem}
                  keyExtractor={(notification) => notification.id}
                  scrollEnabled={false}
                />
              </View>
            )}
            keyExtractor={(section) => section.title}
            ListFooterComponent={<View style={{ marginBottom: 30 }} />}
          />
        </View>
      </SafeAreaView>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={confirmationNotificationModalVisible}
        onCancel={closeConfirmationModal}
        onConfirm={handleDeleteNotification}
        modalTitle="Delete Notification"
        modalSubTitle="Are you sure you want to delete this notification?"
      />
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
});

export default NotificationScreen;
