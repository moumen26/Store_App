import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import SavedStoreItem from "../../components/SavedStoreItem";
import { useNavigation } from "expo-router";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import Config from "../config";
import { useQuery } from "@tanstack/react-query";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import Search from "../loading/Search";
import StoreCart from "../loading/StoreCart";
import BackButton from "../../components/BackButton";

// Axios instance for base URL configuration
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const Saved = () => {
  const navigation = useNavigation();
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFavoriteData, setFilteredFavoriteData] = useState([]);

  //--------------------------------------------APIs--------------------------------------------
  // Function to fetch favorite data
  const fetchFavoriteData = async () => {
    try {
      const response = await api.get(`/Favorite/${user?.info?.id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      // Check if the response is valid
      if (response.status !== 200) {
        const errorData = await response.data;
        if (errorData.error.statusCode == 404) {
          return []; // Return an empty array for 404 errors
        } else {
          throw new Error("Error receiving favorite data");
        }
      }

      // Return the data from the response
      return await response.data;
    } catch (error) {
      // Handle if the request fails with status code 401 or 404
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        return []; // Return an empty array for 401 and 404 errors
      }
      throw new Error(error?.message || "Network error");
    }
  };
  const {
    data: FavoriteData,
    error: FavoriteDataError,
    isLoading: FavoriteDataLoading,
    refetch: FavoriteDataRefetch,
  } = useQuery({
    queryKey: ["FavoriteData", user?.token], // Ensure token is part of the query key
    queryFn: fetchFavoriteData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchInterval: 10000, // Refetch every 1 minutes
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });

  // Update filteredFavoriteData whenever FavoriteData or searchQuery changes
  useEffect(() => {
    if (FavoriteData) {
      if (searchQuery.trim() === '') {
        // If search query is empty, show all stores
        setFilteredFavoriteData(FavoriteData);
      } else {
        // Filter stores based on search query
        const query = searchQuery.toLowerCase().trim();
        const filtered = FavoriteData?.filter(store => 
          (store.store.storeName && store.store.storeName?.toLowerCase().includes(query)) || 
          (store.store.wilaya && store.store.wilaya?.toLowerCase().includes(query))
        );
        setFilteredFavoriteData(filtered);
      }
    } else {
      setFilteredFavoriteData([]);
    }
  }, [FavoriteData, searchQuery]);

  // Handle search clear function
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  //--------------------------------------------Rendering--------------------------------------------
  if (FavoriteDataLoading) {
    return (
      <SafeAreaView className="bg-white pt-3 pb-12 relative h-full">
        <View className="mx-5" style={styles.containerLoading}>
          <View style={styles.containerLoadingtextScreen}>
            <ShimmerPlaceholder style={styles.textScreen} />
          </View>
          <Search />
          <StoreCart />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white pt-3 pb-12 relative h-full">
      <View className="mx-5 mb-[20] flex-row items-center justify-between">
        <View style={styles.Vide}></View>
        <Text className="text-center" style={styles.titleScreen}>
          Magasins Enregistrés{" "}
        </Text>
        <View style={styles.Vide}></View>
      </View>

      <View style={styles.searchBar}>
        <MagnifyingGlassIcon size={20} color="#26667E" />
        <TextInput
          style={styles.searchBarItem}
          placeholder="Rechercher par magasin..."
          placeholderTextColor="#888888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={handleClearSearch}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.container}>
        {filteredFavoriteData?.length > 0 ? (
          <FlatList
            data={filteredFavoriteData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <SavedStoreItem
                key={item._id}
                StoreName={item?.store?.storeName}
                onPress={() =>
                  navigation.navigate("MyWishList/index", {
                    storeId: item?.store?._id,
                    favoriteId: item?._id,
                    storeName: item?.store?.storeName,
                  })
                }
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.containerScroll}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#888888",
                fontSize: 14,
                fontFamily: "Montserrat-Regular",
              }}
            >
              Aucun magasin trouvé
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Vide: {
    width: 40,
    height: 40,
  },
  containerLoadingtextScreen: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  containerLoading: {
    flexDirection: "column",
    gap: 16,
  },
  safeArea: {
    backgroundColor: "white",
    paddingTop: 3,
    paddingBottom: 12,
    height: "100%",
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
