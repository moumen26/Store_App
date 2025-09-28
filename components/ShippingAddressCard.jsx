import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ClockIcon, PencilIcon } from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";

const ShippingAddressCard = ({
  index,
  AddressTitle,
  AddressPlace,
  AddressTime,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  isSmallScreen,
  isLargeScreen,
}) => {
  // Determine icon size based on screen size
  const iconSize = isSmallScreen ? 16 : isLargeScreen ? 20 : 18;

  return (
    <TouchableOpacity
      onPress={() => onSelect(index)}
      style={[styles.shippingItem, isSelected && styles.shippingItemSelected]}
      activeOpacity={0.7}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <MapPinIcon size={20} color="#19213D" />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.textPlace}>{AddressTitle}</Text>
            <Text style={styles.textdescription} numberOfLines={1}>
              {AddressPlace}
            </Text>
            {/* <View style={styles.timeContainer}>
              <ClockIcon size={14} color="#888888" />
              <Text style={styles.textdescription}>{AddressTime}</Text>
            </View> */}
          </View>
        </View>

        <View style={styles.rightSection}>
          <View
            style={[
              styles.checkboxContainer,
              isSelected && styles.checkedContainer,
            ]}
          >
            {isSelected && <View style={styles.checkmark} />}
          </View>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(index)}
        >
          <PencilIcon size={18} color="#19213D" />
          <Text style={styles.editButtonText}>Modifier</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(index)}
        >
          <Text style={styles.deleteButtonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFF7FA",
    justifyContent: "center",
    alignItems: "center",
  },
  locationIcon: {
    width: 20,
    height: 20,
    tintColor: "#19213D",
  },
  textContainer: {
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  textPlace: {
    fontSize: 14,
    fontFamily: "Montserrat-SemiBold",
    color: "#333333",
  },
  textdescription: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: "#888888",
  },
  shippingItem: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  shippingItemSelected: {
    borderColor: "#19213D",
    backgroundColor: "#F8FBFC",
  },
  rightSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E2E2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#19213D",
  },
  checkedContainer: {
    borderColor: "#19213D",
    backgroundColor: "#FFFFFF",
  },
  // Action buttons styles
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    marginTop: 12,
    paddingTop: 12,
    marginBottom: 12,
    gap: 12,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#EFF7FA",
  },
  editButtonText: {
    color: "#19213D",
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    marginLeft: 6,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#FFF5F5",
  },
  deleteButtonText: {
    color: "#FF6B6B",
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
  },
});

export default ShippingAddressCard;
