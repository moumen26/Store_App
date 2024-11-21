import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function Index() {
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
