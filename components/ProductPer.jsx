import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  addToBasket,
  removeFromBasket,
  selectBasketItems,
  selectBasketItemsWithId,
} from "../features/CartSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MinusIcon, PlusIcon } from "react-native-heroicons/outline";

const ProductPer = ({
  selling,
  quantity,
  buyingMathode,
  boxItems,
  quantityLimit,
  handleProductOnChange
}) => {
  
  const [activeTab, setActiveTab] = useState(
    buyingMathode == "unity" ? "unity" : "box"
  );
  const [itemQuantity, setItemQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Calculate total price when itemQuantity or activeTab changes
    const quantityPerItem = activeTab === "box" ? boxItems * itemQuantity : itemQuantity;
    const pricePerItem = quantityPerItem * selling;
    setTotalPrice(pricePerItem);
    handleProductOnChange({
      quantity: quantityPerItem,
      price: pricePerItem,
      unityPrice: selling,
      buyingMathode: activeTab,
      boxItems: boxItems,
    });
  }, [itemQuantity, activeTab, selling, boxItems]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleMenuClick = (tab) => {
    setItemQuantity(0);
    setActiveTab(tab);
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab);
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleIncrease = () => {
    if (quantityLimit > 0) {
      if (itemQuantity <= quantityLimit) {
        setItemQuantity(itemQuantity + 1);
      }
    } else if (activeTab === "unity" && itemQuantity < quantity) {
      setItemQuantity(itemQuantity + 1);
    } else if (activeTab === "box" && itemQuantity < quantity / boxItems) {
      setItemQuantity(itemQuantity + 1);
    }
  };

  const handleDecrease = () => {
    if (itemQuantity > 0) {
      setItemQuantity(itemQuantity - 1);
    }
  };


  return (
    <View style={styles.ProductDetail}>
      <View>
        <View
          style={styles.boxUnit}
          className="flex-row items-center space-x-5 mx-5 mb-[10]"
        >
          {(buyingMathode == "unity" || buyingMathode == "both") && (
            <View
              className="flex-row items-center space-x-2"
              style={[
                styles.boxUnitText,
                (activeTab === "unity" || activeTab === "box") &&
                  styles.activeStyle,
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  activeTab === "unity" && styles.checkboxChecked,
                ]}
                onPress={() => handleMenuClick("unity")}
              >
                {/* {isCheckedUnit && (
                <CheckIcon name="check" size={15} color="white" />
              )} */}
              </TouchableOpacity>
              <Text style={styles.PriceText}>Per unit</Text>
            </View>
          )}
          {(buyingMathode == "box" || buyingMathode == "both") && (
            <View
              style={styles.boxUnitText}
              className="flex-row items-center space-x-2"
            >
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  activeTab === "box" && styles.checkboxChecked,
                ]}
                onPress={() => handleMenuClick("box")}
              >
                {/* {isCheckedBox && <CheckIcon name="check" size={15} color="white" />} */}
              </TouchableOpacity>
              <Text style={styles.PriceText}>Per box</Text>
            </View>
          )}
        </View>
        <Animated.View
          style={[
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.boxUnitContainer} className="w-fit items-center">
            {quantity > 0 ?
              <View style={styles.minusPlus}>
                <TouchableOpacity
                  style={styles.touchMinus}
                  onPress={handleDecrease}
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
              :
              <Text style={styles.OutOfStock}>
                Out of stock
              </Text>
            }
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
};

const styles = StyleSheet.create({
  ProductDetail: {
    height: Dimensions.get("screen").height * 0.21,
    flexDirection: "column"
  },
  boxUnit: {
    flexDirection: "row",
    gap: 10,
  },
  boxUnitText: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  boxUnitContainer: {
    marginTop: 20,
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
  ProductNameText: {
    fontSize: 15,
    fontFamily: "Montserrat-SemiBold",
  },
  PriceText: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    color: "#888888",
  },
  BoxText: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    color: "#3E9CB9",
  },
  image: {
    width: 150,
    height: 200,
    resizeMode: "contain",
  },
  boxIcon: {
    width: 15,
    height: 15,
    resizeMode: "contain",
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
