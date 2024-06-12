import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export function AnimatedButton({ onPress, title }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        marginBottom: 10,
    },
    text: {
        fontSize: 18,
        color: "#FFFFFF",
    },
});
