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
import { XMarkIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";

const WilayaFilterModal = ({
  visible,
  onClose,
  wilayas,
  selectedWilaya,
  onSelect,
  onClear,
}) => {
  const [searchText, setSearchText] = useState("");

  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 375;
  const isLargeScreen = width >= 768;

  // Filter wilayas based on search text
  const filteredWilayas = wilayas.filter((wilaya) =>
    wilaya.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (wilayaValue) => {
    onSelect(wilayaValue);
    setSearchText("");
  };

  const handleClear = () => {
    onClear();
    setSearchText("");
  };

  const handleClose = () => {
    onClose();
    setSearchText("");
  };

  const renderWilayaItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.item,
        selectedWilaya === item.value && styles.selectedItem,
      ]}
      onPress={() => handleSelect(item.value)}
    >
      <Text
        style={[
          styles.itemText,
          selectedWilaya === item.value && styles.selectedItemText,
          { fontSize: isSmallScreen ? 12 : isLargeScreen ? 14 : 13 },
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
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
              Filtrer par Wilaya
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
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
              placeholder="Rechercher une wilaya..."
              placeholderTextColor="#888888"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Clear Filter Button */}
          {selectedWilaya && (
            <TouchableOpacity
              style={styles.clearFilterButton}
              onPress={handleClear}
            >
              <Text
                style={[
                  styles.clearFilterText,
                  { fontSize: isSmallScreen ? 12 : isLargeScreen ? 14 : 13 },
                ]}
              >
                Effacer le filtre
              </Text>
            </TouchableOpacity>
          )}

          {/* Wilayas List */}
          <FlatList
            data={filteredWilayas}
            renderItem={renderWilayaItem}
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
                  Aucune wilaya trouvée
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

export default WilayaFilterModal;

const styles = StyleSheet.create({
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
  clearFilterButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  clearFilterText: {
    color: "white",
    fontFamily: "Montserrat-SemiBold",
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
