import { useState, useEffect, useCallback } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function ScanBarCode() {
  const navigation = useNavigation();
  const route = useRoute();
  const { onScanComplete } = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = useCallback(
    async (scanResult) => {
      if (isProcessing) return; // Prevent multiple scans

      setIsProcessing(true);
      try {
        if (onScanComplete) {
          await onScanComplete(scanResult);
        }
        // Use replace instead of goBack to ensure we only navigate once
        navigation.canGoBack() && navigation.goBack();
      } catch (error) {
        console.error("Scan processing error:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [onScanComplete, navigation, isProcessing]
  );

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Camera.requestCameraPermissionsAsync()}
        >
          <Text style={styles.buttonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={!isProcessing ? handleBarCodeScanned : undefined}
        barcodeScannerSettings={{
          barcodeTypes: ["code128"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <Text style={styles.text}>Processing scan...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: "#888888",
    fontFamily: "Montserrat-Regular",
  },
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#19213D",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
