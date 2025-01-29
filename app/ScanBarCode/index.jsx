import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RNCamera } from "react-native-camera";

const ScanBarCode = () => {
  const [barcode, setBarcode] = useState(null);

  const handleBarcodeScan = ({ barcodes }) => {
    if (barcodes && barcodes.length > 0) {
      setBarcode(barcodes[0].data);
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        onBarCodeRead={handleBarcodeScan}
        captureAudio={false}
      >
        <View style={styles.overlay}>
          {barcode && (
            <Text style={styles.barcodeText}>Scanned Barcode: {barcode}</Text>
          )}
        </View>
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
  },
  overlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -75 }, { translateY: -25 }],
    alignItems: "center",
  },
  barcodeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ScanBarCode;
