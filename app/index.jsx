import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function Index() {
  return (
    <View
      className="bg-red-500 h-full"
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Link href={"/StepInto"}>
        <Text>Go to Login </Text>
      </Link>
    </View>
  );
}
