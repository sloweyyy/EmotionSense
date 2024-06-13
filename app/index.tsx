import React, { useState } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button, Card } from "@rneui/themed";

export default function Index() {
    const [image, setImage] = useState(null);
    const [label, setLabel] = useState(null);

    const handlePrediction = async (image, withHOG) => {
        if (withHOG) {
            const response = await fetch('192.168.28.42:5000/predict_with_hog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageUri: image, withHOG: withHOG }),
            });
            const data = await response.json();
            setLabel(data.label);
        }
        else {
            const response = await fetch('192.168.28.42:5000/predict_without_hog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageUri: image, withHOG: withHOG }),
            });
            const data = await response.json();
            setLabel(data.label);
        }

        
    };

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status === "granted") {
            const result = await ImagePicker.launchCameraAsync();
            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        }
    };

    const openImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status === "granted") {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Card>
                <Card.Title>Select an Option</Card.Title>
                <Card.Divider />
                <Button
                    buttonStyle={styles.button}
                    onPress={openCamera}
                    title="Open Camera"
                />
                <Button
                    buttonStyle={styles.button}
                    onPress={openImagePicker}
                    title="Open Photo Gallery"
                />
            </Card>
            {image && (
                <Card>
                    <Image source={{ uri: image }} style={styles.image} />
                    <Text style={styles.label}>{label}</Text>
                    <Button
                        buttonStyle={styles.button}
                        onPress={() => handlePrediction(image, true)}
                        title="Predict with HOG"
                    />
                    <Button
                        buttonStyle={styles.button}
                        onPress={() => handlePrediction(image, false)}
                        title="Predict without HOG"
                    />
                </Card>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
    },
    button: {
        backgroundColor: "black",
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 30, 
        width: 200,
        marginHorizontal: 50,
        marginVertical: 10,
    },
    image: {
        width: 300,
        height: 300,
        marginVertical: 10,
    },
    label: {
        textAlign: "center",
        marginTop: 10,
        fontSize: 16,
    },
});
