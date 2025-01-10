import React from "react";
import {
    PaperProvider,
} from "react-native-paper";
import { useColorScheme } from "nativewind";
import { theme } from "../utils/theme";
function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { colorScheme } = useColorScheme();
    return <PaperProvider theme={colorScheme === 'dark' ? theme.dark : theme.light}>{children}</PaperProvider>;
}

export default ThemeProvider;
