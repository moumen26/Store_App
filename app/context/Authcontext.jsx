import React, { createContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from 'expo-router';
import decodeJWT from "../util/tokenDecoder";

export const AuthContext = createContext();

// Helper function to save cart to AsyncStorage
const saveCartToStorage = async (cart) => {
  try {
    await AsyncStorage.setItem("cart", JSON.stringify(cart || []));
  } catch (error) {
    console.error("Error saving cart to AsyncStorage:", error);
  }
};

// Helper function to load cart from AsyncStorage
const loadCartFromStorage = async () => {
  try {
    const cartData = await AsyncStorage.getItem("cart");
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error("Error loading cart from AsyncStorage:", error);
    return [];
  }
};

// Helper function to clear cart from AsyncStorage
const clearCartFromStorage = async () => {
  try {
    await AsyncStorage.removeItem("cart");
  } catch (error) {
    console.error("Error clearing cart from AsyncStorage:", error);
  }
};

const AuthReducer = (state, action) => {
  let newState;
  
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
      
    case "LOGOUT":
      // Clear cart when logging out
      clearCartFromStorage();
      return { ...state, user: null, cart: [] };
      
    case "SET_ONBOARDING_STATE":
      return { 
        ...state, 
        hasSeenStepInto: action.payload.hasSeenStepInto,
        hasSeenDiscover: action.payload.hasSeenDiscover,
        hasSeenYourCart: action.payload.hasSeenYourCart,
        hasSeenYourOrders: action.payload.hasSeenYourOrders,
        onboardingCompleted: action.payload.onboardingCompleted
      };
      
    case "LOAD_CART":
      return { ...state, cart: action.payload || [] };
      
    case "UPDATE_USER":
      if (action.payload?.token) {
        AsyncStorage.setItem("user", JSON.stringify(action.payload));
      }
      return { 
        ...state, 
        user: action.payload 
      };
      
    case "ADD_TO_CART": {
      const existingProducts = (state.cart || []).filter(
        (item) =>
          item.stock === action.payload.stock && 
          item.store === action.payload.store
      );        
      
      if (existingProducts?.length > 0) {
        const updatedCart = state.cart?.map((item) =>
          item.stock === action.payload.stock && 
          item.store === action.payload.store
            ? {
                ...item,
                quantity: item.quantity + action.payload.quantity,
                price: item.price + action.payload.price,
                buyingMathode: action.payload.buyingMathode === 'unity' 
                  ? action.payload.buyingMathode 
                  : item.buyingMathode,
              }
            : item
        );
        newState = { ...state, cart: updatedCart };
      } else {
        newState = {
          ...state,
          cart: [...(state.cart || []), action.payload],
        };
      }
      
      // Save to AsyncStorage
      saveCartToStorage(newState.cart);
      return newState;
    }
    
    case "UPDATE_CART":
      newState = { 
        ...state, 
        cart: (state.cart || []).map(item =>
          item.stock === action.payload.stock && item.store === action.payload.storeId
            ? { ...item, ...action.payload } 
            : item
        ),
      };
      
      // Save to AsyncStorage
      saveCartToStorage(newState.cart);
      return newState;
      
    case "REMOVE_FROM_CART":
      newState = { 
        ...state, 
        cart: (state.cart || []).filter(item => !(item.stock === action.payload.stock && item.store === action.payload.storeId)) 
      };
      
      // Save to AsyncStorage
      saveCartToStorage(newState.cart);
      return newState;
      
    case "REMOVE_ALL_CART":
      newState = {
        ...state,
        cart: (state.cart || []).filter(item => item.store !== action.payload),
      };
      
      // Save to AsyncStorage
      saveCartToStorage(newState.cart);
      return newState;
      
    case "ADD_TO_CART_ADDRESS":
      newState = {
        ...state,
        cart: (state.cart || []).map(item => (
          item.store === action.payload.storeId 
          ? { ...item, shippingAddress: action.payload.selectedAddress }
          : item
        )),
      };
      
      // Save to AsyncStorage
      saveCartToStorage(newState.cart);
      return newState;
      
    case "CLEAR_CART":
      clearCartFromStorage();
      return { ...state, cart: [] };
      
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, { 
    user: null, 
    cart: [], 
    hasSeenStepInto: null,
    hasSeenDiscover: null,
    hasSeenYourCart: null,
    hasSeenYourOrders: null,
    onboardingCompleted: null
  });
  const router = useRouter();
  const segments = useSegments();

  // Load cart from AsyncStorage on app start
  useEffect(() => {
    const loadPersistedCart = async () => {
      try {
        const savedCart = await loadCartFromStorage();
        if (savedCart.length > 0) {
          dispatch({ type: "LOAD_CART", payload: savedCart });
        }
      } catch (error) {
        console.error("Error loading persisted cart:", error);
      }
    };

    loadPersistedCart();
  }, []);

  useEffect(() => {
    const handleNavigation = async () => {
      try {
        // // Set onboarding state false
        // await AsyncStorage.setItem("hasSeenStepInto", "false");
        // await AsyncStorage.setItem("hasSeenDiscover", "false");
        // await AsyncStorage.setItem("hasSeenYourCart", "false");
        // await AsyncStorage.setItem("hasSeenYourOrders", "false");
        // await AsyncStorage.setItem("onboardingCompleted", "false");
        // console.log("Onboarding state reset to false");

        // Check onboarding status for all screens
        const hasSeenStepInto = await AsyncStorage.getItem("hasSeenStepInto");
        const hasSeenDiscover = await AsyncStorage.getItem("hasSeenDiscover");
        const hasSeenYourCart = await AsyncStorage.getItem("hasSeenYourCart");
        const hasSeenYourOrders = await AsyncStorage.getItem("hasSeenYourOrders");
        const onboardingCompleted = await AsyncStorage.getItem("onboardingCompleted");

        
        
        dispatch({ 
          type: "SET_ONBOARDING_STATE", 
          payload: { 
            hasSeenStepInto: hasSeenStepInto === "false",
            hasSeenDiscover: hasSeenDiscover === "false",
            hasSeenYourCart: hasSeenYourCart === "false",
            hasSeenYourOrders: hasSeenYourOrders === "false",
            onboardingCompleted: onboardingCompleted === "false"
          }
        });

        // If onboarding is completed, check authentication directly
        if (onboardingCompleted === "true") {
          const userData = await AsyncStorage.getItem("user");
          
          if (!userData) {
            dispatch({ type: "LOGOUT" });
            // Don't redirect if already on auth screens
            if (segments[0] === 'SignIn' || segments[0] === 'SignUp' || segments[0] === 'ResetPassword') {
              return;
            }
            router.push('/SignIn');
            return;
          }
          
          const user = JSON.parse(userData);
          const decodedToken = decodeJWT(user.token);
          
          if (decodedToken.exp * 1000 > Date.now()) {
            dispatch({ type: "LOGIN", payload: user });
            
            const currentRoute = segments[0];
            
            // Check if we're on onboarding or auth screens that should redirect
            const shouldRedirectToHome = 
              !currentRoute || // Empty/index route
              currentRoute === 'index' ||
              currentRoute === 'SignIn' ||
              currentRoute === 'SignUp' ||
              currentRoute === 'ResetPassword' ||
              currentRoute === 'StepInto' ||
              currentRoute === 'Discover' ||
              currentRoute === 'YourCart' ||
              currentRoute === 'YourOrders';
            
            if (shouldRedirectToHome) {
              router.push('/(tabs)/home');
            }
          } else {
            // Token expired
            await AsyncStorage.removeItem("user");
            dispatch({ type: "LOGOUT" });
            if (segments[0] !== 'SignIn') {
              router.push('/SignIn');
            }
          }
          return;
        }

        // Onboarding flow logic (unchanged)
        if (hasSeenStepInto !== "true") {
          if (segments[0] !== 'StepInto') {
            router.push('/StepInto');
          }
          return;
        }

        const currentScreen = segments[0];
        
        let nextUnseenScreen = null;
        if (hasSeenDiscover !== "true") {
          nextUnseenScreen = 'Discover';
        } else if (hasSeenYourCart !== "true") {
          nextUnseenScreen = 'YourCart';
        } else if (hasSeenYourOrders !== "true") {
          nextUnseenScreen = 'YourOrders';
        } else {
          nextUnseenScreen = 'SignIn';
        }

        const allowedScreens = ['StepInto'];
        if (hasSeenDiscover === "true") allowedScreens.push('Discover');
        if (hasSeenYourCart === "true") allowedScreens.push('YourCart');
        if (hasSeenYourOrders === "true") allowedScreens.push('YourOrders');
        
        if (nextUnseenScreen) allowedScreens.push(nextUnseenScreen);

        if (!allowedScreens.includes(currentScreen)) {
          router.push(`/${nextUnseenScreen}`);
          return;
        }

        if (currentScreen === 'index' && nextUnseenScreen) {
          router.push(`/${nextUnseenScreen}`);
          return;
        }

      } catch (error) {
        console.error("Error during navigation handling:", error);
        await AsyncStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
        router.push('/SignIn');
      }
    };

    handleNavigation();
  }, [router, segments, dispatch]);

  // Function to mark StepInto as seen
  const markStepIntoAsSeen = async () => {
    try {
      await AsyncStorage.setItem("hasSeenStepInto", "true");
      dispatch({ 
        type: "SET_ONBOARDING_STATE", 
        payload: { 
          hasSeenStepInto: true,
          hasSeenDiscover: state.hasSeenDiscover,
          hasSeenYourCart: state.hasSeenYourCart,
          hasSeenYourOrders: state.hasSeenYourOrders,
          onboardingCompleted: state.onboardingCompleted
        }
      });
    } catch (error) {
      console.error("Error marking StepInto as seen:", error);
    }
  };

  // Function to mark Discover as seen
  const markDiscoverAsSeen = async () => {
    try {
      await AsyncStorage.setItem("hasSeenDiscover", "true");
      dispatch({ 
        type: "SET_ONBOARDING_STATE", 
        payload: { 
          hasSeenStepInto: state.hasSeenStepInto,
          hasSeenDiscover: true,
          hasSeenYourCart: state.hasSeenYourCart,
          hasSeenYourOrders: state.hasSeenYourOrders,
          onboardingCompleted: state.onboardingCompleted
        }
      });
    } catch (error) {
      console.error("Error marking Discover as seen:", error);
    }
  };

  // Function to mark YourCart as seen
  const markYourCartAsSeen = async () => {
    try {
      await AsyncStorage.setItem("hasSeenYourCart", "true");
      dispatch({ 
        type: "SET_ONBOARDING_STATE", 
        payload: { 
          hasSeenStepInto: state.hasSeenStepInto,
          hasSeenDiscover: state.hasSeenDiscover,
          hasSeenYourCart: true,
          hasSeenYourOrders: state.hasSeenYourOrders,
          onboardingCompleted: state.onboardingCompleted
        }
      });
    } catch (error) {
      console.error("Error marking YourCart as seen:", error);
    }
  };

  // Function to mark YourOrders as seen
  const markYourOrdersAsSeen = async () => {
    try {
      await AsyncStorage.setItem("hasSeenYourOrders", "true");
      dispatch({ 
        type: "SET_ONBOARDING_STATE", 
        payload: { 
          hasSeenStepInto: state.hasSeenStepInto,
          hasSeenDiscover: state.hasSeenDiscover,
          hasSeenYourCart: state.hasSeenYourCart,
          hasSeenYourOrders: true,
          onboardingCompleted: state.onboardingCompleted
        }
      });
    } catch (error) {
      console.error("Error marking YourOrders as seen:", error);
    }
  };

  // Function to complete all onboarding
  const completeAllOnboarding = async () => {
    try {
      await AsyncStorage.setItem("hasSeenStepInto", "true");
      await AsyncStorage.setItem("hasSeenDiscover", "true");
      await AsyncStorage.setItem("hasSeenYourCart", "true");
      await AsyncStorage.setItem("hasSeenYourOrders", "true");
      await AsyncStorage.setItem("onboardingCompleted", "true");
      
      dispatch({ 
        type: "SET_ONBOARDING_STATE", 
        payload: { 
          hasSeenStepInto: true,
          hasSeenDiscover: true,
          hasSeenYourCart: true,
          hasSeenYourOrders: true,
          onboardingCompleted: true
        }
      });
    } catch (error) {
      console.error("Error completing all onboarding:", error);
    }
  };

  // Function to manually clear cart (useful for logout or order completion)
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  // Function to get cart item count
  const getCartItemCount = () => {
    return (state.cart || []).reduce((total, item) => total + item.quantity, 0);
  };

  // Function to get cart total price
  const getCartTotal = () => {
    return (state.cart || []).reduce((total, item) => total + item.price, 0);
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      cart: state.cart || [], 
      dispatch,
      markStepIntoAsSeen,
      markDiscoverAsSeen,
      markYourCartAsSeen,
      markYourOrdersAsSeen,
      completeAllOnboarding,
      clearCart,
      getCartItemCount,
      getCartTotal,
      hasSeenStepInto: state.hasSeenStepInto,
      hasSeenDiscover: state.hasSeenDiscover,
      hasSeenYourCart: state.hasSeenYourCart,
      hasSeenYourOrders: state.hasSeenYourOrders,
      onboardingCompleted: state.onboardingCompleted
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;