import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";

export default function Index() {
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          console.log("User authenticated, redirecting to protected screen.");
          navigation.reset({
            index: 0,
            routes: [{ name: "(tabs)" }],
          });
        } else {
          console.log("User not authenticated, redirecting to login screen.");
          navigation.reset({
            index: 0,
            routes: [{ name: "StepInto/index" }],
          });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Fallback to login
        navigation.reset({
          index: 0,
          routes: [{ name: "StepInto" }],
        }); 
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [router]);
  return (
    <View
      className="bg-[#26667E] h-full"
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Link href={"/StepInto"}>
        <Text style={styles.text}>Store</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontSize: 32,
  },
});
