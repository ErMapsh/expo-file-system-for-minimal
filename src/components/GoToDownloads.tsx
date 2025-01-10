import { View, Text } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function GoToDownloads() {
  const navigation: any = useNavigation();
  return (
    <View className="flex-1 justify-center items-center">
      <LottieView
        autoPlay
        style={{
          width: 200,
          height: 200,
        }}
        source={require("../../assets/lottie/connection_lost.json")}
      />
      <Text
        style={{
          fontFamily: "Nunito_700Bold",
          textAlign: "center",
          fontSize: 20,
          color: "rgb(0, 104, 116)",
          margin: 30,
        }}
      >
        No Internet connection found
      </Text>
      <Button
        mode="contained"
        contentStyle={{ paddingVertical: 4, paddingHorizontal: 8 }}
        labelStyle={{ fontFamily: "Nunito_700Bold" }}
        style={{ borderRadius: 25 }}
        icon={"download-circle"}
        onPress={() => {
          navigation.navigate("DownloadVideo");
        }}
      >
        Go To Downloads
      </Button>
    </View>
  );
}
