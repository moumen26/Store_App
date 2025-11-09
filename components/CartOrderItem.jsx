import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import React, { useRef } from "react";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import {
  orderStatusTextDisplayer,
  formatDate,
  formatNumber,
} from "../app/util/useFullFunctions";
import { useNavigation } from "expo-router";

// Get screen dimensions
const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

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

const CartOrderItem = ({
  OrderStoreName,
  OrderID,
  OrderType,
  OrderDeliveryAddress,
  OrderDate,
  OrderStatus,
  OrderSubTotal,
}) => {
  const navigation = useNavigation();

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  function capitalizeFirstLetters(text) {
    if (!text) return "";
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  // Calculate responsive values
  const containerPadding = getResponsiveDimension(8);
  const itemPadding = getResponsiveDimension(15);
  const borderRadius = getResponsiveDimension(20);
  const iconSize = getResponsiveDimension(11);
  const gap = getResponsiveDimension(6);
  const marginTop = getResponsiveDimension(5);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.92,
        useNativeDriver: true,
        tension: 150,
        friction: 5,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.5,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 150,
        friction: 6,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("E-Receipt/index", { OrderID })}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel="Voir les détails de la commande"
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.cartOrderItem,
          {
            paddingHorizontal: containerPadding,
            paddingVertical: getResponsiveDimension(12),
            borderRadius: borderRadius,
            gap: gap,
            minHeight: getResponsiveDimension(200),
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <View
          style={[
            styles.cartItem,
            {
              paddingHorizontal: itemPadding,
            },
          ]}
        >
          <Text style={styles.text}>Magasin</Text>
          <Text style={styles.textDescription}>{OrderStoreName}</Text>
        </View>

        <View
          style={[
            styles.cartItem,
            {
              paddingHorizontal: itemPadding,
            },
          ]}
        >
          <Text style={styles.text}>Numéro de commande</Text>
          <Text style={styles.textDescription}>
            {truncateText(OrderID, 12)}
          </Text>
        </View>

        <View
          style={[
            styles.cartItem,
            {
              paddingHorizontal: itemPadding,
            },
          ]}
        >
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
          <View
            style={[
              styles.cartItem,
              {
                paddingHorizontal: itemPadding,
              },
            ]}
          >
            <Text style={styles.text}>Adresse de livraison</Text>
            <Text style={styles.textDescription}>{OrderDeliveryAddress}</Text>
          </View>
        )}

        <View
          style={[
            styles.cartItem,
            {
              paddingHorizontal: itemPadding,
            },
          ]}
        >
          <Text style={styles.text}>Date de commande</Text>
          <Text style={styles.textDescription}>{formatDate(OrderDate)}</Text>
        </View>

        <View
          style={[
            styles.cartItem,
            {
              paddingHorizontal: itemPadding,
            },
          ]}
        >
          <Text style={styles.text}>Statut</Text>
          <Text style={styles.textDescription}>
            {orderStatusTextDisplayer(OrderStatus, OrderType)}
          </Text>
        </View>

        <View
          style={[
            styles.cartItem,
            {
              paddingHorizontal: itemPadding,
            },
          ]}
        >
          <Text style={styles.text}>Sous-total</Text>
          <Text style={styles.textDescription}>
            DA {formatNumber(OrderSubTotal)}
          </Text>
        </View>

        <View
          style={[
            styles.cartItemMoreDetails,
            {
              paddingHorizontal: itemPadding,
              marginTop: marginTop,
            },
          ]}
        >
          <View
            style={[
              styles.moreDetailsButton,
              {
                marginTop: getResponsiveDimension(2),
              },
            ]}
          >
            <Text style={styles.text}>Plus de détails</Text>
            <ChevronRightIcon size={iconSize} color="#888888" />
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: getResponsiveFontSize(11),
    color: "#888888",
    fontFamily: "Montserrat-Regular",
  },
  textDescription: {
    fontSize: getResponsiveFontSize(11),
    fontFamily: "Montserrat-Medium",
    maxWidth: screenWidth * 0.5, // Prevent text overflow on small screens
    textAlign: "right",
  },
  cartOrderItem: {
    height: "auto",
    borderColor: "#C9E4EE",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  cartItem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // Better alignment for long text
  },
  cartItemMoreDetails: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  moreDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: getResponsiveDimension(4),
  },
});

export default CartOrderItem;
