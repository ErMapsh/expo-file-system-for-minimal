import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { BackHandler, Dimensions, StyleSheet, View } from "react-native";
import { Button, Text, withTheme } from "react-native-paper";
import NetInfo from "@react-native-community/netinfo";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setNetwork } from "../redux/features/NetworkStateSlice";
import { Image } from "react-native";

const { width, height } = Dimensions.get("window");
function RefreshPage({ theme, navigation }: any) {
  const [loader, setloader] = useState<boolean>(false);
  const dispatch = useDispatch();

  const refresh = useCallback(() => {
    setloader(true);
    NetInfo.refresh().then((state) => {
      // console.log("Connection type", state.type);
      // console.log("Is connected?", state.isConnected);
      dispatch(
        setNetwork({
          isConnected: state.isConnected ? Boolean(state.isConnected) : false,
          isInternetReachable: state.isInternetReachable
            ? Boolean(state.isInternetReachable)
            : false,
          setAlert: false,
        })
      );
      setTimeout(() => {
        setloader(false);
        if (state.isConnected) navigation.goBack();
      }, 1000);
    });
  }, []);

  useEffect(() => {
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-slate-100 dark:bg-slate-900">
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
          width: "70%",
          fontFamily: "Nunito_700Bold",
          textAlign: "center",
          fontSize: 20,
          color: theme.colors.primary,
          marginVertical: 30,
        }}
      >
        No Internet connection found Check your connection or Try to refresh
      </Text>
      <Button
        mode="contained"
        disabled={loader}
        contentStyle={{ paddingVertical: 5 }}
        style={{ width: "50%" }}
        labelStyle={{ fontFamily: "Nunito_700Bold" }}
        icon={"web-refresh"}
        onPress={refresh}
        loading={loader}
      >
        Retry
      </Button>
    </View>
  );
}

export default withTheme(RefreshPage);

const styles = StyleSheet.create({
  logo: {
    width: "70%",
    height: "30%",
  },
});
