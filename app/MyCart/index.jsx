import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import { PencilSquareIcon } from "react-native-heroicons/outline";
import CartRow from "../../components/CartRow";
import CommandeDetailsItem from "../../components/CommandeDetailsItem";
import OrderType from "../../components/OrderType";
import { useNavigation, useRoute } from "@react-navigation/native";
import EditCartScreen from "../screens/EditCartScreen";
import useAuthContext from "../hooks/useAuthContext";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const MyCartScreen = () => {
  const { cart } = useAuthContext();
  const route = useRoute();
  const { storeId } = route.params;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  // Filter cart items for the current store
  const storeCart = cart?.filter((item) => item.store == storeId) || [];

  const renderProductItems = () => {
    return storeCart?.map((item, index) => (
      <CartRow
        key={item?.stock}
        ProductName={item?.product?.name}
        ProductBrand={item?.product?.brand}
        ProductQuantity={item?.quantity}
        ProductImage={item?.product?.image}
        BoxItems={item?.product?.boxItems}
      />
    ));
  };

  const renderDetailsItems = () => {
    return storeCart?.map((item, index) => (
      <CommandeDetailsItem
        key={item?.stock}
        ProductName={item?.product?.name}
        ProductPriceTotal={item?.price}
      />
    ));
  };

  const calculateSubTotal = () => {
    return (
      storeCart
        ?.reduce((total, item) => total + parseFloat(item?.price || 0), 0)
        .toFixed(2) || parseFloat(0).toFixed(2)
    );
  };

  return (
    <SafeAreaView className="bg-white pt-5 relative h-full">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 0,
          paddingTop: 10,
          paddingBottom: 95,
        }}
        vertical
        showsHorizontalScrollIndicator={false}
      >
        <View className="mx-5 mb-[20] flex-row items-center justify-between">
          <BackButton />
          <Text className="text-center" style={styles.titleScreen}>
            My Cart
          </Text>
          <View style={styles.Vide}></View>
        </View>
        <View className="mx-5 flex-row justify-between items-center">
          <Text style={styles.titleCategory}>Order Details</Text>
          {storeCart?.length > 0 && (
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <PencilSquareIcon size={24} color="#26667E" />
            </TouchableOpacity>
          )}
        </View>
        <View className="mt-[12]" style={styles.container}>
          <ScrollView className="mx-5" showsVerticalScrollIndicator={false}>
            {storeCart?.length > 0 ? (
              renderProductItems()
            ) : (
              <View style={styles.containerNoAvailable}>
                <Text style={styles.noText}>No product is available</Text>
              </View>
            )}
          </ScrollView>
        </View>
        {storeCart?.length > 0 ? (
          <View
            className="h-fit max-h-[23%] mx-5 mt-[12] pr-2 pl-2 pt-[12] pb-[12] flex-col space-y-2"
            style={styles.commandeContainer}
          >
            <Text style={styles.sousTitre}>Default Price</Text>
            <View style={styles.defaultPriceScroll}>
              {renderDetailsItems()}
            </View>
            <View
              style={styles.subTotalContainer}
              className="flex-row items-center justify-between w-full pt-[12]"
            >
              <Text style={styles.sousTitre}>Sub total</Text>
              <Text style={styles.sousTitre}>DA {calculateSubTotal()}</Text>
            </View>
          </View>
        ) : (
          <></>
        )}
        <View className="mx-5 flex-col mt-[12]">
          <Text className="mb-[12]" style={styles.titleCategory}>
            Order Type
          </Text>
          <OrderType navigation={navigation} />
        </View>
      </ScrollView>
      <View
        className="bg-white w-full h-[80px] absolute left-0 bottom-0 flex-row items-center justify-around pb-3"
        style={styles.navigationClass}
      >
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("E-Receipt/index")}
        >
          <Text style={styles.loginButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <EditCartScreen
            data={storeCart}
            storeId={storeId}
            onClose={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  defaultPriceScroll: {
    gap: 2,
  },
  noText: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
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
  navigationClass: {
    borderColor: "#888888",
    borderWidth: 0.5,
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  commandeContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F7F7F7",
    gap: 3,
  },
  subTotalContainer: {
    borderTopWidth: 1,
    borderColor: "#F7F7F7",
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
  sousTitre: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  Vide: {
    width: 40,
    height: 40,
  },
  container: {
    flexGrow: 1,
    flexDirection: "column",
    minHeight: hp(32),
    height: "fit-content",
  },
  containerNoAvailable: {
    height: hp(45),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-centre",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(201, 228, 238, 0.4)",
  },
});

export default MyCartScreen;
