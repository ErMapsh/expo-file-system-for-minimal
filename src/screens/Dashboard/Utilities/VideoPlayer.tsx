import React, { useEffect, useState, memo, useRef } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  Animated,
  BackHandler,
} from "react-native";
import { WebView } from "react-native-webview";
import { withTheme, Button } from "react-native-paper";
import * as ScreenOrientation from "expo-screen-orientation";
import DataNotFound from "../../../components/DataNotFound";
import { os } from "../../../constants/Platform";

const VideoPlayer = ({ route, theme, navigation }: any) => {
  const videoRef = useRef(null);
  const [ISTStartTime] = useState(new Date());
  const { data, module, body, userid, downloadState } = route.params;
  const [loader, setloader] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [paused, setpaused] = useState(false);
  const opacity = useRef<any>(new Animated.Value(0)).current;
  const [playtime, setPlaytime] = useState<string | undefined>(undefined);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: showButton ? 1 : 0,
      duration: 1400,
      useNativeDriver: true,
    }).start();
  }, [showButton]);

  const LANDSCAPE = async () => {
    try {
      await ScreenOrientation.unlockAsync();
      if (data.videoUrl) {
        setTimeout(async () => {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
          );
        }, 100);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const PORTRAIT = async () => {
    try {
      // await ScreenOrientation.unlockAsync();
      if (data.videoUrl) {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        );
      }
    } catch (error) {
      if (data.videoUrl) {
        console.log("error", error);
        await ScreenOrientation.unlockAsync();
      }
    }
  };

  useEffect(() => {
    LANDSCAPE();
    console.warn("data in videoplayer", data, downloadState);
    return () => {
      PORTRAIT();
    };
  }, [data]);

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

  const id = 198;

  const Goback = async () => {
    PORTRAIT();
    navigation.goBack();
  };

  const onPlayblack = async (status: any) => {
    console.log(status);
    setPlaytime(status.playableDurationMillis);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: theme.colors.onSurface,
      }}
    >
      <StatusBar hidden={true} />
      <Animated.View
        style={{
          position: "absolute",
          top: "3%",
          left: "13%",
          zIndex: 10000,
          borderRadius: 5,
          padding: 10,
          opacity: opacity,
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "absolute",
            top: "3%",
            left: "13%",
            zIndex: 10000,
            borderRadius: 5,
            padding: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ marginHorizontal: "auto", paddingHorizontal: 15 }}>
              <Text style={styles.text}>{data.author}</Text>
              <Text style={[styles.text, { fontSize: 11 }]}>{data.title}</Text>
            </View>
            <Button
              style={{ marginLeft: 30, borderRadius: 4 }}
              textColor="white"
              mode="contained"
              onPress={Goback.bind(this)}
              loading={loader}
              disabled={loader}
            >
              End Session
            </Button>
          </View>
        </View>
      </Animated.View>
      {data.videoUrl ? (
        <WebView
          allowFileAccess={true}
          setDisplayZoomControls={false}
          allowsFullscreenVideo={false}
          useWebView2={true}
          ref={videoRef}
          style={{ marginTop: os == "ios" ? 20 : 0 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{ uri: data.videoUrl }}
          startInLoadingState={true}
          onMessage={(event) => console.log(event.nativeEvent.data)}
          mixedContentMode={"never"}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <DataNotFound message="Video not found" />
      )}
    </View>
  );
};

export default memo(withTheme(VideoPlayer));

const styles = StyleSheet.create({
  text: {
    fontFamily: "Nunito_700Bold",
    color: "white",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },
  video: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    height: "100%",
  },
});
