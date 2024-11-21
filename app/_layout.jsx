import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import "./../global.css";

export default function RootLayout() {
  useFonts({
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
  });

  return (
    <Stack>
      <Stack.Screen name="index" />
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
  );
}
