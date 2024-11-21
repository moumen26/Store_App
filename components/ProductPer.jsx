import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
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
  id,
  ProductName,
  ProductBrand,
  ProductQuantity,
  ProductImage,
}) => {
  const [activeTab, setActiveTab] = useState("Unit");
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  const dispatch = useDispatch();
  const items = useSelector((state) => selectBasketItemsWithId(state, id));
  console.log("ID:", id);
  console.log(
    "Basket state:",
    useSelector((state) => state.basket)
  );

  const addItemToBasket = () => {
    dispatch(
      addToBasket({
        id,
        ProductName,
        ProductBrand,
        ProductQuantity,
        ProductImage,
      })
    );
  };

  const removeItemFromBasket = () => {
    if (!items.length) return;
    dispatch(removeFromBasket({ id }));
  };

  return (
    <View>
      <View>
        <View className="flex-row items-center space-x-5 mx-5 mb-[40]">
          <View
            className="flex-row items-center space-x-2"
            style={
              activeTab === "Unit" || activeTab === "Box"
                ? styles.activeStyle
                : null
            }
          >
            <TouchableOpacity
              style={[
                styles.checkbox,
                activeTab === "Unit" && styles.checkboxChecked,
              ]}
              onPress={() => handleMenuClick("Unit")}
            >
              {/* {isCheckedUnit && (
              <CheckIcon name="check" size={15} color="white" />
            )} */}
            </TouchableOpacity>
            <Text style={styles.PriceText}>Per unit</Text>
          </View>
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity
              style={[
                styles.checkbox,
                activeTab === "Box" && styles.checkboxChecked,
              ]}
              onPress={() => handleMenuClick("Box")}
            >
              {/* {isCheckedBox && <CheckIcon name="check" size={15} color="white" />} */}
            </TouchableOpacity>
            <Text style={styles.PriceText}>Per Box</Text>
          </View>
        </View>
        <Animated.View
          style={[
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {activeTab === "Unit" && (
            <View className="w-fit flex-col items-center">
              <View className="w-[130] flex-row items-center justify-between">
                <TouchableOpacity
                  style={styles.touchMinus}
                  disabled={!items.length}
                  onPress={removeItemFromBesket}
                >
                  <MinusIcon
                    size={20}
                    color={items.length > 0 ? "#000" : "#888888"}
                  />
                </TouchableOpacity>
                <Text style={styles.textQuantity}>{items.length}</Text>
                <TouchableOpacity
                  style={styles.touchPlus}
                  onPress={addItemToBesket}
                >
                  <PlusIcon size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.SubTotal}>
                <Text style={styles.textSubTotal}>DA 1920.00</Text>
              </View>
            </View>
          )}
          {activeTab === "Box" && (
            <View className="w-fit flex-col items-center">
              <View className="w-[130] flex-row items-center justify-between">
                <TouchableOpacity
                  style={styles.touchMinus}
                  disabled={!items.length}
                  onPress={removeItemFromBesket}
                >
                  <MinusIcon
                    size={20}
                    color={items.length > 0 ? "#000" : "#888888"}
                  />
                </TouchableOpacity>
                <Text style={styles.textQuantity}>{items.length}</Text>
                <TouchableOpacity
                  style={styles.touchPlus}
                  onPress={addItemToBesket}
                >
                  <PlusIcon size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.SubTotal}>
                <Text style={styles.textSubTotal}>DA 1920.00</Text>
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ProductPer;
