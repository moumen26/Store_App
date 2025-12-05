import { Alert } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import React, { useLayoutEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import BackButton from "../../components/BackButton";
import CartRow from "../../components/CartRow";
import SubmitOrderModal from "../../components/SubmitOrderModal.jsx";
import EReceiptDetails from "../../components/EReceiptDetails";
import { useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import Config from "../config";
import { useQuery } from "@tanstack/react-query";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import CodeBar from "../loading/CodeBar";
import ArticleItem from "../loading/ArticleItem";
import EReceiptDetailsShimmer from "../loading/EReceiptDetails";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import TrackButton from "../../components/TrackButton";
import { ArrowLeftIcon } from "lucide-react-native";
const Logo = require("../../assets/Logo-vertical.png");

// Axios instance for base URL configuration
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const EReceiptScreen = () => {
  const { user } = useAuthContext();
  const route = useRoute();
  const { OrderID } = route.params;
  const insets = useSafeAreaInsets();

  // Get screen dimensions with validation
  const { width, height } = useWindowDimensions();

  // Validate dimensions to prevent NaN
  const safeWidth = width && !isNaN(width) ? width : 375;
  const safeHeight = height && !isNaN(height) ? height : 667;

  // Calculate responsive values with safe dimensions
  const isSmallScreen = safeWidth < 375;
  const isMediumScreen = safeWidth >= 375 && safeWidth < 768;
  const isLargeScreen = safeWidth >= 768;

  // Responsive spacing calculations with safe values
  const horizontalPadding = safeWidth * 0.05;
  const verticalSpacing = safeHeight * 0.025;
  const smallSpacing = safeHeight * 0.01;

  // Additional responsive values with validation
  const buttonHeight = Math.max(45, safeHeight * 0.06);
  const buttonWidth = isLargeScreen ? safeWidth * 0.6 : safeWidth * 0.85;
  const barcodeWidth = isSmallScreen
    ? safeWidth * 0.95
    : isLargeScreen
    ? safeWidth * 0.85
    : safeWidth * 0.9;
  const bottomBarHeight =
    Platform.OS === "android"
      ? (isSmallScreen ? 40 : 50) + insets.bottom
      : isSmallScreen
      ? 70
      : 80;

  // Validate OrderID before using it
  const validOrderID =
    OrderID && typeof OrderID === "string" && OrderID.trim() !== ""
      ? OrderID.trim()
      : null;

  //--------------------------------------------APIs--------------------------------------------
  // Function to fetch public publicities data
  const fetchOrderData = async () => {
    try {
      const response = await api.get(
        `/Receipt/client/${user?.info?.id}/${OrderID}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      // Return the data from the response
      return (await response.data) || [];
    } catch (error) {
      // Handle if the request fails with status code 401 or 404
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        return []; // Return an empty array for 401 and 404 errors
      }
      throw new Error(error?.message || "Network error");
    }
  };

  const {
    data: OrderData,
    error: OrderDataError,
    isLoading: OrderDataLoading,
    refetch: OrderDataRefetch,
  } = useQuery({
    queryKey: ["OrderData", user?.token, validOrderID], // Include OrderID in query key
    queryFn: fetchOrderData,
    enabled: !!user?.token && !!validOrderID, // Only run if user is authenticated and OrderID is valid
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true,
  });

  // Refetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.token && validOrderID) {
        OrderDataRefetch();
      }
      return () => {};
    }, [user?.token, validOrderID])
  );

  const html = `
  <html>
    <head>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Montserrat', sans-serif;
          margin: 0;
          padding: 10px 30px;
          background-color: white;
          color: black;
          font-size: 11px;
          line-height: 1.4;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .header-section {
          margin-bottom: 30px;
        }
        
        .logo-barcode-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .logo-container {
          flex: 0 0 auto;
        }
        
        .company-logo {
          max-height: 80px;
          max-width: 200px;
          height: auto;
          width: auto;
        }
        
        .barcode-container {
          flex: 0 0 auto;
        }
        
        .barcode-image {
          max-width: 250px;
          min-height: 50px;
          height: auto;
        }
        
        .title-section {
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
        
        .title-content {
          flex: 1;
          text-align: center;
          padding-top: 10px;
        }
        
        .main-title {
          margin: 0 0 15px 0;
          font-size: 24px;
          font-weight: bold;
          color: #0d3a71;
        }
        
        .title-underline {
          width: 100px;
          height: 3px;
          background-color: #0d3a71;
          margin: 10px auto;
          border-radius: 2px;
        }
        
        .order-info {
          font-size: 14px;
          color: #666;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 30px;
        }
        
        .info-section h3 {
          font-weight: bold;
          margin-bottom: 3px;
          font-size: 11px;
        }
        
        .info-section p {
          margin-bottom: 2px;
          font-size: 11px;
        }
        
        .client-info {
          text-align: right;
        }
        
        .products-section {
          margin-bottom: 30px;
        }
        
        .part-title {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #666;
        }
        
        .products-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #ddd;
          margin-bottom: 20px;
        }
        
        .products-table th {
          background-color: #0d3a71;
          color: white;
          padding: 8px;
          font-size: 11px;
          font-weight: bold;
          border: 1px solid #0d3a71;
        }
        
        .products-table td {
          border: 1px solid #ddd;
          padding: 8px;
          font-size: 10px;
        }
        
        .quantity-col {
          width: 60px;
          text-align: center;
        }
        
        .description-col {
          text-align: left;
        }
        
        .price-col {
          width: 100px;
          text-align: center;
        }
        
        .total-col {
          width: 140px;
          text-align: center;
        }
        
        .product-name {
          font-weight: bold;
          margin-bottom: 2px;
        }
        
        .product-size {
          font-size: 9px;
          color: #666;
        }
        
        .product-box-display {
          font-size: 9px;
          color: #666;
          font-style: italic;
        }
        
        .empty-row {
          padding: 12px;
          background-color: #f8f9fa;
        }
        
        .subtotal-row {
          font-weight: bold;
          background-color: #f8f9fa;
        }
        
        .subtotal-row .label {
          text-align: left;
        }
        
        .delivery-row {
          font-weight: bold;
          background-color: #f8f9fa;
        }
        
        .delivery-row .label {
          text-align: left;
        }
        
        .final-total-row {
          font-weight: bold;
          font-size: 12px;
          background-color: #0d3a71;
          color: white;
        }
        
        .final-total-row .label {
          padding: 12px 8px;
          text-align: left;
        }
        
        .final-total-row .value {
          padding: 12px 8px;
          font-size: 14px;
        }
        
        .payment-section {
          margin-bottom: 30px;
        }
        
        .payment-title {
          margin: 0 0 15px 0;
          font-size: 16px;
          font-weight: bold;
          color: #0d3a71;
        }
        
        .payment-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #ddd;
        }
        
        .payment-table th {
          background-color: #0d3a71;
          color: white;
          padding: 8px;
          text-align: center;
          font-weight: bold;
          border: 1px solid #0d3a71;
        }
        
        .payment-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }
        
        .payment-summary {
          text-align: right;
          margin-top: 10px;
          font-size: 14px;
        }
        
        .remaining-amount {
          color: #ef4444;
          font-weight: bold;
        }
        
        .footer {
          border-top: 3px solid #0d3a71;
          padding-top: 10px;
          margin-top: 10px;
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          position: absolute;
          bottom: 20px;
          left: 0;
          width: 100%;
        }
        
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .print-date {
          flex: 1;
          text-align: left;
          font-size: 10px;
          color: #666;
          font-style: italic;
        }
        
        .thank-you {
          flex: 1;
          text-align: center;
          font-size: 14px;
          font-weight: bold;
          color: #0d3a71;
        }
        
        .company-name {
          flex: 1;
          text-align: right;
          font-size: 10px;
          color: #0d3a71;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <!-- Header Section -->
      <div class="header-section">
        <!-- Logo and Barcode Row -->
        <div class="logo-barcode-row">
          <!-- Logo on the left -->
          <div class="logo-container">
            <img src="../../assets/Logo-vertical.png" alt="Company Logo" class="company-logo" />
          </div>

          <!-- Barcode on the right -->
          <div class="barcode-container">
            ${
              OrderData?.reciept?._id
                ? `<img src="https://barcode.tec-it.com/barcode.ashx?data=${OrderData.reciept._id}&code=Code128&dpi=300&width=300&height=80" alt="Code-barres" class="barcode-image" />`
                : "<p>Code-barres non disponible</p>"
            }
          </div>
        </div>

        <!-- Title Row -->
        <div class="title-section">
          <div class="title-content">
            <h1 class="main-title">BON DE COMMANDE</h1>
            <div class="title-underline"></div>
          </div>
        </div>

        <!-- Order Number and Date -->
        <div class="order-info">
          <span>N° Commande: #${OrderData?.reciept?._id || "N/A"}</span>
          <span>Date: ${
            OrderData?.reciept?.date
              ? new Date(OrderData.reciept.date).toLocaleDateString("fr-FR")
              : "N/A"
          }</span>
        </div>
      </div>

      <!-- Order and Client Info -->
      <div class="info-grid">
        <!-- Order Details -->
        <div class="info-section">
          <h3>DÉTAILS DE LA COMMANDE</h3>
          <p><strong>Montant Total:</strong> ${new Intl.NumberFormat(
            "fr-FR"
          ).format(
            (OrderData?.reciept?.total || 0) +
              (OrderData?.reciept?.deliveryCost || 0)
          )} DA</p>
          <p><strong>Type de livraison:</strong> ${
            OrderData?.reciept?.type === "delivery" ? "Livraison" : "Retrait"
          }</p>
        </div>

        <!-- Client Details -->
        <div class="info-section client-info">
          <h3>INFORMATIONS CLIENT</h3>
          <p><strong>Nom:</strong> ${user?.info?.firstName || ""} ${
    user?.info?.lastName || ""
  }</p>
          <p><strong>Téléphone:</strong> ${user?.info?.phoneNumber || "N/A"}</p>
          <p style="font-size: 10px;"><strong>Adresse:</strong> ${
            OrderData?.reciept?.type === "delivery" &&
            OrderData?.reciept?.deliveredLocation?.address
              ? OrderData.reciept.deliveredLocation.address
              : OrderData?.reciept?.store?.storeName || "N/A"
          }</p>
        </div>
      </div>

      <!-- Products Section -->
      <div class="products-section">
        <table class="products-table">
          <thead>
            <tr>
              <th class="quantity-col">Quantité</th>
              <th class="description-col">Description</th>
              <th class="price-col">Prix unitaire</th>
              <th class="total-col">Total</th>
            </tr>
          </thead>
          <tbody>
            ${
              OrderData?.recieptStatus?.products?.length > 0
                ? OrderData.recieptStatus.products
                    .map((product) => {
                      const unitPrice =
                        Number(product.price).toFixed(2) || "0.00";
                      const totalPrice =
                        (
                          Number(product.price) * Number(product.quantity)
                        ).toFixed(2) || "0.00";

                      return `
                    <tr>
                      <td class="quantity-col">${product?.quantity || 0}</td>
                      <td class="description-col">
                        <div class="product-name">${
                          product?.product?.name || "Produit non disponible"
                        }</div>
                        ${
                          product?.product?.brand?.name
                            ? `<div class="product-size">${product.product.brand.name}</div>`
                            : ""
                        }
                        ${
                          product?.product?.size
                            ? `<div class="product-size">${product.product.size}</div>`
                            : ""
                        }
                      </td>
                      <td class="price-col">${new Intl.NumberFormat(
                        "fr-FR"
                      ).format(unitPrice)} DA</td>
                      <td class="total-col"><strong>${new Intl.NumberFormat(
                        "fr-FR"
                      ).format(totalPrice)} DA</strong></td>
                    </tr>
                  `;
                    })
                    .join("")
                : '<tr><td colspan="4" style="text-align: center;">Aucun produit disponible</td></tr>'
            }
            
            ${Array.from(
              {
                length: Math.max(
                  0,
                  6 - (OrderData?.recieptStatus?.products?.length || 0)
                ),
              },
              () => `
                <tr>
                  <td class="empty-row"></td>
                  <td class="empty-row"></td>
                  <td class="empty-row"></td>
                  <td class="empty-row"></td>
                </tr>
              `
            ).join("")}
            
            <!-- Subtotal Row -->
            <tr class="subtotal-row">
              <td colspan="3" class="label">SOUS-TOTAL</td>
              <td class="total-col"><strong>${new Intl.NumberFormat(
                "fr-FR"
              ).format(OrderData?.reciept?.total || 0)} DA</strong></td>
            </tr>
            
            ${
              OrderData?.reciept?.type == "delivery" &&
              OrderData?.reciept?.deliveryCost > 0
                ? `
            <!-- Delivery Fee Row -->
            <tr class="delivery-row">
              <td colspan="3" class="label">FRAIS DE LIVRAISON</td>
              <td class="total-col"><strong>${new Intl.NumberFormat(
                "fr-FR"
              ).format(OrderData?.reciept?.deliveryCost)} DA</strong></td>
            </tr>
            `
                : ""
            }
            
            <!-- Final Total Row -->
            <tr class="final-total-row">
              <td colspan="3" class="label">TOTAL TTC</td>
              <td class="value"><strong>${new Intl.NumberFormat("fr-FR").format(
                (OrderData?.reciept?.total || 0) +
                  (OrderData?.reciept?.deliveryCost || 0)
              )} DA</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      ${
        OrderData?.reciept?.payment && OrderData.reciept.payment.length > 0
          ? `
      <!-- Payment History -->
      <div class="payment-section">
        <h3 class="payment-title">Historique des Paiements</h3>
        
        <table class="payment-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            ${OrderData.reciept.payment
              .map(
                (payment) => `
              <tr>
                <td>${new Date(payment.date).toLocaleDateString("fr-FR")}</td>
                <td><strong>${new Intl.NumberFormat("fr-FR").format(
                  payment.amount
                )} DA</strong></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="payment-summary">
          <div style="margin-bottom: 5px;">
            <strong>Total Payé: ${new Intl.NumberFormat("fr-FR").format(
              OrderData.reciept.payment.reduce(
                (sum, pay) => sum + pay.amount,
                0
              )
            )} DA</strong>
          </div>
          <div class="remaining-amount">
            Reste à payer: ${new Intl.NumberFormat("fr-FR").format(
              (OrderData?.reciept?.total || 0) +
                (OrderData?.reciept?.deliveryCost || 0) -
                OrderData.reciept.payment.reduce(
                  (sum, pay) => sum + pay.amount,
                  0
                )
            )} DA
          </div>
        </div>
      </div>
      `
          : ""
      }

      <!-- Footer -->
      <div class="footer">
        <div class="footer-content">
          <div class="print-date">
            Date d'impression: ${new Date().toLocaleDateString("fr-FR")}
          </div>
          
          <div class="thank-you">
            Merci de votre confiance
          </div>
          
          <div class="company-name">
            MOSAGRO
          </div>
        </div>
      </div>
    </body>
  </html>
  `;

const generatePDF = async () => {
  try {
    // Generate the PDF file
    const file = await printToFileAsync({
      html: html,
      base64: false,
    });

    // Request media library permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "Pour enregistrer le PDF, nous avons besoin de l'autorisation d'accès au stockage. Voulez-vous partager le fichier à la place ?",
        [
          {
            text: "Annuler",
            style: "cancel",
          },
          {
            text: "Partager",
            onPress: async () => {
              try {
                await shareAsync(file.uri, {
                  UTI: ".pdf",
                  mimeType: "application/pdf",
                });
              } catch (shareError) {
                console.log("Share error:", shareError);
              }
            },
          },
        ]
      );
      return;
    }

    // Create the file name with timestamp
    const fileName = `Recu_${
      OrderData?.reciept?._id || "commande"
    }_${new Date().getTime()}.pdf`;

    // Define the destination path in the app's document directory
    const downloadDir = FileSystem.documentDirectory + fileName;

    // Copy file to app's document directory using legacy API
    await FileSystem.copyAsync({
      from: file.uri,
      to: downloadDir,
    });

    // Save to media library (this will make it accessible in Downloads/Files)
    const asset = await MediaLibrary.createAssetAsync(downloadDir);

    // Try to create/add to album
    try {
      const album = await MediaLibrary.getAlbumAsync("Download");
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync("Download", asset, false);
      }
    } catch (albumError) {
      // Album operations might fail, but file is still saved
      console.log("Album operation note:", albumError.message);
    }

    Alert.alert(
      "Succès",
      Platform.OS === "android"
        ? "Le reçu a été enregistré avec succès dans vos téléchargements."
        : "Le reçu a été enregistré avec succès.",
      [
        {
          text: "OK",
          onPress: () => console.log("PDF saved successfully"),
        },
      ]
    );
  } catch (error) {
    console.log("Error generating PDF:", error);

    // If saving fails, offer to share instead
    Alert.alert(
      "Erreur d'enregistrement",
      "Impossible d'enregistrer le fichier. Voulez-vous le partager à la place ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Partager",
          onPress: async () => {
            try {
              const file = await printToFileAsync({
                html: html,
                base64: false,
              });
              await shareAsync(file.uri, {
                UTI: ".pdf",
                mimeType: "application/pdf",
              });
            } catch (shareError) {
              console.log("Share error:", shareError);
              Alert.alert(
                "Erreur",
                "Une erreur est survenue. Veuillez réessayer."
              );
            }
          },
        },
      ]
    );
  }
};

  // Alternative Barcode Component using online service
  const BarcodeWrapper = ({ value, width, height }) => {
    // Validate the barcode value
    if (!value || typeof value !== "string" || value.trim() === "") {
      return (
        <View
          style={{
            width: width || 200,
            height: height || 100,
            backgroundColor: "#f0f0f0",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 12, color: "#888" }}>
            Code-barres indisponible
          </Text>
        </View>
      );
    }

    // Ensure width and height are valid numbers
    const validWidth = isNaN(width) ? 200 : width;
    const validHeight = isNaN(height) ? 100 : height;

    // Clean the value for barcode generation
    const cleanValue = value.toString().trim();

    // Use online barcode service - remove text display by setting ShowText=No
    const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(
      cleanValue
    )}&code=Code128&dpi=150&imagetype=Gif&ShowText=No`;

    return (
      <View
        style={{
          width: validWidth,
          height: validHeight,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
        }}
      >
        <Image
          source={{ uri: barcodeUrl }}
          style={{
            width: validWidth,
            height: validHeight,
            resizeMode: "contain",
          }}
          onError={() => {
            console.log("Barcode image failed to load");
          }}
        />
      </View>
    );
  };

  // Alternative: Simple styled text-based "barcode" component
  const TextBarcode = ({ value, width, height }) => {
    if (!value || typeof value !== "string" || value.trim() === "") {
      return (
        <View
          style={{
            width: width || 200,
            height: height || 80,
            backgroundColor: "#f0f0f0",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#ddd",
          }}
        >
          <Text style={{ fontSize: 12, color: "#888" }}>
            Code-barres indisponible
          </Text>
        </View>
      );
    }

    const cleanValue = value.toString().trim();

    return (
      <View
        style={{
          width: width || 200,
          height: height || 80,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
          borderWidth: 2,
          borderColor: "#19213D",
          padding: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 5,
          }}
        >
          {/* Simple visual bars representation */}
          {[...Array(20)].map((_, i) => (
            <View
              key={i}
              style={{
                width: Math.random() > 0.5 ? 2 : 1,
                height: 30,
                backgroundColor: "#000",
                marginHorizontal: 0.5,
              }}
            />
          ))}
        </View>
        <Text
          style={{
            fontSize: 12,
            color: "#19213D",
            fontFamily: "Montserrat-Regular",
            textAlign: "center",
          }}
        >
          {cleanValue}
        </Text>
      </View>
    );
  };

  //--------------------------------------------Rendering--------------------------------------------
  if (OrderDataLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={[styles.container, { marginHorizontal: horizontalPadding }]}
        >
          <View style={styles.containerLoadingtextScreen}>
            <ShimmerPlaceholder
              style={[styles.textScreen, { width: safeWidth * 0.6 }]}
            />
          </View>
          <CodeBar />
          <ArticleItem />
          <ArticleItem />
          <ArticleItem />
          <ArticleItem />
          <EReceiptDetailsShimmer />
        </View>
      </SafeAreaView>
    );
  }

  // Show error state if OrderID is invalid
  if (!validOrderID) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={[styles.container, { marginHorizontal: horizontalPadding }]}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.BackButton}
              onPress={() => router.navigate("/(tabs)/cart")}
            >
              <ArrowLeftIcon color="#19213D" size={18} />
            </TouchableOpacity>
            <Text style={styles.titleScreen}>E-Reçu</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Numéro de commande invalide</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.flatListContainer,
          {
            marginHorizontal: horizontalPadding,
            paddingBottom: bottomBarHeight + 10,
          },
        ]}
      >
        <FlatList
          data={OrderData?.recieptStatus?.products || []}
          keyExtractor={(item, index) =>
            item?.stock?.toString() || index.toString()
          }
          ListHeaderComponent={
            <>
              <View
                style={[
                  styles.headerContainer,
                  { marginBottom: verticalSpacing },
                ]}
              >
                <TouchableOpacity
                  style={styles.BackButton}
                  onPress={() => router.navigate("/(tabs)/cart")}
                >
                  <ArrowLeftIcon color="#19213D" size={18} />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.titleScreen,
                    {
                      fontSize: isSmallScreen ? 18 : isLargeScreen ? 24 : 20,
                    },
                  ]}
                >
                  E-Reçu
                </Text>
                <TrackButton
                  data={OrderData}
                  OrderDataRefetch={OrderDataRefetch}
                />
              </View>
              <View
                style={[
                  styles.barcodeContainer,
                  { marginBottom: verticalSpacing },
                ]}
              >
                {/* Choose one of these three options: */}

                {/* Option 1: Online barcode service (recommended) */}
                {validOrderID && !OrderDataLoading ? (
                  <BarcodeWrapper
                    value={validOrderID}
                    width={barcodeWidth}
                    height={isSmallScreen ? 70 : 80}
                  />
                ) : (
                  <View
                    style={{
                      width: barcodeWidth,
                      height: isSmallScreen ? 70 : 80,
                      backgroundColor: "#f0f0f0",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: "#888" }}>
                      {OrderDataLoading
                        ? "Chargement du code-barres..."
                        : "Code-barres indisponible"}
                    </Text>
                  </View>
                )}
              </View>
            </>
          }
          renderItem={({ item }) => (
            <CartRow
              ProductQuantity={item?.quantity}
              ProductName={item?.product?.name}
              ProductBrand={item?.product?.brand?.name}
              ProductImage={`${Config.FILES_URL}/${item?.product?.image || ""}`}
              BoxItems={item?.product?.boxItems}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun produit disponible</Text>
            </View>
          }
          ListFooterComponent={
            <EReceiptDetails
              OrderStoreName={OrderData?.reciept?.store?.storeName}
              OrderID={OrderData?.reciept?._id}
              OrderType={OrderData?.reciept?.type}
              OrderDeliveryAddress={
                OrderData?.reciept?.deliveredLocation?.address || null
              }
              OrderDate={OrderData?.reciept?.date}
              OrderStatus={OrderData?.reciept?.status}
              OrderSubTotal={OrderData?.reciept?.total}
              OrderDeliveryCharge={OrderData?.reciept?.deliveryCost}
              OrderDiscount={""}
            />
          }
        />
      </View>

      <View
        style={[
          styles.navigationClass,
          {
            height: bottomBarHeight,
            paddingBottom: Platform.OS === "android" ? insets.bottom / 1.5 : 0,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.downloadButton,
            {
              height: buttonHeight,
              width: buttonWidth,
            },
          ]}
          onPress={generatePDF}
        >
          <Text
            style={[
              styles.buttonText,
              {
                fontSize: isSmallScreen ? 14 : 16,
              },
            ]}
          >
            Télécharger le reçu électronique
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 10 : 3,
    height: "100%",
    position: "relative",
  },
  BackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#E3EFFF",
    borderWidth: 1,
  },
  container: {
    flexDirection: "column",
    gap: 16,
  },
  flatListContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  barcodeContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  containerLoadingtextScreen: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  textScreen: {
    height: 20,
    borderRadius: 4,
  },
  titleScreen: {
    fontFamily: "Montserrat-Regular",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderColor: "#888888",
    borderWidth: 0.5,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  navigationClass: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderColor: "#888888",
    borderWidth: 0.5,
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  downloadButton: {
    backgroundColor: "#19213D",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Montserrat-Regular",
  },
});

export default EReceiptScreen;
