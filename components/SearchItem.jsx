import { TextInput, View } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";

const SearchItem = ({ placeholder }) => {
  return (
    <View style={styles.searchBar} className="flex-row items-center space-x-2">
      <MagnifyingGlassIcon size={20} color="#26667E" />
      <TextInput
        style={styles.searchBarItem}
        placeholder="Search your store.."
        placeholderTextColor="#888888"
        // value={searchQuery}
        // onChangeText={setSearchQuery}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    width: 300,
    height: 40,
    borderRadius: 20,
    borderColor: "#26667E",
    borderWidth: 1,
    alignItems: "center",
    paddingLeft: 15,
    flexDirection: "row",
    gap: 4,
  },
  searchBarItem: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    width: 220,
    color: "black",
  },
});

export default SearchItem;
