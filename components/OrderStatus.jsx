import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { CheckIcon, XMarkIcon } from "react-native-heroicons/outline";
import StepIndicator from "react-native-step-indicator";

const OrderScreen = ({ type, status }) => {
  // Map the status values to the correct step indices
  const statusToStepIndex = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    10: 4,
  };

  const [currentPage, setCurrentPage] = useState(
    statusToStepIndex[Number(status)]
  );
  const deliverySteps = [
    { title: "Order Placed" },
    { title: "Preparing your order" },
    { title: "Order on the way to address" },
    { title: "Delivered" },
    { title: "Fully paid" },
  ];
  const pickupSteps = [
    { title: "Order Placed" },
    { title: "Preparing your order" },
    { title: "Ready for Pickup" },
    { title: "Picked up" },
    { title: "Fully paid" },
  ];

  const steps = type === "pickup" ? pickupSteps : deliverySteps;

  const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 3,
    currentStepStrokeWidth: 2,
    stepStrokeCurrentColor: "#63BBF5",
    separatorFinishedColor: "#63BBF5",
    separatorUnFinishedColor: "#C9E4EE",
    stepIndicatorFinishedColor: "#63BBF5",
    stepIndicatorUnFinishedColor: "#C9E4EE",
    stepIndicatorCurrentColor: "#ffffff",
    stepIndicatorLabelFontSize: 15,
    currentStepIndicatorLabelFontSize: 15,
    stepIndicatorLabelCurrentColor: "#000000",
    stepIndicatorLabelFinishedColor: "#ffffff",
    stepIndicatorLabelUnFinishedColor: "rgba(255,255,255,255)",
    labelColor: "#000",
    labelSize: 15,
    currentStepLabelColor: "#63BBF5",
  };

  const renderStepIndicator = ({ position, stepStatus }) => {
    let iconColor;
    if (stepStatus === "finished") {
      iconColor = "#FFFFFF";
    } else if (stepStatus === "current") {
      iconColor = "#63BBF5";
    } else {
      iconColor = "#63BBF5";
      return <XMarkIcon size={18} color={iconColor} />;
    }

    return <CheckIcon size={18} color={iconColor} />;
  };

  const renderPage = ({ item }) => (
    <View style={styles.rowItem}>
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.stepIndicator}>
        <StepIndicator
          customStyles={customStyles}
          stepCount={steps.length}
          direction="vertical"
          currentPosition={currentPage}
          renderStepIndicator={renderStepIndicator}
        />
      </View>
      <FlatList
        style={{ flexGrow: 1 }}
        data={steps}
        renderItem={renderPage}
        viewabilityConfig={{ itemVisiblePercentThreshold: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#ffffff",
  },
  stepIndicator: {
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  rowItem: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingVertical: 26,
  },
  title: {
    fontSize: 13,
    fontFamily: "Montserrat-Medium",
    paddingBottom: 4,
  },
  date: {
    fontSize: 11,
    fontFamily: "Montserrat-Medium",
    color: "#888888",
    paddingBottom: 4,
  },
});

export default OrderScreen;
