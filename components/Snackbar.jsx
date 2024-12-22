import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";

const Snackbar = ({
  message,
  duration = 3000,
  position = "bottom",
  containerStyle,
  messageStyle,
  backgroundColor,
  textColor,
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

  return isVisible ? (
    <View
      style={[
        styles.container,
        position === "top" ? styles.topContainer : styles.bottomContainer,
        containerStyle,
        { backgroundColor: backgroundColor },
      ]}
      className="mx-5"
    >
      <Text style={[styles.messageText, messageStyle, { color: textColor }]}>
        {message}
      </Text>
      <TouchableOpacity onPress={() => setIsVisible(false)}>
        <XMarkIcon style={styles.closeIcon} />
      </TouchableOpacity>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 99999999,
  },
  topContainer: {
    top: 15,
  },
  bottomContainer: {
    bottom: 25,
  },
  messageText: {
    fontSize: 16,
    width: "90%",
  },
  closeIcon: {
    width: 20,
    height: 20,
    color: "white",
  },
});

export default Snackbar;
