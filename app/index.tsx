import { Text, View, Button, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, {useState} from "react";

export default function Index() {
  const [image, setImage] = useState(null);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) {
        setImage(result.assets[0].uri); // Truy cập đến uri của ảnh được chọn
        console.log(result.assets[0].uri);
      }
    }
  };

  const openImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        setImage(result.assets[0].uri); // Truy cập đến uri của ảnh được chọn
        console.log(result.assets[0].uri);
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity onPress={openCamera}>
        <Text>Open Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={openImagePicker}>
        <Text>Upload Image</Text>
      </TouchableOpacity>
      {image && (
        <>
          <Image source={{ uri: image }} style={{ width: 500, height: 500 }} />
          <Text>Label below the image</Text>
        </>
      )}
    </View>
  );
}
