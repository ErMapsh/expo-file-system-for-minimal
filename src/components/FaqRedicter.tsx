import { TouchableOpacity } from "react-native";
import React, { useCallback } from "react";
import { Icon } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { os } from "../constants/Platform";

export default function FaqRedicter({ visible }: { visible: boolean }) {
  const navigation: any = useNavigation();
  const rediect = () => {
    navigation.navigate("Question");
  };
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={rediect}
      style={{
        position: "absolute",
        bottom: os === "android" ? 10 : 20,
        display: visible ? "flex" : "none",
        right: 5,
        width: 80,
        height: 80,
        padding: 30,
        justifyContent: "center",
        alignItems: "center",
        // borderRadius: 13,
        // backgroundColor: "rgb(0, 104, 116)",
      }}
    >
      <Icon source={require("../../assets/icons/survey.png")} size={75} />
    </TouchableOpacity>
  );
}
