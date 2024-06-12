import { Stack } from "expo-router";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";

export default function RootLayout() {
    return (
        <ThemeProvider value={DarkTheme}>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{ headerShown: true, title: "Home" }}
                />
            </Stack>
        </ThemeProvider>
    );
}
