import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";

const SelectOption = ({ options, visible, onSelect }) => {
  const translateYAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateYAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateYAnim, {
        toValue: 400,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => onSelect(null)}
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.modalView,
            { transform: [{ translateY: translateYAnim }] },
          ]}
        >
          <FlatList
            data={options}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onSelect(item)}>
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.toString()}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 10,
  },
  optionText: {
    fontSize: 18,
    paddingVertical: 10,
  },
});

export default SelectOption;
