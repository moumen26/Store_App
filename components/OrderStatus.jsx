import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { CheckIcon } from "react-native-heroicons/outline";
import StepIndicator from "react-native-step-indicator";

const OrderScreen = ({ type }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const deliverySteps = [
    { title: "Order Placed", date: "May 09, 2024 | 02:00 PM" },
    { title: "Preparing your order", date: "May 09, 2024 | 03:00 PM" },
    { title: "Order on the way to address", date: "May 09, 2024 | 04:00 PM" },
    { title: "Delivered", date: "May 09, 2024 | 05:00 PM" },
  ];

  const pickupSteps = [
    { title: "Order Placed", date: "May 09, 2024 | 02:00 PM" },
    { title: "Ready for Pickup", date: "May 09, 2024 | 03:00 PM" },
  ];

  const steps = type === "pickup" ? pickupSteps : deliverySteps;

  const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 3,
    currentStepStrokeWidth: 2,
    stepStrokeCurrentColor: "#3E9CB9",
    separatorFinishedColor: "#3E9CB9",
    separatorUnFinishedColor: "#3E9CB9",
    stepIndicatorFinishedColor: "#3E9CB9",
    stepIndicatorUnFinishedColor: "#3E9CB9",
    stepIndicatorCurrentColor: "#ffffff",
    stepIndicatorLabelFontSize: 15,
    currentStepIndicatorLabelFontSize: 15,
    stepIndicatorLabelCurrentColor: "#000000",
    stepIndicatorLabelFinishedColor: "#ffffff",
    stepIndicatorLabelUnFinishedColor: "rgba(255,255,255,255)",
    labelColor: "#000",
    labelSize: 15,
    currentStepLabelColor: "#3E9CB9",
  };

  const renderStepIndicator = ({ position, stepStatus }) => {
    return (
      <CheckIcon
        size={18}
        color={stepStatus === "finished" ? "#FFF" : "#E7F2F7"}
      />
    );
  };

  const renderPage = ({ item }) => (
    <View style={styles.rowItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  const onViewableItemsChanged = ({ viewableItems }) => {
    const visibleItemsCount = viewableItems.length;
    if (visibleItemsCount !== 0) {
      setCurrentPage(viewableItems[visibleItemsCount - 1].index);
    }
  };

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
        onViewableItemsChanged={onViewableItemsChanged}
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
