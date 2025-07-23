import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { CheckIcon, XMarkIcon, ArrowPathIcon } from "react-native-heroicons/outline";
import StepIndicator from "react-native-step-indicator";
import { orderStatusTextDisplayer } from '../app/util/useFullFunctions';

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
          iconColor: "#FF4444",
          backgroundColor: "#FFE6E6",
          borderColor: "#FF4444",
          textColor: "#FF4444",
          gradientColors: ["#FFE6E6", "#FFCCCC"],
        };
      case "-1":
        return {
          icon: XMarkIcon,
          iconColor: "#FF8C00",
          backgroundColor: "#FFF4E6",
          borderColor: "#FF8C00",
          textColor: "#FF8C00",
          gradientColors: ["#FFF4E6", "#FFE6CC"],
        };
      case "4":
        return {
          icon: ArrowPathIcon,
          iconColor: "#6B46C1",
          backgroundColor: "#F3F0FF",
          borderColor: "#6B46C1",
          textColor: "#6B46C1",
          gradientColors: ["#F3F0FF", "#E9E2FF"],
        };
      default:
        return {
          icon: XMarkIcon,
          iconColor: "#888888",
          backgroundColor: "#F5F5F5",
          borderColor: "#888888",
          textColor: "#888888",
          gradientColors: ["#F5F5F5", "#E5E5E5"],
        };
    }
  };

  const renderSpecialStatusDesign = () => {
    const config = getSpecialStatusConfig(status);
    const IconComponent = config.icon;
    const statusText = orderStatusTextDisplayer(status, type);

    return (
      <View style={styles.specialStatusContainer}>
        <View style={[styles.specialStatusCard, { 
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor 
        }]}>
          <View style={[styles.iconContainer, { 
            backgroundColor: config.iconColor + '20',
            borderColor: config.iconColor 
          }]}>
            <IconComponent size={40} color={config.iconColor} strokeWidth={2.5} />
          </View>
          
          <View style={styles.statusTextContainer}>
            <Text style={[styles.specialStatusText, { color: config.textColor }]}>
              {statusText}
            </Text>
            <View style={[styles.statusIndicatorLine, { backgroundColor: config.iconColor }]} />
          </View>
          
          {/* Decorative elements */}
          <View style={[styles.decorativeCircle1, { backgroundColor: config.iconColor + '10' }]} />
          <View style={[styles.decorativeCircle2, { backgroundColor: config.iconColor + '15' }]} />
        </View>
        
        {/* Additional info based on status */}
        <View style={styles.additionalInfoContainer}>
          {status?.toString() === "-2" && (
            <Text style={styles.additionalInfoText}>
              Le magasin a annulé votre commande.
            </Text>
          )}
          {status?.toString() === "-1" && (
            <Text style={styles.additionalInfoText}>
              Vous avez annulé cette commande. Le remboursement sera traité automatiquement.
            </Text>
          )}
          {status?.toString() === "4" && (
            <Text style={styles.additionalInfoText}>
              Votre commande a été retournée et sera traitée par notre équipe.
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (isSpecialStatus) {
    return (
      <View style={styles.container}>
        {renderSpecialStatusDesign()}
      </View>
    );
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
  // Special status styles
  specialStatusContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  specialStatusCard: {
    width: "100%",
    minHeight: 200,
    borderRadius: 20,
    borderWidth: 2,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  statusTextContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  specialStatusText: {
    fontSize: 18,
    fontFamily: "Montserrat-SemiBold",
    textAlign: "center",
    marginBottom: 10,
  },
  statusIndicatorLine: {
    width: 60,
    height: 3,
    borderRadius: 2,
  },
  decorativeCircle1: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: 20,
    left: 20,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  additionalInfoContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  additionalInfoText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default OrderScreen;