import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import {
  orderStatusTextDisplayer,
  formatDate,
  formatNumber,
} from "../app/util/useFullFunctions";

// Get screen dimensions
const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

// Helper function to get responsive font size
const getResponsiveFontSize = (baseSize) => {
  const scale = screenWidth / 375; // Base width (iPhone X)
  const newSize = baseSize * scale;

  // Screen size categories
  if (screenWidth <= 360) {
    // Small screens
    return Math.max(newSize * 0.85, baseSize * 0.8);
  } else if (screenWidth <= 414) {
    // Medium screens
    return newSize;
  } else {
    // Large screens
    return Math.min(newSize * 1.1, baseSize * 1.3);
  }
};

// Helper function to get responsive dimensions
const getResponsiveDimension = (baseSize) => {
  const scale = screenWidth / 375;
  const newSize = baseSize * scale;

  if (screenWidth <= 360) {
    // Small screens
    return Math.max(newSize * 0.9, baseSize * 0.85);
  } else if (screenWidth <= 414) {
    // Medium screens
    return newSize;
  } else {
    // Large screens
    return Math.min(newSize * 1.1, baseSize * 1.2);
  }
};

const EReceiptDetails = ({
  OrderStoreName,
  OrderID,
  OrderType,
  OrderDeliveryAddress,
  OrderDate,
  OrderSubTotal,
  OrderDeliveryCharge,
  OrderStatus,
  OrderDiscount,
}) => {
  return (
    <View>
      <View
        style={[
          styles.commandeContainer,
          {
            paddingTop: getResponsiveDimension(10),
            paddingBottom: getResponsiveDimension(10),
            gap: getResponsiveDimension(4),
          },
        ]}
      >
        <View style={styles.rowContainer}>
          <Text style={styles.text}>Magasin</Text>
          <Text style={styles.textDescription}>{OrderStoreName}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.text}>Numéro de commande</Text>
          <Text style={styles.textDescription}>{OrderID}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.text}>Type de commande</Text>
          <Text style={styles.textDescription}>
            {OrderType === "pickup"
              ? "Retrait"
              : OrderType === "delivery"
              ? "Livraison"
              : capitalizeFirstLetters(OrderType)}
          </Text>
        </View>
        {OrderDeliveryAddress && (
          <View style={styles.rowContainer}>
            <Text style={styles.text}>Adresse de livraison</Text>
            <Text style={styles.textDescription}>{OrderDeliveryAddress}</Text>
          </View>
        )}
        <View style={styles.rowContainer}>
          <Text style={styles.text}>Date de commande</Text>
          <Text style={styles.textDescription}>{formatDate(OrderDate)}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.text}>Statut de commande</Text>
          <Text style={styles.textDescription}>
            {orderStatusTextDisplayer(OrderStatus, OrderType)}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.commandeContainer,
          {
            paddingTop: getResponsiveDimension(10),
            paddingBottom: getResponsiveDimension(10),
            gap: getResponsiveDimension(4),
          },
        ]}
      >
        <View style={styles.rowContainer}>
          <Text style={styles.text}>Sous-total</Text>
          <Text style={styles.textDescription}>
            DA {formatNumber(OrderSubTotal)}
          </Text>
        </View>
        {OrderType === "delivery" && (
          <View style={styles.rowContainer}>
            <Text style={styles.text}>Frais de livraison</Text>
            <Text style={styles.textDescription}>
              + DA {formatNumber(OrderDeliveryCharge)}
            </Text>
          </View>
        )}
        {OrderDiscount && OrderDiscount > 0 && (
          <View style={styles.rowContainer}>
            <Text style={styles.text}>Remise</Text>
            <Text style={[styles.textDescription, styles.discountText]}>
              - DA {OrderDiscount}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  text: {
    fontSize: getResponsiveFontSize(11),
    color: "#888888",
    fontFamily: "Montserrat-Regular",
    flex: 1,
  },
  textDescription: {
    fontSize: getResponsiveFontSize(11),
    fontFamily: "Montserrat-Medium",
    textAlign: "right",
    flex: 1,
    maxWidth: screenWidth * 0.5, // Prevent text overflow
  },
  discountText: {
    color: "#22C55E", // Green color for discount
  },
  commandeContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: "column",
    borderColor: "#F7F7F7",
  },
});

export default EReceiptDetails;
