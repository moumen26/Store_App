import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";

const Snackbar = ({
  message,
  duration = 3000,
  position = "bottom", // Default position is bottom
  topOffset = 30, // Default top offset
  bottomOffset = 16, // Default bottom offset
  snackbarType,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const { height } = Dimensions.get("window");

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, duration]);

  const backgroundColors = {
    success: "#19213D",
    error: "#dc3545",
    warning: "#ffc107",
    info: "#19213D", // Added default info color
  };

  return isVisible ? (
    <View
      style={[
        styles.container,
        position === "top"
          ? { top: topOffset } // Use custom top offset
          : { bottom: bottomOffset }, // Use custom bottom offset
        {
          backgroundColor:
            backgroundColors[snackbarType] || backgroundColors.info,
        },
      ]}
    >
      <Text style={styles.messageText}>{message}</Text>
      <TouchableOpacity
        onPress={() => setIsVisible(false)}
        style={styles.closeButton}
      >
        <XMarkIcon size={22} color={"#fff"} />
      </TouchableOpacity>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 999999, // Increased z-index to be higher than tab bar
    elevation: 10, // Increased elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginHorizontal: 5,
  },
  messageText: {
    fontSize: 15,
    flex: 1,
    fontWeight: "500",
    color: "#fff",
    fontFamily: "Montserrat-Medium",
  },
  closeButton: {
    padding: 5,
  },
});

export default Snackbar;
