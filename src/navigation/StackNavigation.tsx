import React, { memo } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VideoDetails from "../screens/Dashboard/Utilities/VideoDetails";
import VideoPlayer from "../screens/Dashboard/Utilities/VideoPlayer";
import { withTheme } from "react-native-paper";
import { theme as _theme } from "../utils/common";

const Stack = createNativeStackNavigator();
function StackNavigation({ theme }: any) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="VideoDetails"
        component={VideoDetails}
        options={{
          headerBackTitleVisible: false,
          headerShown: true,
          headerTitle: "",
          headerTintColor: "white",
          headerTransparent: true,
          animationTypeForReplace: "push",
          animation: "slide_from_right",
        }}
      />

      <Stack.Screen
        name="VideoPlayer"
        component={VideoPlayer}
        options={{
          headerShown: false,
          animationTypeForReplace: "push",
          animation: "slide_from_right",
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default memo(withTheme(StackNavigation));
