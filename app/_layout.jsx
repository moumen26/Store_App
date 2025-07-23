import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { Ionicons } from "@expo/vector-icons";
import "./../global.css";
import "core-js/stable/atob";
import { AuthContextProvider } from "./context/Authcontext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://eab083935172317d16868ec02d78fd4b@o4509713532846080.ingest.de.sentry.io/4509713538547792',
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],
});

const queryClient = new QueryClient();

// No Internet Component
const NoInternetScreen = () => {
  const [pulseAnim] = useState(new Animated.Value(1));
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  return (
    <View style={[styles.container, { width, height }]}>
      <View style={styles.backgroundPattern} />
      
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.iconContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <Ionicons name="wifi-outline" size={80} color="#6366f1" />
          <View style={styles.disconnectedLine} />
        </Animated.View>
        
        <Text style={styles.title}>No Internet Connection</Text>
        <Text style={styles.subtitle}>
          This application requires an active internet connection to function properly.
        </Text>
        
        <View style={styles.instructionsContainer}>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
            <Text style={styles.instructionText}>Check your Wi-Fi connection</Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
            <Text style={styles.instructionText}>Enable mobile data</Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
            <Text style={styles.instructionText}>Try again in a moment</Text>
          </View>
        </View>
        
        <View style={styles.loadingDots}>
          <Text style={styles.loadingText}>Checking connection</Text>
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
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
        console.error('Error checking network:', error);
        setIsConnected(false);
        setIsLoading(false);
      }
    };

    checkConnection();

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
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
        <Text style={styles.loadingText}>Loading...</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    position: 'relative',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
    backgroundColor: '#6366f1',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disconnectedLine: {
    position: 'absolute',
    width: 100,
    height: 3,
    backgroundColor: '#ef4444',
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Montserrat-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    maxWidth: 320,
    fontFamily: 'Montserrat-Regular',
  },
  instructionsContainer: {
    alignSelf: 'stretch',
    marginBottom: 48,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  instructionText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    fontFamily: 'Montserrat-Medium',
  },
  loadingDots: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
    fontFamily: 'Montserrat-Regular',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366f1',
    marginHorizontal: 4,
  },
  dot1: {
    animationDelay: '0s',
  },
  dot2: {
    animationDelay: '0.2s',
  },
  dot3: {
    animationDelay: '0.4s',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
});