import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import "./../global.css";
import "core-js/stable/atob";
import { AuthContextProvider } from "./context/Authcontext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://eab083935172317d16868ec02d78fd4b@o4509713532846080.ingest.de.sentry.io/4509713538547792",
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
});

const queryClient = new QueryClient();

// Enhanced NoInternetScreen Component
const NoInternetScreen = () => {
  const [pulseAnim] = useState(new Animated.Value(1));
  const [dotsAnim] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);
  const [isRetrying, setIsRetrying] = useState(false);
  const { width, height } = Dimensions.get("window");

  // French content only
  const content = {
    title: "Oups ! Pas d'Internet",
    subtitle:
      "Il semble que vous soyez hors ligne. Vérifiez votre connexion et réessayez.",
    wifi: "Wi-Fi",
    mobile: "Données mobiles",
    disconnected: "Déconnecté",
    checkSettings: "Vérifier les paramètres",
    checking: "Vérification de la connexion",
    tryAgain: "Réessayer",
    retrying: "Nouvelle tentative...",
  };

  useEffect(() => {
    // Logo pulse animation
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    // Dots loading animation
    const animateDots = () => {
      const animations = dotsAnim.map((dot, index) =>
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.timing(dot, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );

      Animated.parallel(animations).start(() => animateDots());
    };

    pulse();
    animateDots();
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      // Force a network check
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected && netInfo.isInternetReachable) {
        // Connection restored, the parent component will handle the state change
        console.log("Connection restored");
      }
    } catch (error) {
      console.error("Error retrying connection:", error);
    }

    // Reset retry state after 2 seconds
    setTimeout(() => {
      setIsRetrying(false);
    }, 2000);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "fr" : "en"));
  };

  return (
    <View style={[noInternetStyles.container, { width, height }]}>
      <StatusBar barStyle="light-content" backgroundColor="#19213D" />

      {/* Animated Background */}
      <LinearGradient
        colors={["#19213D", "#19213D", "#19213D"]}
        style={noInternetStyles.backgroundGradient}
      ></LinearGradient>

      <View style={noInternetStyles.content}>
        {/* Icon Container */}
        <Animated.View
          style={[
            noInternetStyles.logoContainer,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <View style={noInternetStyles.logoBackground}>
            <MaterialCommunityIcons name="wifi-off" size={60} color="#ef4444" />
          </View>
        </Animated.View>

        {/* Main Content */}
        <View style={noInternetStyles.textContainer}>
          <Text
            style={[noInternetStyles.title, { fontFamily: "Montserrat-Bold" }]}
          >
            {content.title}
          </Text>
          <Text
            style={[
              noInternetStyles.subtitle,
              { fontFamily: "Montserrat-Regular" },
            ]}
          >
            {content.subtitle}
          </Text>
        </View>

        {/* Connection Status Cards */}
        <View style={noInternetStyles.statusContainer}>
          <View style={noInternetStyles.statusCard}>
            <View style={noInternetStyles.statusIcon}>
              <Ionicons name="wifi" size={24} color="#64748b" />
            </View>
            <View style={noInternetStyles.statusContent}>
              <Text
                style={[
                  noInternetStyles.statusTitle,
                  { fontFamily: "Montserrat-Medium" },
                ]}
              >
                {content.wifi}
              </Text>
              <Text
                style={[
                  noInternetStyles.statusSubtitle,
                  { fontFamily: "Montserrat-Regular" },
                ]}
              >
                {content.disconnected}
              </Text>
            </View>
            <View style={noInternetStyles.statusIndicator} />
          </View>

          <View style={noInternetStyles.statusCard}>
            <View style={noInternetStyles.statusIcon}>
              <Ionicons name="cellular" size={24} color="#64748b" />
            </View>
            <View style={noInternetStyles.statusContent}>
              <Text
                style={[
                  noInternetStyles.statusTitle,
                  { fontFamily: "Montserrat-Medium" },
                ]}
              >
                {content.mobile}
              </Text>
              <Text
                style={[
                  noInternetStyles.statusSubtitle,
                  { fontFamily: "Montserrat-Regular" },
                ]}
              >
                {content.checkSettings}
              </Text>
            </View>
            <View style={noInternetStyles.statusIndicator} />
          </View>
        </View>

        {/* Loading indicator */}
        <View style={noInternetStyles.loadingContainer}>
          <Text
            style={[
              noInternetStyles.loadingText,
              { fontFamily: "Montserrat-Regular" },
            ]}
          >
            {content.checking}
          </Text>
          <View style={noInternetStyles.dotsContainer}>
            {dotsAnim.map((dot, index) => (
              <Animated.View
                key={index}
                style={[
                  noInternetStyles.loadingDot,
                  {
                    opacity: dot,
                    transform: [
                      {
                        scale: dot.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1.2],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Retry Button
        <TouchableOpacity
          style={[
            noInternetStyles.retryButton,
            isRetrying && noInternetStyles.retryButtonDisabled,
          ]}
          onPress={handleRetry}
          activeOpacity={0.8}
          disabled={isRetrying}
        >
          <LinearGradient
            colors={
              isRetrying ? ["#64748b", "#475569"] : ["#3b82f6", "#1d4ed8"]
            }
            style={noInternetStyles.retryButtonGradient}
          >
            <Ionicons
              name={isRetrying ? "hourglass" : "refresh"}
              size={20}
              color="white"
            />
            <Text
              style={[
                noInternetStyles.retryButtonText,
                { fontFamily: "Montserrat-Medium" },
              ]}
            >
              {isRetrying ? content.retrying : content.tryAgain}
            </Text>
          </LinearGradient>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default Sentry.wrap(function RootLayout() {
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useFonts({
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
  });

  useEffect(() => {
    // Check initial connection
    const checkConnection = async () => {
      try {
        const netInfo = await NetInfo.fetch();
        setIsConnected(netInfo.isConnected && netInfo.isInternetReachable);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking network:", error);
        setIsConnected(false);
        setIsLoading(false);
      }
    };

    checkConnection();

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Show loading or no internet screen
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text
          style={[styles.loadingText, { fontFamily: "Montserrat-Regular" }]}
        >
          Loading...
        </Text>
      </View>
    );
  }

  if (!isConnected) {
    return <NoInternetScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <Stack>
          {/* Unprotected Screens */}
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="StepInto/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Discover/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignIn/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignUp/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="VerifyCode/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ResetPassword/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="YourCart/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="YourOrders/index"
            options={{
              headerShown: false,
            }}
          />

          {/* Protected Screens */}
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Search/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TrackOrder/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Notifications/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="NotificationReaded/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ArchiveOrders/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="RequestStores/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="ScanBarCode/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="MyWishList/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="Store/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Brand/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="AllProducts/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="PopularProducts/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="Product/index"
            options={{
              headerShown: false,
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="MyCart/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="E-Receipt/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen
            name="ShippingAddress/index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
        </Stack>
      </AuthContextProvider>
    </QueryClientProvider>
  );
});

// Enhanced NoInternetScreen Styles
const noInternetStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#19213D",
  },
  backgroundGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#cbd5e1",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  statusContainer: {
    width: "100%",
    marginBottom: 40,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 2,
  },
  statusSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
  },
  loadingContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  loadingText: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 12,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
    marginHorizontal: 3,
  },
  retryButton: {
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  retryButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  retryButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

// Original loading styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    position: "relative",
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
    backgroundColor: "#6366f1",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  iconContainer: {
    position: "relative",
    marginBottom: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  disconnectedLine: {
    position: "absolute",
    width: 100,
    height: 3,
    backgroundColor: "#ef4444",
    transform: [{ rotate: "45deg" }],
    borderRadius: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "Montserrat-Bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    maxWidth: 320,
    fontFamily: "Montserrat-Regular",
  },
  instructionsContainer: {
    alignSelf: "stretch",
    marginBottom: 48,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  instructionText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
    fontFamily: "Montserrat-Medium",
  },
  loadingDots: {
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 16,
    fontFamily: "Montserrat-Regular",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6366f1",
    marginHorizontal: 4,
  },
  dot1: {
    animationDelay: "0s",
  },
  dot2: {
    animationDelay: "0.2s",
  },
  dot3: {
    animationDelay: "0.4s",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
});
