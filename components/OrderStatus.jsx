import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import {
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "react-native-heroicons/outline";
import StepIndicator from "react-native-step-indicator";
import { orderStatusTextDisplayer } from "../app/util/useFullFunctions";

const OrderScreen = ({ type, status }) => {
  const specialStatuses = ["-2", "-1", "4"];
  const isSpecialStatus = specialStatuses.includes(status?.toString());

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
    { title: "Commande passée" },
    { title: "Préparation de votre commande" },
    { title: "Commande en route vers l'adresse" },
    { title: "Livrée" },
    { title: "Entièrement payée" },
  ];

  const pickupSteps = [
    { title: "Commande passée" },
    { title: "Préparation de votre commande" },
    { title: "Prêt pour le retrait" },
    { title: "Retirée" },
    { title: "Entièrement payée" },
  ];

  const steps = type === "pickup" ? pickupSteps : deliverySteps;

  const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 3,
    currentStepStrokeWidth: 2,
    stepStrokeCurrentColor: "#19213D",
    separatorFinishedColor: "#19213D",
    separatorUnFinishedColor: "#C9E4EE",
    stepIndicatorFinishedColor: "#19213D",
    stepIndicatorUnFinishedColor: "#C9E4EE",
    stepIndicatorCurrentColor: "#ffffff",
    stepIndicatorLabelFontSize: 15,
    currentStepIndicatorLabelFontSize: 15,
    stepIndicatorLabelCurrentColor: "#000000",
    stepIndicatorLabelFinishedColor: "#ffffff",
    stepIndicatorLabelUnFinishedColor: "rgba(255,255,255,255)",
    labelColor: "#000",
    labelSize: 15,
    currentStepLabelColor: "#19213D",
  };

  const renderStepIndicator = ({ position, stepStatus }) => {
    let iconColor;
    if (stepStatus === "finished") {
      iconColor = "#FFFFFF";
    } else if (stepStatus === "current") {
      iconColor = "#19213D";
    } else {
      iconColor = "#19213D";
      return <XMarkIcon size={18} color={iconColor} />;
    }

    return <CheckIcon size={18} color={iconColor} />;
  };

  const renderPage = ({ item }) => (
    <View style={styles.rowItem}>
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  const getSpecialStatusConfig = (status) => {
    switch (status?.toString()) {
      case "-2":
        return {
          icon: XMarkIcon,
          iconColor: "#FFFFFF",
          backgroundColor: "#FF4444",
          textColor: "#FF4444",
        };
      case "-1":
        return {
          icon: XMarkIcon,
          iconColor: "#FFFFFF",
          backgroundColor: "#FF8C00",
          textColor: "#FF8C00",
        };
      case "4":
        return {
          icon: ArrowPathIcon,
          iconColor: "#FFFFFF",
          backgroundColor: "#6B46C1",
          textColor: "#6B46C1",
        };
      default:
        return {
          icon: XMarkIcon,
          iconColor: "#FFFFFF",
          backgroundColor: "#888888",
          textColor: "#888888",
        };
    }
  };

  const renderSpecialStatusDesign = () => {
    const config = getSpecialStatusConfig(status);
    const IconComponent = config.icon;
    const statusText = orderStatusTextDisplayer(status, type);

    return (
      <View style={styles.container}>
        <View style={styles.specialStepIndicator}>
          {/* Main status indicator circle - matching the step indicator style */}
          <View
            style={[
              styles.specialStatusCircle,
              {
                backgroundColor: config.backgroundColor,
              },
            ]}
          >
            <IconComponent size={20} color={config.iconColor} strokeWidth={2} />
          </View>

          {/* Vertical line extending down - matching separator style */}
          <View
            style={[
              styles.specialStatusLine,
              {
                backgroundColor: config.backgroundColor,
              },
            ]}
          />
        </View>

        <View style={styles.specialContentContainer}>
          {/* Main status text */}
          <View style={styles.specialRowItem}>
            <Text style={[styles.specialTitle, { color: config.textColor }]}>
              {statusText}
            </Text>

            {/* Additional info based on status */}
            <Text style={styles.specialDescription}>
              {status?.toString() === "-2" &&
                "Le magasin a annulé votre commande."}
              {status?.toString() === "-1" &&
                "Vous avez annulé cette commande. Le remboursement sera traité automatiquement."}
              {status?.toString() === "4" &&
                "Votre commande a été retournée et sera traitée par notre équipe."}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (isSpecialStatus) {
    return renderSpecialStatusDesign();
  }

  // Regular StepIndicator for normal statuses
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
  // Special status styles - matching the step indicator layout
  specialStepIndicator: {
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    paddingTop: 26,
    alignItems: "center",
  },
  specialStatusCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },

  specialContentContainer: {
    flex: 1,
  },
  specialRowItem: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingVertical: 26,
  },
  specialTitle: {
    fontSize: 13,
    fontFamily: "Montserrat-Medium",
    paddingBottom: 8,
    fontWeight: "600",
  },
  specialDescription: {
    fontSize: 11,
    fontFamily: "Montserrat-Medium",
    color: "#888888",
    paddingBottom: 4,
    lineHeight: 16,
  },
});

export default OrderScreen;
