import React, { memo, useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackButton from "../../components/BackButton";
import ShippingAddressCard from "../../components/ShippingAddressCard";
import useAuthContext from "../hooks/useAuthContext";
import Snackbar from "../../components/Snackbar";

const ShippingAddressScreen = memo(() => {
  const { cart, user, dispatch } = useAuthContext();
  const route = useRoute();
  const { storeId } = route.params;
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [snackbarKey, setSnackbarKey] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Filter cart items for the current store
  const storeCart = useMemo(
    () => cart?.filter((item) => item.store === storeId) || [],
    [cart, storeId]
  );

  const handleSelectItem = useCallback((index) => {
    setSelectedIndex(index);
  }, []);

  const handleApplyPress = useCallback(() => {
    if (!storeCart || storeCart.length === 0) {
      setSnackbarMessage(
        "Please select some products before choosing an address."
      );
      setSnackbarKey((prevKey) => prevKey + 1);
      return;
    }
    if (selectedIndex == null) {
      setSnackbarMessage("Please select an address.");
      setSnackbarKey((prevKey) => prevKey + 1);
      return;
    }

    const selectedAddress = user?.info?.storeAddresses?.find(
      (item) => item._id === selectedIndex
    );
    if (selectedAddress) {
      dispatch({
        type: "ADD_TO_CART_ADDRESS",
        payload: { selectedAddress, storeId },
      });
      setSelectedIndex(null);
      navigation.goBack();
    } else {
      setSnackbarMessage("Selected address not found.");
      setSnackbarKey((prevKey) => prevKey + 1);
    }
  }, [storeCart, selectedIndex, user, dispatch, storeId, navigation]);

  const renderItems = useCallback(
    () =>
      user?.info?.storeAddresses?.map((item, index) => (
        <View key={item?._id} style={styles.row}>
          <ShippingAddressCard
            index={item?._id}
            AddressTitle={item?.name}
            AddressPlace={item?.address}
            AddressTime={`${25} minutes estimate arrived`}
            isSelected={item?._id === selectedIndex}
            onSelect={handleSelectItem}
          />
        </View>
      )),
    [user, selectedIndex, handleSelectItem]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {snackbarKey !== 0 && (
        <Snackbar
          key={snackbarKey}
          message={snackbarMessage}
          duration={2000}
          actionText="Close"
          backgroundColor="#FF0000"
          textColor="white"
          actionTextColor="yellow"
        />
      )}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.titleScreen}>Shipping Address</Text>
        <View style={styles.emptyView} />
      </View>
      <View style={styles.scrollContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderItems()}
        </ScrollView>
      </View>
      <View style={styles.addAddressContainer}>
        <TouchableOpacity style={styles.addAddressButton}>
          <Text style={styles.addAddressText}>+ Add New Shipping Address</Text>
        </TouchableOpacity>
      </View>
      <View
        style={styles.navigationClass}
        className="bg-white w-full h-[80px] absolute left-0 bottom-0 flex-row items-center justify-around pb-3"
      >
        <TouchableOpacity style={styles.applyButton} onPress={handleApplyPress}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  emptyView: {
    width: 40,
    height: 40,
  },
  scrollContainer: {
    marginHorizontal: 20,
    borderTopWidth: 1,
    borderColor: "#F7F7F7",
    paddingTop: 18,
    height: "60%",
  },
  scrollContent: {
    flexGrow: 1,
    gap: 18,
  },
  row: {
    borderBottomWidth: 1,
    borderColor: "#F7F7F7",
    marginBottom: 5,
  },
  addAddressContainer: {
    marginHorizontal: 20,
    marginTop: 40,
  },
  addAddressButton: {
    borderColor: "#888888",
    borderWidth: 0.3,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dotted",
  },
  addAddressText: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "white",
    borderTopWidth: 0.5,
    borderColor: "#888888",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 12,
  },
  applyButton: {
    backgroundColor: "#26667E",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 340,
  },
  applyButtonText: {
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
});

export default ShippingAddressScreen;
