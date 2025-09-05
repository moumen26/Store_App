import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
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
import COMING_SOON from "../../assets/images/comingSoon.jpg";
import { BuildingStorefrontIcon } from "react-native-heroicons/solid";
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const Store = () => {
  const route = useRoute();
  const { storeId, storeName, storeAddress } = route.params;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { user } = useAuthContext();

  // Get screen dimensions
  const { width, height } = useWindowDimensions();

  // Calculate responsive values
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Responsive spacing calculations
  const horizontalPadding = width * 0.05;
  const verticalSpacing = height * 0.025;
  const iconSize = isSmallScreen ? 18 : isLargeScreen ? 22 : 20;
  const searchHeight = isSmallScreen ? 45 : isLargeScreen ? 55 : 50;
  const sectionGap = isSmallScreen ? 16 : isLargeScreen ? 24 : 20;

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
        `/Publicity/fetchAllStorePublicities/${storeId}/${user?.info?.id}`,
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
    queryKey: ["PrivatePublicitiesData", user?.token, storeId], // Ensure token is part of the query key
    queryFn: fetchPrivatePublicitiesData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });
  // Function to fetch brands data
  const fetchPopularProductsData = async () => {
    try {
      const response = await api.get(
        `/PopularProduct/client/${storeId}/${user?.info?.id}`,
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
    queryKey: ["PopularProductsData", user?.token, storeId], // Ensure token is part of the query key
    queryFn: fetchPopularProductsData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });
  // Function to fetch brands data
  const fetchProductsData = async () => {
    try {
      const response = await api.get(
        `/Stock/store/${user?.info?.id}/${storeId}`,
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
    queryKey: ["ProductsData", user?.token, storeId], // Ensure token is part of the query key
    queryFn: fetchProductsData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });
  const extractBrandDataFromProductsData = (productsData) => {
    if (!productsData || productsData.length === 0) {
      return [];
    }
    const brandsData = productsData.reduce((acc, product) => {
      if (
        product?.product?.brand &&
        !acc.some((b) => b._id === product.product.brand._id)
      ) {
        acc.push({
          _id: product.product.brand._id,
          name: product.product.brand.name,
          image: product.product.brand.image,
        });
      }
      return acc;
    }, []);
    return brandsData;
  };
  //--------------------------------------------RENDERING--------------------------------------------
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
        }}
      >
        {ProductsDataLoading ? (
          <View
            style={{
              marginHorizontal: horizontalPadding,
              marginBottom: sectionGap,
            }}
          >
            <TopHomeScreen />
          </View>
        ) : ProductsData && ProductsData?.length > 0 ? (
          <View
            style={[
              styles.headerContainer,
              { marginHorizontal: horizontalPadding },
            ]}
          >
            <View style={styles.storeInfo}>
              <Text
                style={[
                  styles.storeLabel,
                  { fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13 },
                ]}
              >
                Magasin
              </Text>
              <View style={styles.iconText}>
                <BuildingStorefrontIcon
                  name="cart"
                  size={iconSize}
                  color="#19213D"
                />
                <Text
                  style={[
                    styles.text,
                    { fontSize: isSmallScreen ? 13 : isLargeScreen ? 16 : 14 },
                  ]}
                >
                  {storeName}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MyCart/index", {
                  storeId: storeId,
                  storeAddress: storeAddress,
                })
              }
              style={[
                styles.notification,
                {
                  width: isSmallScreen ? 36 : 40,
                  height: isSmallScreen ? 36 : 40,
                  borderRadius: isSmallScreen ? 18 : 20,
                },
              ]}
            >
              <ShoppingCartIcon size={iconSize} color="#19213D" />
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}

        {ProductsDataLoading ? (
          <View
            style={{
              marginHorizontal: horizontalPadding,
              marginBottom: sectionGap,
            }}
          >
            <Search />
          </View>
        ) : ProductsData && ProductsData?.length > 0 ? (
          <TouchableOpacity
            style={[
              styles.searchClass,
              { marginHorizontal: horizontalPadding },
            ]}
            onPress={() =>
              navigation.navigate("Search/index", {
                ProductsData: ProductsData,
                storeId: storeId,
              })
            }
          >
            <View style={[styles.searchButton, { height: searchHeight }]}>
              <MagnifyingGlassIcon color="#19213D" size={iconSize} />
              <Text
                style={[
                  styles.search,
                  { fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12 },
                ]}
              >
                Rechercher par produit...
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <></>
        )}

        {PrivatePublicitiesDataLoading ? (
          <View
            style={{
              marginHorizontal: horizontalPadding,
              marginBottom: sectionGap,
            }}
          >
            <SpecialForYou />
          </View>
        ) : PrivatePublicitiesData && PrivatePublicitiesData?.length > 0 ? (
          <View
            style={{
              marginHorizontal: horizontalPadding,
              marginBottom: sectionGap,
            }}
          >
            <Text
              style={[
                styles.titleCategory,
                { fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18 },
              ]}
            >
              #SpécialPourVous
            </Text>
            <SliderStore data={PrivatePublicitiesData} />
          </View>
        ) : (
          <></>
        )}

        {ProductsDataLoading ? (
          <View
            style={{
              marginHorizontal: horizontalPadding,
              marginBottom: sectionGap,
            }}
          >
            <Brands />
          </View>
        ) : ProductsData && ProductsData?.length > 0 ? (
          <View
            style={{
              marginHorizontal: horizontalPadding,
              marginBottom: sectionGap,
            }}
          >
            <Text
              style={[
                styles.titleCategory,
                { fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18 },
              ]}
            >
              Marques
            </Text>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 0,
                paddingTop: 10,
                gap: 6,
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {extractBrandDataFromProductsData(ProductsData).map((brand) => (
                <BrandsCard
                  key={brand?._id}
                  imgUrl={`${Config.FILES_URL}/${brand?.image}`}
                  onPress={() =>
                    navigation.navigate("Brand/index", {
                      brandId: brand?._id,
                      brandIMG: `${Config.FILES_URL}/${brand?.image}`,
                      ProductsData: ProductsData,
                      storeId: storeId,
                    })
                  }
                />
              ))}
            </ScrollView>
          </View>
        ) : null}

        {ProductsDataLoading ? (
          <View
            style={{
              marginHorizontal: horizontalPadding,
              marginBottom: sectionGap,
            }}
          >
            <AllProducts />
          </View>
        ) : ProductsData && ProductsData?.length > 0 ? (
          <View
            style={{
              marginHorizontal: horizontalPadding,
              marginBottom: sectionGap,
            }}
          >
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  styles.titleCategory,
                  { fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18 },
                ]}
              >
                Tous les produits
              </Text>
              <TouchableOpacity>
                <Text
                  onPress={() =>
                    navigation.navigate("AllProducts/index", {
                      productsData: ProductsData,
                      storeId: storeId,
                    })
                  }
                  style={[
                    styles.seeAll,
                    { fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12 },
                  ]}
                >
                  Voir tout
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.productsContainer}>
              <FlatList
                data={ProductsData}
                horizontal
                keyExtractor={(item) => item?._id?.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <PopularProductCard
                    key={item?._id}
                    imgUrl={`${Config.FILES_URL}/${item?.product?.image}`}
                    ProductName={
                      item?.product?.brand?.name +
                      " " +
                      item?.product?.name +
                      " " +
                      item?.product?.size
                    }
                    onPress={() =>
                      navigation.navigate("Product/index", {
                        data: item,
                        storeId: storeId,
                      })
                    }

                    // onPress={() => handleOpenModel(item)}
                  />
                )}
              />
            </View>
          </View>
        ) : (
          <SafeAreaView style={styles.emptyState}>
            <View style={[styles.imageContainer, { height: height * 0.3 }]}>
              <Image
                style={[
                  styles.image,
                  {
                    width: isSmallScreen ? 120 : isLargeScreen ? 180 : 150,
                    height: isSmallScreen ? 160 : isLargeScreen ? 240 : 200,
                  },
                ]}
                source={COMING_SOON}
              />
            </View>
          </SafeAreaView>
        )}

        {PopularProductsDataLoading ? (
          <View
            style={{
              marginHorizontal: horizontalPadding,
              marginBottom: sectionGap,
            }}
          >
            <AllProducts />
          </View>
        ) : PopularProductsData && PopularProductsData?.length > 0 ? (
          <View
            style={{
              marginHorizontal: horizontalPadding,
              marginBottom: sectionGap,
            }}
          >
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  styles.titleCategory,
                  { fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18 },
                ]}
              >
                Produits populaires
              </Text>
              <TouchableOpacity>
                <Text
                  onPress={() =>
                    navigation.navigate("PopularProducts/index", {
                      popularProductsData: PopularProductsData,
                      storeId: storeId,
                    })
                  }
                  style={[
                    styles.seeAll,
                    { fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12 },
                  ]}
                >
                  Voir tout
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.productsContainer}>
              <FlatList
                data={PopularProductsData}
                horizontal
                keyExtractor={(item) => item?._id?.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <PopularProductCard
                    key={item?._id}
                    imgUrl={`${Config.FILES_URL}/${item?.stock?.product?.image}`}
                    ProductName={item?.stock?.product?.name}
                    onPress={() =>
                      navigation.navigate("Product/index", {
                        data: item?.stock,
                        storeId: storeId,
                      })
                    }
                  />
                )}
              />
            </View>
          </View>
        ) : (
          <></>
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModel}
      >
        <View style={styles.modalView}>
          <ProductScreen
            data={selectedProduct}
            storeId={storeId}
            onclose={handleCloseModel}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 10 : 3,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 12,
  },
  storeInfo: {
    flex: 1,
    gap: 4,
  },
  storeLabel: {
    color: "#888888",
    fontFamily: "Montserrat-Regular",
  },
  iconText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  text: {
    fontFamily: "Montserrat-Regular",
  },
  notification: {
    borderColor: "#E3EFFF",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchClass: {
    marginBottom: 10,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: "#E3EFFF",
    borderRadius: 30,
  },
  search: {
    color: "#888888",
    fontFamily: "Montserrat-Regular",
  },
  titleCategory: {
    fontFamily: "Montserrat-Regular",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 16,
  },
  seeAll: {
    fontFamily: "Montserrat-Regular",
    color: "#19213D",
  },
  emptyState: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 12,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    resizeMode: "contain",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(201, 228, 238, 0.4)",
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
});

export default Store;
