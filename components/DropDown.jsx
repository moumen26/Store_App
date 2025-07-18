import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  useWindowDimensions,
} from "react-native";
import {
  ChevronDownIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";

const WilayaModalDropdown = ({ data, dropDownTitle, onSelect }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 375;
  const isLargeScreen = width >= 768;

  // Filter data based on search text
  const filteredData = data.filter((item) =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (item) => {
    setSelectedValue(item.value);
    setSelectedLabel(item.label);
    onSelect(item.value);
    setModalVisible(false);
    setSearchText("");
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, selectedValue === item.value && styles.selectedItem]}
      onPress={() => handleSelect(item)}
    >
      <Text
        style={[
          styles.itemText,
          selectedValue === item.value && styles.selectedItemText,
          { fontSize: isSmallScreen ? 12 : isLargeScreen ? 14 : 13 },
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.dropdown,
          isFocused && { borderColor: "#19213D" },
          { height: isSmallScreen ? 45 : isLargeScreen ? 55 : 50 },
        ]}
        onPress={() => {
          setModalVisible(true);
          setIsFocused(true);
        }}
      >
        <Text
          style={[
            selectedLabel ? styles.selectedTextStyle : styles.placeholderStyle,
            { fontSize: isSmallScreen ? 11 : isLargeScreen ? 13 : 12 },
          ]}
        >
          {selectedLabel || dropDownTitle}
        </Text>
        <ChevronDownIcon
          size={isSmallScreen ? 16 : isLargeScreen ? 20 : 18}
          color="#888888"
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          setIsFocused(false);
          setSearchText("");
        }}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                width: width * 0.9,
                maxHeight: height * 0.7,
                borderRadius: isSmallScreen ? 12 : 16,
              },
            ]}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  { fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18 },
                ]}
              >
                {dropDownTitle}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setIsFocused(false);
                  setSearchText("");
                }}
                style={styles.closeButton}
              >
                <XMarkIcon
                  size={isSmallScreen ? 20 : isLargeScreen ? 26 : 24}
                  color="#888888"
                />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View
              style={[
                styles.searchContainer,
                { height: isSmallScreen ? 40 : isLargeScreen ? 50 : 45 },
              ]}
            >
              <MagnifyingGlassIcon
                size={isSmallScreen ? 16 : isLargeScreen ? 20 : 18}
                color="#888888"
                style={styles.searchIcon}
              />
              <TextInput
                style={[
                  styles.searchInput,
                  { fontSize: isSmallScreen ? 12 : isLargeScreen ? 14 : 13 },
                ]}
                placeholder="Rechercher..."
                placeholderTextColor="#888888"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            {/* List */}
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item) => item.value.toString()}
              style={styles.list}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text
                    style={[
                      styles.emptyText,
                      {
                        fontSize: isSmallScreen ? 12 : isLargeScreen ? 14 : 13,
                      },
                    ]}
                  >
                    Aucun résultat trouvé
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WilayaModalDropdown;

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#E3EFFF",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  placeholderStyle: {
    color: "#888888",
    fontFamily: "Montserrat-Regular",
  },
  selectedTextStyle: {
    color: "#19213D",
    fontFamily: "Montserrat-Regular",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(201, 228, 238, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: "Montserrat-SemiBold",
    color: "#19213D",
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E3EFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Montserrat-Regular",
    color: "#19213D",
  },
  list: {
    maxHeight: 300,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  selectedItem: {
    backgroundColor: "#E3EFFF",
  },
  itemText: {
    fontFamily: "Montserrat-Regular",
    color: "#19213D",
  },
  selectedItemText: {
    color: "#19213D",
    fontFamily: "Montserrat-SemiBold",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
});
