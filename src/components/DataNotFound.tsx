import React from "react";
import { Dimensions, Text, View } from "react-native";
import { Icon } from "react-native-paper";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");
function DataNotFound({
  message,
  icon = "alert",
  color = "orange",
  height = 2,
}: {
  message: string;
  icon?: string;
  color?: string;
  height?: number;
}): React.JSX.Element {
  return (
    <View className="flex-1 items-center">
      <LottieView
        autoPlay
        style={{
          width: width / height,
          height: width / height,
        }}
        source={require("../../assets/lottie/404.json")}
      />
      <View className="flex-row justify-center items-center">
        <Text
          style={{ fontFamily: "Nunito_700Bold", fontSize: 18 }}
          className="text-black text-center dark:text-white me-2"
        >
          {message}
        </Text>
        <Icon source={icon} size={24} color={color} />
      </View>
    </View>
  );
}

export default DataNotFound;
