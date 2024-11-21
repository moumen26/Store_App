import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import CartRowModified from "../../components/CartRowModified";

const Elio = require("../../assets/images/Elio.png");

const EditCartScreen = ({ onClose }) => {
  // const panY = useRef(new Animated.Value(0)).current;

  // const panResponder = useRef(
  //   PanResponder.create({
  //     onStartShouldSetPanResponder: () => true,
  //     onPanResponderMove: Animated.event([null, { dy: panY }], {
  //       useNativeDriver: false,
  //     }),
  //     onPanResponderRelease: (e, gestureState) => {
  //       if (gestureState.dy > 50) {
  //         onClose(); // Close modal if dragged down by more than 50 units
  //       } else {
  //         Animated.spring(panY, {
  //           toValue: 0,
  //           useNativeDriver: false,
  //         }).start();
  //       }
  //     },
  //   })
  // ).current;

  const [items, setItems] = useState([
    {
      id: "1",
      ProductName: "Item 1",
      ProductBrand: "Cevital",
      ProductQuantity: 0,
      ProductPriceTotal: "900",
    },
    {
      id: "2",
      ProductName: "Item 2",
      ProductBrand: "Cevital",
      ProductQuantity: 0,
      ProductPriceTotal: "900",
    },
    {
      id: "3",
      ProductName: "Item 3",
      ProductBrand: "Cevital",
      ProductQuantity: 0,
      ProductPriceTotal: "900",
    },
    {
      id: "4",
      ProductName: "Item 4",
      ProductBrand: "Cevital",
      ProductQuantity: 0,
      ProductPriceTotal: "900",
    },
    {
      id: "5",
      ProductName: "Item 5",
      ProductBrand: "Cevital",
      ProductQuantity: 0,
      ProductPriceTotal: "900",
    },
    {
      id: "6",
      ProductName: "Item 6",
      ProductBrand: "Cevital",
      ProductQuantity: 0,
      ProductPriceTotal: "900",
    },
    {
      id: "7",
      ProductName: "Item 3",
      ProductBrand: "Cevital",
      ProductQuantity: 0,
      ProductPriceTotal: "900",
    },
  ]);

  const handleApplyPress = () => {
    onClose(); // Close modal on Apply button press
  };

  const renderProductItems = () => {
    return items.map((item) => (
      <CartRowModified
        key={item.id}
        id={item.id}
        ProductName={item.ProductName}
        ProductBrand={item.ProductBrand}
        initialQuantity={item.ProductQuantity}
        ProductImage={Elio}
      />
    ));
  };

  return (
    <Animated.View style={styles.modalView}>
      <Text style={styles.titleCategory}>Order Details</Text>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {renderProductItems()}
      </ScrollView>

      <View className="w-full flex-row justify-center mt-[20]">
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleApplyPress}
          // onPress={() => navigation.navigate("")}
        >
          <Text style={styles.loginButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: "#26667E",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 340,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
    marginBottom: 10,
  },
  modalView: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: "90%",
  },
});

export default EditCartScreen;
