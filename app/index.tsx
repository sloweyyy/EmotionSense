import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Card, Button, Text } from "@rneui/themed";
import { Picker } from "@react-native-picker/picker";

export default function EmotionSense() {
    const [image, setImage] = useState<string | null>(null);
    const [resultWithHOG, setResultWithHOG] = useState<string | null>(null);
    const [resultWithoutHOG, setResultWithoutHOG] = useState<string | null>(
        null
    );
    const [selectedModel, setSelectedModel] = useState<string>("svm");

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append("file", {
                uri: image!,
                type: "image/jpeg",
                name: "image.jpg",
            });

            const withHogResponse = await fetch(
                "http://172.16.31.50:6002/predict",
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Model-Key": `${selectedModel}_with_hog`,
                    },
                }
            );

            const withoutHogResponse = await fetch(
                "http://172.16.31.50:6002/predict",
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Model-Key": `${selectedModel}_without_hog`,
                    },
                }
            );

            if (withHogResponse.ok) {
                const emotionWithHog =
                    withHogResponse.headers.get("emotion") ||
                    "Error in prediction";
                setResultWithHOG(emotionWithHog);
            } else {
                setResultWithHOG("Error in prediction");
            }

            // Process Without HOG response
            if (withoutHogResponse.ok) {
                const emotionWithoutHog =
                    withoutHogResponse.headers.get("emotion") ||
                    "Error in prediction";
                setResultWithoutHOG(emotionWithoutHog);
            } else {
                setResultWithoutHOG("Error in prediction");
            }
        } catch (error) {
            console.error("Error predicting emotion:", error);
            setResultWithHOG("Error in prediction");
            setResultWithoutHOG("Error in prediction");
        }
    };

    const openImagePickerAsync = async () => {
        let permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.canceled === true) {
            return;
        }

        setImage(pickerResult.assets[0].uri);
    };

    const captureImageFromcCamera = async () => {
        let permissionResult =
            await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchCameraAsync();
        if (pickerResult.canceled === true) {
            return;
        }

        setImage(pickerResult.assets[0].uri);
    };

    return (
        <View style={styles.container}>
            <Card containerStyle={styles.cardContainer}>
                <Button
                    title="Pick an image from camera roll"
                    onPress={openImagePickerAsync}
                    buttonStyle={styles.button}
                />
                <Button
                    title="Take a photo with camera"
                    onPress={captureImageFromcCamera}
                    disabled={!image}
                    buttonStyle={styles.button}
                />
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedModel}
                        style={styles.picker}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedModel(itemValue)
                        }
                    >
                        <Picker.Item label="SVM" value="svm" />
                        <Picker.Item label="Decision Tree" value="dt" />
                        <Picker.Item label="Random Forest" value="rf" />
                    </Picker>
                </View>

                {image && (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: image }} style={styles.image} />
                        <View style={styles.resultContainer}>
                            <View style={styles.resultItem}>
                                <Text style={styles.resultText}>
                                    With HOG: {resultWithHOG}
                                </Text>
                            </View>
                            <View style={styles.resultItem}>
                                <Text style={styles.resultText}>
                                    Without HOG: {resultWithoutHOG}
                                </Text>
                            </View>
                        </View>
                        <Button
                            title="Predict Emotion"
                            onPress={handleUpload}
                            disabled={!image}
                            buttonStyle={styles.button}
                        />
                    </View>
                )}
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
    },
    cardContainer: {
        alignItems: "center",
        justifyContent: "center",

        padding: 50,
        margin: 20,
        borderRadius: 10,
    },
    pickerContainer: {
        marginVertical: 10,
    },
    picker: {
        width: 200,
    },
    imageContainer: {
        alignItems: "center",
        marginVertical: 10,
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: "contain",
    },
    resultContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "80%",
        marginTop: 10,
    },
    resultItem: {
        flex: 1,
        alignItems: "center",
    },
    resultText: {
        fontSize: 16,
    },
    button: {
        marginVertical: 10,
        backgroundColor: "black",
        borderRadius: 50,
    },
});
