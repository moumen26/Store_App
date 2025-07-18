import { Stack, useNavigation, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import "./../global.css";
import "core-js/stable/atob";
import { AuthContextProvider } from "./context/Authcontext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const queryClient = new QueryClient();

export default function RootLayout() {
  useFonts({
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
  });
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    // Define async function inside useEffect
    const checkAuth = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        console.log("Checking user authentication...");
        console.log("User data:", userData);

        if (!userData) {
          console.log("User not authenticated, redirecting to login screen.");
          navigation.reset({
            index: 0,
            routes: [{ name: "StepInto/index" }],
          });          
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigation.reset({
          index: 0,
          routes: [{ name: "StepInto" }],
        });
      }
    };

    // Execute the async function
    checkAuth();
  }, [navigation]);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <Stack>
          {/* Unprotected Screens */}
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="StepInto/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Discover/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignIn/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignUp/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="VerifyCode/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ResetPassword/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="YourCart/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="YourOrders/index"
            options={{
              headerShown: false,
            }}
          />

          {/* Protected Screens */}
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Search/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TrackOrder/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Notifications/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="NotificationReaded/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ArchiveOrders/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="RequestStores/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="ScanBarCode/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="MyWishList/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="Store/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Brand/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="AllProducts/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="PopularProducts/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="Product/index"
            options={{
              headerShown: false,
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="MyCart/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="E-Receipt/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="ShippingAddress/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
        </Stack>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
