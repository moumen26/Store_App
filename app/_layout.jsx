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
        name="SignIn/index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
