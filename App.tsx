import ThemeProvider from "./src/lib/ThemeProvider";
import StoreProvider from "./src/lib/StoreProvider";
import { NavigationContainer } from "@react-navigation/native";
import "./global.css";
import {
  useFonts,
  Nunito_900Black,
  Nunito_800ExtraBold,
  Nunito_700Bold,
  Nunito_600SemiBold,
  Nunito_500Medium,
  Nunito_400Regular,
  Nunito_300Light,
} from "@expo-google-fonts/nunito";
import { StatusBar } from "expo-status-bar";
import { AlertNotificationRoot } from "react-native-alert-notification";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { enGB, registerTranslation } from "react-native-paper-dates";
import { useColorScheme } from "nativewind";
import StackNavigation from "./src/navigation/StackNavigation";
registerTranslation("en-GB", enGB);
import * as SecureStore from "expo-secure-store";
import { makeDir } from "./src/utils/FileSystem";
import { initDB } from "./src/utils/SqlSystem";

SplashScreen.preventAutoHideAsync();
export default function App() {
  const { colorScheme, setColorScheme } = useColorScheme();

  const setTheme = async () => {
    try {
      let theme: any = await SecureStore.getItemAsync("theme");
      console.log("theme", theme);
      if (theme) {
        setColorScheme(theme === "dark" ? "dark" : "light");
      } else {
        setColorScheme("light");
      }
    } catch (error) {
      await SecureStore.deleteItemAsync("theme");
      setTheme();
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setTheme();
        await makeDir().then(() => {
          initDB();
        });
      } catch (error) {
        console.error("Error during app initialization:", error);
      }
    };
    initializeApp();
  }, []);

  const [loaded, error] = useFonts({
    Nunito_900Black,
    Nunito_800ExtraBold,
    Nunito_700Bold,
    Nunito_600SemiBold,
    Nunito_500Medium,
    Nunito_400Regular,
    Nunito_300Light,
  });

  useEffect(() => {
    const task = async () => {
      if (loaded || error) {
        await SplashScreen.hideAsync();
      }
    };
    task();
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <StoreProvider>
      <ThemeProvider>
        <AlertNotificationRoot theme={colorScheme}>
          <StatusBar style={"auto"} />
          <NavigationContainer>
            <StackNavigation />
          </NavigationContainer>
        </AlertNotificationRoot>
      </ThemeProvider>
    </StoreProvider>
  );
}
