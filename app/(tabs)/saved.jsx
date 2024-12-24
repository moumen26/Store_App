import React from "react";
import { View, Text, FlatList, StyleSheet, TextInput } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import SavedStoreItem from "../../components/SavedStoreItem";
import { useNavigation } from "expo-router";

const DATA = [
  { id: "1", StoreName: "Hichem Alimentation" },
  { id: "2", StoreName: "Hichem Alimentation" },
  { id: "3", StoreName: "Hichem Alimentation" },
  { id: "4", StoreName: "Hichem Alimentation" },
  { id: "5", StoreName: "Hichem Alimentation" },
  { id: "6", StoreName: "Hichem Alimentation" },
  { id: "7", StoreName: "Hichem Alimentation" },
  { id: "8", StoreName: "Hichem Alimentation" },
  { id: "9", StoreName: "Hichem Alimentation" },
  { id: "10", StoreName: "Hichem Alimentation" },
  { id: "11", StoreName: "Hichem Alimentation" },
  { id: "12", StoreName: "Hichem Alimentation" },
  { id: "13", StoreName: "Hichem Alimentation" },
  { id: "14", StoreName: "Hichem Alimentation" },
];

const Saved = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <SavedStoreItem
      key={item.id}
      StoreName={item.StoreName}
      onPress={() => navigation.navigate("MyWishList/index")}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.titleScreen}>Stores</Text>

      <View style={styles.searchBar}>
        <MagnifyingGlassIcon size={20} color="#26667E" />
        <TextInput
          style={styles.searchBarItem}
          placeholder="Search your store.."
          placeholderTextColor="#888888"
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "white",
    paddingTop: 3,
    paddingBottom: 12,
    height: "100%",
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    marginBottom: 20,
  },
  searchBar: {
    height: 50,
    borderColor: "#26667E",
    borderWidth: 1,
    alignItems: "center",
    paddingLeft: 15,
    borderRadius: 30,
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchBarItem: {
    color: "black",
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    width: 220,
  },
  container: {
    flex: 1,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  // listContainer: {
  //   paddingBottom: 50,
  //   paddingLeft: 20,
  //   paddingRight: 20,
  // },
});

export default Saved;
