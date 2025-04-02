import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  memo,
  useEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MinusIcon, PlusIcon } from "react-native-heroicons/outline";

const ProductPer = memo(
  ({
    selling,
    quantity,
    buyingMathode,
    boxItems,
    quantityLimit,
    handleProductOnChange,
  }) => {
    const [activeTab, setActiveTab] = useState(
      buyingMathode === "unity" ? "unity" : "box"
    );
    const [itemQuantity, setItemQuantity] = useState(0);

    const opacityAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Derived values
    const quantityPerItem = useMemo(
      () => (activeTab === "box" ? boxItems * itemQuantity : itemQuantity),
      [activeTab, boxItems, itemQuantity]
    );
    const totalPrice = useMemo(
      () => quantityPerItem * selling,
      [quantityPerItem, selling]
    );

    // Handle product change
    const handleProductChange = useCallback(() => {
      handleProductOnChange({
        quantity: quantityPerItem,
        price: totalPrice,
        unityPrice: selling,
        buyingMathode: activeTab,
        boxItems: boxItems,
      });
    }, [
      quantityPerItem,
      totalPrice,
      selling,
      activeTab,
      boxItems,
      handleProductOnChange,
    ]);

    // Trigger handleProductChange when relevant values change
    useEffect(() => {
      handleProductChange();
    }, [handleProductChange]);

    // Animation logic
    const animateTabChange = useCallback(() => {
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }, [opacityAnim]);

    const handleMenuClick = useCallback(
      (tab) => {
        setItemQuantity(0);
        setActiveTab(tab);
        animateTabChange();
      },
      [animateTabChange]
    );

    const handleIncrease = useCallback(() => {
      const maxQuantity =
        activeTab === "unity" ? quantity : quantity / boxItems;
      if (itemQuantity < (quantityLimit > 0 ? quantityLimit : maxQuantity)) {
        setItemQuantity((prev) => prev + 1);
      }
    }, [activeTab, quantity, boxItems, quantityLimit, itemQuantity]);

    const handleDecrease = useCallback(() => {
      if (itemQuantity > 0) {
        setItemQuantity((prev) => prev - 1);
      }
    }, [itemQuantity]);

    return (
      <View style={styles.ProductDetail}>
        <View>
          <View style={styles.boxUnit}>
            {(buyingMathode === "unity" || buyingMathode === "both") && (
              <TouchableOpacity
                style={styles.boxUnitText}
                onPress={() => handleMenuClick("unity")}
              >
                <View
                  style={[
                    styles.checkbox,
                    activeTab === "unity" && styles.checkboxChecked,
                  ]}
                />
                <Text style={styles.PriceText}>Par unité</Text>
              </TouchableOpacity>
            )}
            {(buyingMathode === "box" || buyingMathode === "both") && (
              <TouchableOpacity
                style={styles.boxUnitText}
                onPress={() => handleMenuClick("box")}
              >
                <View
                  style={[
                    styles.checkbox,
                    activeTab === "box" && styles.checkboxChecked,
                  ]}
                />
                <Text style={styles.PriceText}>Par boîte</Text>
              </TouchableOpacity>
            )}
          </View>
          <Animated.View
            style={{ opacity: opacityAnim, transform: [{ scale: scaleAnim }] }}
          >
            <View style={styles.boxUnitContainer}>
              {quantity > 0 ? (
                <View style={styles.minusPlus}>
                  <TouchableOpacity
                    style={styles.touchMinus}
                    onPress={handleDecrease}
                    disabled={itemQuantity === 0}
                  >
                    <MinusIcon
                      size={20}
                      color={itemQuantity > 0 ? "#3E9CB9" : "#888888"}
                    />
                  </TouchableOpacity>
                  <Text style={styles.textQuantity}>{itemQuantity}</Text>
                  <TouchableOpacity
                    style={styles.touchPlus}
                    onPress={handleIncrease}
                  >
                    <PlusIcon size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.OutOfStock}>Out of stock</Text>
              )}
              <View style={styles.SubTotal}>
                <Text style={styles.textSubTotal}>
                  DA {totalPrice.toFixed(2)}
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  ProductDetail: {
    height: Dimensions.get("screen").height * 0.21,
    flexDirection: "column",
  },
  boxUnit: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  boxUnitText: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  boxUnitContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  minusPlus: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  textSubTotal: {
    color: "#3E9CB9",
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  SubTotal: {
    width: 130,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#fff",
    borderColor: "#C9E4EE",
    borderWidth: 0.5,
    marginTop: 30,
  },
  textQuantity: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
  },
  touchPlus: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: "#3E9CB9",
    alignItems: "center",
    justifyContent: "center",
  },
  touchMinus: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
  },
  PriceText: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    color: "#888888",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 0.5,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#26667E",
    borderWidth: 0,
  },
  OutOfStock: {
    color: "#EF0107",
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
  },
});

export default ProductPer;
