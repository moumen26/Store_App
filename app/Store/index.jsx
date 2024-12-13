import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import {
  MagnifyingGlassIcon,
  BellIcon,
  ShoppingCartIcon,
} from "react-native-heroicons/outline";
import PopularProductCard from "../../components/PopularProductCard";
import BrandsCard from "../../components/BrandsCard";
import SliderStore from "../../components/SliderStore";
import ProductScreen from "../screens/ProductScreen";
import Config from "../config";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../hooks/useAuthContext";
import { ActivityIndicator, FlatList } from "react-native";
import SpecialForYou from "../loading/SpecialForYou";
import Brands from "../loading/Brands";
import AllProducts from "../loading/AllProducts";
import Search from "../loading/Search";
import TopHomeScreen from "../loading/TopHomeScreen";
import COMING_SOON from '../../assets/images/comingSoon.jpg'
const StoreIconVector = require("../../assets/icons/Store.png");
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const Store = () => {
  const route = useRoute();
  const { storeId } = route.params;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { user } = useAuthContext();

  //--------------------------------------------handle states--------------------------------------------
  const handleOpenModel = (stock) => {
    setModalVisible(true);
    setSelectedProduct(stock);
  };
  const handleCloseModel = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };
  //--------------------------------------------APIs--------------------------------------------
  // Function to fetch public publicities data
  const fetchPrivatePublicitiesData = async () => {
    try {
      const response = await api.get(
        `/Publicity/fetchAllStorePublicities/${storeId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      // Check if the response is valid
      if (response.status !== 200) {
        const errorData = await response.data;
        if (errorData.error.statusCode == 404) {
          return []; // Return an empty array for 404 errors
        } else {
          throw new Error("Error receiving private publicities data");
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
    data: PrivatePublicitiesData,
    error: PrivatePublicitiesDataError,
    isLoading: PrivatePublicitiesDataLoading,
    refetch: PrivatePublicitiesDataRefetch,
  } = useQuery({
    queryKey: ["PrivatePublicitiesData", user?.token], // Ensure token is part of the query key
    queryFn: fetchPrivatePublicitiesData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });
  // Function to fetch brands data
  const fetchBrandsData = async () => {
    try {
      const response = await api.get(`/Brand`, {
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
          throw new Error("Error receiving brands data");
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
    data: BrandsData,
    error: BrandsDataError,
    isLoading: BrandsDataLoading,
    refetch: BrandsDataRefetch,
  } = useQuery({
    queryKey: ["BrandsData", user?.token], // Ensure token is part of the query key
    queryFn: fetchBrandsData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });
  // Function to fetch brands data
  const fetchPopularProductsData = async () => {
    try {
      const response = await api.get(`/PopularProduct/${storeId}`, {
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
          throw new Error("Error receiving popular products data");
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
    data: PopularProductsData,
    error: PopularProductsDataError,
    isLoading: PopularProductsDataLoading,
    refetch: PopularProductsDataRefetch,
  } = useQuery({
    queryKey: ["PopularProductsData", user?.token], // Ensure token is part of the query key
    queryFn: fetchPopularProductsData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });
  // Function to fetch brands data
  const fetchProductsData = async () => {
    try {
      const response = await api.get(`/Stock/store/${storeId}`, {
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
          throw new Error("Error receiving products data");
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
    data: ProductsData,
    error: ProductsDataError,
    isLoading: ProductsDataLoading,
    refetch: ProductsDataRefetch,
  } = useQuery({
    queryKey: ["ProductsData", user?.token], // Ensure token is part of the query key
    queryFn: fetchProductsData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });

  return (
    <SafeAreaView className="bg-white pt-5 h-full">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="relative h-full"
      >
        {BrandsDataLoading ? (
          <View className="mx-5 mb-[20]">
            <TopHomeScreen />
          </View>
        ) : BrandsData && BrandsData?.length > 0 ? (
          <View className="flex-row items-center mx-5 mb-[10] space-x-3">
            <View className="flex-1 gap-1">
              <Text style={styles.text} className="text-gray-400">
                Store
              </Text>
              <View
                style={styles.iconText}
                className="flex-row items-center space-x-1"
              >
                {/* <MapPinIcon size={20} color="#26667E" /> */}
                <Image source={StoreIconVector} />

                <Text style={styles.text}>Hamza Alimentation</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("MyCart/index", {
                storeId: storeId,
              })}
              style={styles.notification}
            >
              <ShoppingCartIcon size={18} color="#26667E" />
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}

        {BrandsDataLoading ? (
          <View className="mx-5 mb-[20]">
            <Search />
          </View>
        ) : BrandsData && BrandsData?.length > 0 ? (
          <TouchableOpacity
            className="flex-row items-center space-x-2 mx-5 mb-[10]"
            style={styles.searchClass}
            onPress={() => navigation.navigate("Search/index")}
          >
            <View
              style={styles.searchButton}
              className="flex-1 flex-row items-center space-x-2 pl-5 h-[50px] border-[1px] rounded-3xl"
            >
              <MagnifyingGlassIcon color="#888888" size={20} />
              <Text style={styles.search}>Search by Product..</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <></>
        )}

        {PrivatePublicitiesDataLoading ? (
          <View className="mx-5 mb-[20]">
            <SpecialForYou />
          </View>
        ) : PrivatePublicitiesData && PrivatePublicitiesData?.length > 0 ? (
          <View className="mx-5 mb-[20]">
            <Text style={styles.titleCategory}>#SpecialForYou</Text>
            <SliderStore data={PrivatePublicitiesData} />
          </View>
        ) : (
          <></>
        )}

        {BrandsDataLoading ? (
          <View className="mx-5 mb-[20]">
            <Brands />
          </View>
        ) : BrandsData && BrandsData?.length > 0 ? (
          <View className="mx-5 mb-[20]">
            <Text style={styles.titleCategory}>Brands</Text>
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 10 }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {BrandsData.map((brand) => (
                <BrandsCard
                  key={brand?._id}
                  imgUrl={`${Config.API_URL.replace("/api", "")}/files/${
                    brand?.image
                  }`}
                  onPress={() =>
                    navigation.navigate("Brand/index", {
                      brandId: brand?._id,
                      brandIMG: `${Config.API_URL.replace("/api", "")}/files/${
                        brand?.image
                      }`,
                    })
                  }
                />
              ))}
            </ScrollView>
          </View>
        ) : (
          <></>
        )}

        {PopularProductsDataLoading ? (
          <View className="mx-5 mb-[20]">
            <AllProducts />
          </View>
        ) : PopularProductsData && PopularProductsData?.length > 0 ? (
          <View className="mx-5 mb-[20]">
            <View className="flex-row items-center justify-between">
              <Text style={styles.titleCategory}>Popular Products</Text>
              <TouchableOpacity>
                <Text
                  onPress={() =>
                    navigation.navigate("PopularProducts/index", {
                      popularProductsData: PopularProductsData,
                    })
                  }
                  style={styles.seeAll}
                >
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center justify-around mt-4">
              <FlatList
                data={PopularProductsData}
                horizontal
                keyExtractor={(item) => item._id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <PopularProductCard
                    key={item?._id}
                    imgUrl={`${Config.API_URL.replace("/api", "")}/files/${
                      item?.image
                    }`}
                    ProductName={item?.name}
                    onPress={() => handleOpenModel(item)}
                  />
                )}
              />
            </View>
          </View>
        ) : (
          <></>
        )}

        {ProductsDataLoading ? (
          <View className="mx-5 mb-3">
            <AllProducts />
          </View>
        ) : ProductsData && ProductsData?.length > 0 ? (
          <View className="mx-5 mb-3">
            <View className="flex-row items-center justify-between">
              <Text style={styles.titleCategory}>All Products</Text>
              <TouchableOpacity>
                <Text
                  onPress={() =>
                    navigation.navigate("AllProducts/index", {
                      productsData: ProductsData,
                    })
                  }
                  style={styles.seeAll}
                >
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center justify-around mt-4">
              <FlatList
                data={ProductsData}
                horizontal
                keyExtractor={(item) => item._id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <PopularProductCard
                    key={item?._id}
                    imgUrl={`${Config.API_URL.replace("/api", "")}/files/${
                      item?.product?.image
                    }`}
                    ProductName={
                      item?.product?.brand?.name +
                      " " +
                      item?.product?.name +
                      " " +
                      item?.product?.size
                    }
                    onPress={() => handleOpenModel(item)}
                  />
                )}
              />
            </View>
          </View>
        ) : (
          <></>
        )}

        {(!ProductsData || ProductsData?.length <= 0) &&
          <SafeAreaView className="bg-white pt-5 h-full">
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={COMING_SOON}
              />
            </View>        
          </SafeAreaView>
        }
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModel}
      >
        <View style={styles.modalView}>
          <ProductScreen data={selectedProduct} storeId={storeId} onclose={handleCloseModel} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  iconText: {
    gap: 4,
  },
  text: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  notification: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderColor: "#3E9CB9",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  search: {
    color: "#888888",
    borderColor: "#26667E",
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
  seeAll: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    color: "#26667E",
  },
  navigationClass: {
    borderColor: "#888888",
    borderWidth: 0.5,
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  navigationText: {
    fontSize: 10,
    fontFamily: "Montserrat-Regular",
  },
  searchClass: {
    marginBottom: 10,
  },
  searchButton: {
    flex: 1,
    gap: 4,
    paddingLeft: 15,
    height: 50,
    borderWidth: 1,
    borderColor: "#26667E",
    borderRadius: 30,
    alignItems: "center",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(201, 228, 238, 0.4)",
  },
  image: {
    width: 150,
    height: 200,
    resizeMode: "contain",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("screen").height * 0.3,
  },
});

export default Store;
