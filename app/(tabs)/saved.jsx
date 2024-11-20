import { View, Text, ScrollView, StyleSheet, TextInput } from "react-native";
import React from "react";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import SavedStoreItem from "../../components/SavedStoreItem";

const COLUMN_COUNT = 1;
const DATA = [
  {
    id: "1",
    StoreName: "Hichem Alimentation",
  },
  {
    id: "2",
    StoreName: "Hichem Alimentation",
  },
  {
    id: "3",
    StoreName: "Hichem Alimentation",
  },
  {
    id: "4",
    StoreName: "Hichem Alimentation",
  },
  {
    id: "5",
    StoreName: "Hichem Alimentation",
  },
  {
    id: "2",
    StoreName: "Hichem Alimentation",
  },
  {
    id: "2",
    StoreName: "Hichem Alimentation",
  },
  {
    id: "2",
    StoreName: "Hichem Alimentation",
  },
  {
    id: "2",
    StoreName: "Hichem Alimentation",
  },
  {
    id: "2",
    StoreName: "Hichem Alimentation",
  },
  {
    id: "2",
    StoreName: "Hichem Alimentation",
  },
  {
    id: "2",
    StoreName: "Hichem Alimentation",
  },
  {
    id: "2",
    StoreName: "Hichem Alimentation",
  },
  {
    id: "2",
    StoreName: "Hichem Alimentation",
  },
  {
    id: "2",
    StoreName: "Hichem Alimentation",
  },
  {
    id: "2",
    StoreName: "Hichem Alimentation",
  },
];

const saved = () => {
  const renderItems = () => {
    const items = [];

    for (let i = 0; i < DATA.length; i += COLUMN_COUNT) {
      const rowItems = DATA.slice(i, i + COLUMN_COUNT).map((item) => (
        <SavedStoreItem
          key={item.id}
          StoreName={item.StoreName}
          // onPress={}
        />
      ));
      items.push(
        <View className="mb-4" key={i} style={styles.row}>
          {rowItems}
        </View>
      );
    }

    return items;
  };
  return (
    <SafeAreaView className="bg-white pt-5 pb-12 relative h-full">
      <Text className="text-center mb-[20]" style={styles.titleScreen}>
        Stores
      </Text>
      <View
        style={styles.searchBar}
        className="flex-row mx-5 items-center space-x-2 mb-[20]"
      >
        <MagnifyingGlassIcon size={20} color="#26667E" />
        <TextInput
          style={styles.searchBarItem}
          placeholder="Search your store.."
          placeholderTextColor="#888888"
          // value={searchQuery}
          // onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView
        className="mx-5"
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {renderItems()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
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

export default saved;
