import { useAuthContext } from "./useAuthContext";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useLogout = () => {
    const { dispatch } = useAuthContext();
    const navigation = useNavigation();

    const logout = async () => {
        try{
            //remove the user from async storage
            await AsyncStorage.removeItem("user");
            console.log("User successfully removed from AsyncStorage.");
            //dispatch the logout action
            dispatch({type: 'LOGOUT'});
            console.log("Logout action dispatched.");
            //redirect
            // navigation.reset({index: 0, routes: [{ name: "SignIn/index" }],});
        }catch(error){
            console.error("Error during user logout:", error);
        }
    }
    return {logout};
}

export default useLogout;
