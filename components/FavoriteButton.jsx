import { TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { HeartIcon as OutlineHeartIcon } from "react-native-heroicons/outline";
import { HeartIcon as SolidHeartIcon } from "react-native-heroicons/solid";
import Config from "../app/config";

const FavoriteButton = ({
  user,
  storeId,
  productId,
  isFavorite,
  setSnackbarKey,
  setSnackbarMessage,
  setSnackbarType,
}) => {
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  const submitFavorite = async () => {
    setSubmitionLoading(true);
    try {
      const response = await fetch(
        `${Config.API_URL}/Favorite/${user?.info?.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            store: storeId,
            product: productId,
          }),
        }
      );

      const json = await response.json();
      if (!response.ok) {
        setSubmitionLoading(false);
        setSnackbarType("error");
        setSnackbarMessage(json.message);
        setSnackbarKey((prevKey) => prevKey + 1);
        return;
      } else {
        setSubmitionLoading(false);
        setSnackbarType("success");
        setSnackbarMessage(json.message);
        setSnackbarKey((prevKey) => prevKey + 1);
        setFavorite(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitionLoading(false);
    }
  };
  const submitUnFavorite = async () => {
    setSubmitionLoading(true);
    try {
      const response = await fetch(
        `${Config.API_URL}/Favorite/${user?.info?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            store: storeId,
            product: productId,
          }),
        }
      );

      const json = await response.json();
      if (!response.ok) {
        setSubmitionLoading(false);
        setSnackbarType("error");
        setSnackbarMessage(json.message);
        setSnackbarKey((prevKey) => prevKey + 1);
        return;
      } else {
        setSubmitionLoading(false);
        setSnackbarType("success");
        setSnackbarMessage(json.message);
        setSnackbarKey((prevKey) => prevKey + 1);
        setFavorite(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitionLoading(false);
    }
  };

  return (
    <>
      {!submitionLoading ? (
        <TouchableOpacity
          style={styles.BackButton}
          onPress={favorite ? submitUnFavorite : submitFavorite}
        >
          {favorite ? (
            <SolidHeartIcon color="#63BBF5" size={18} />
          ) : (
            <OutlineHeartIcon color="#63BBF5" size={18} />
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.BackButton}>
          {favorite ? (
            <SolidHeartIcon color="#63BBF5" size={18} />
          ) : (
            <OutlineHeartIcon color="#63BBF5" size={18} />
          )}
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default FavoriteButton;
