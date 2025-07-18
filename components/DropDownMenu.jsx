import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Menu, Divider } from "react-native-paper";
import { useNavigation } from "expo-router";
import { EllipsisVerticalIcon } from "react-native-heroicons/outline";

const DropDownMenu = () => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.dropMenu}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <EllipsisVerticalIcon
            size={32}
            color="#19213D"
            onPress={() => setVisible(true)}
          />
        }
      >
        <Menu.Item
          onPress={() => {
            setVisible(false);
            console.log("Search click");
            navigation.navigate("Search/index");
          }}
          title="Search"
        />
        <Divider />
        <Menu.Item
          onPress={() => {
            setVisible(false);
            console.log("Track Order click");
            navigation.navigate("TrackOrder/index");
          }}
          title="Track Order"
        />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  dropMenu: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DropDownMenu;
