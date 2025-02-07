import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";

const Snackbar = ({
  message,
  duration = 3000,
  position = "bottom",
  snackbarType,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, duration]);

  const backgroundColors = {
    success: "#3E9CB9",
    error: "#dc3545",
    warning: "#ffc107",
  };

  return isVisible ? (
    <View
      style={[
        styles.container,
        position === "top" ? styles.topContainer : styles.bottomContainer,
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
    zIndex: 9999,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  topContainer: {
    top: 15,
  },
  bottomContainer: {
    bottom: 25,
  },
  messageText: {
    fontSize: 15,
    flex: 1,
    fontWeight: "500",
    color: "#fff",
  },
  closeButton: {
    padding: 5,
  },
});

export default Snackbar;
