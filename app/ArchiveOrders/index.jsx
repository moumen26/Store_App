import { View, StyleSheet, SafeAreaView, Text, TextInput } from "react-native";
import React from "react";
import BackButton from "../../components/BackButton";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";

const ArchiveOrder = () => {
  return (
    <SafeAreaView
      style={styles.Container}
      className="bg-white pt-5 relative h-full"
    >
      <View className="mx-5 mb-[20] flex-row items-center justify-between">
        <BackButton />
        <Text className="text-center" style={styles.titleScreen}>
          My Archive Orders
        </Text>
        <View style={styles.Vide}></View>
      </View>
      <View
        style={styles.searchBar}
        className="flex-row mx-5 items-center space-x-2 mb-[20] rounded-3xl"
      >
        <MagnifyingGlassIcon size={20} color="#26667E" />
        <TextInput
          style={styles.searchBarItem}
          placeholder="Search your order.."
          placeholderTextColor="#888888"
          // value={searchQuery}
          // onChangeText={setSearchQuery}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
  },
  Vide: {
    width: 40,
    height: 40,
  },
  searchBar: {
    height: 50,
    borderColor: "#26667E",
    borderWidth: 1,
    alignItems: "center",
    paddingLeft: 15,
    borderRadius: 30,
    flexDirection: "row",
    gap: 4,
  },
  searchBarItem: {
    color: "black",
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    width: 220,
  },
});

export default ArchiveOrder;
