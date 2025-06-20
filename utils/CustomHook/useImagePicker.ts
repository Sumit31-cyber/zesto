import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { ReactNativeFile } from "types/types";

export const useImagePicker = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ReactNativeFile>({
    name: "",
    type: "",
    uri: "",
  });

  const pickImage = async (options = {}) => {
    console.log("Run");
    try {
      setUploading(true);

      // Request permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      console.log(permissionResult);

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          "We need access to your photos to upload an image"
        );
        return null;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        // aspect: [4, 3],
        quality: 0.8,
      });

      console.log(pickerResult);

      if (!pickerResult.canceled && pickerResult.assets) {
        console.log("Not Cancled");
        const { fileName, type, uri } = pickerResult.assets[0];
        console.log(pickerResult.assets[0]);

        if (fileName && type && uri) {
          const imageData = {
            name: fileName,
            type: type,
            uri: uri,
          };

          setSelectedImage(imageData);

          return imageData;
        }
      }

      return null;
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick an image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage({
      name: "",
      type: "",
      uri: "",
    });
  };

  return {
    pickImage,
    clearImage,
    uploading,
    selectedImage,
    setSelectedImage,
  };
};
