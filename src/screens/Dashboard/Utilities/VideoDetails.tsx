import React, { memo, useEffect, useState, useRef, useCallback } from "react";
import { withTheme, Button, Icon, Dialog, Portal } from "react-native-paper";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  AppState,
} from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { IoniconsIcon } from "../../../components/icons/Ionics";
import { theme as _theme, blurhash } from "../../../utils/common";
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system";
import { useColorScheme } from "nativewind";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { baseFolder, DeleteVideo, fileName } from "../../../utils/FileSystem";
import {
  addVideo,
  setOfflineDatatoView,
  updatePercentage,
  updateVideoState,
  updateWhenDownloadComplete,
} from "../../../redux/features/OfflineVideoStateSlice";

import { throttle } from "lodash";
import {
  addFileRecord,
  getDoneRecords,
  getRecordByContentId,
  removeFileRecord,
  updateDownloadState,
  updateOnDownloadComplete,
  updateWhenPauseDownloadState,
} from "../../../utils/SqlSystem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { os } from "../../../constants/Platform";

const { width } = Dimensions.get("window");
const VideoDetails = ({ theme, navigation, route }: any) => {
  const { colorScheme } = useColorScheme();
  const dispatch: AppDispatch = useDispatch();
  const bottomSheetRef: any = useRef<BottomSheet>();
  const data: any = {
    id: 182,
    title: "Getting Started",
    author: "Jamie Magruder",
    imageUrl:
      "https://docexa.blob.core.windows.net/goroga/thumbnail/goroga - intro image.jpg",
    videoUrl:
      "https://docexa.blob.core.windows.net/goroga-final/welcome-to-roga/welcome to roga/what is roga.mp4",
    description: null,
    duration: "5 min",
    createdAt: "2024-05-07 00:00:00",
    updatedAt: "2024-05-07 00:00:00",
  };

  const [deleteDownload, setdeleteDownload] = useState(false);
  const [bottomsheetindex, setBottomsheetindex] = useState(-1);
  const id = 198;

  const [loader, setloader] = useState<boolean>(false);
  const { videos } = useSelector((state: RootState) => state.offlinevideo);

  const snapPoints = React.useMemo(
    () => [os === "android" ? "18%" : "28%"],
    []
  );

  const handleSheetChanges = useCallback((index: number) => {
    setBottomsheetindex(index);
  }, []);

  const throttledDispatch = throttle((progress: number) => {
    dispatch(
      updatePercentage({
        id: data.id,
        percentage: progress,
      })
    );
  }, 1000);

  useEffect(() => {
    console.log(
      "----videos-----",
      videos[data?.id] ? videos[data?.id] : videos
    );
    return () => {
      setBottomsheetindex(-1);
    };
  }, [videos]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        nextAppState === "background" &&
        videos[data.id]?.downloadState == "DOWNLOADING"
      ) {
        PauseDownloading();
      }
    });

    return () => subscription.remove();
  }, [videos[data.id]]);

  useEffect(() => {
    if (videos[data.id]?.downloadState == "DONE") {
      bottomSheetRef?.current?.close();
    }
  }, [videos[data.id]?.downloadState]);

  useEffect(() => {
    const Run = async () => {
      try {
        const content: any = await getRecordByContentId(data.id);
        if (content) {
          if (content.downloadState == "DONE") {
            data.videoUrl = content?.videoPath;
          }
          console.warn("----content from table: ---", content);
          const fileContent = {
            id: content.content_id, // content id
            fileName: content?.fileName,
            downloadState: content?.downloadState,
            videoPath: content?.videoPath,
            imgPath: content?.imgPath,
            percentage: Number(content?.percentage),
            metadata: JSON.parse(content?.metadata),
          };
          dispatch(addVideo(fileContent));
        } else {
          const temp = fileName(data.videoUrl);
          const fileContent = {
            id: data.id,
            fileName: temp,
            downloadState: "DOWNLOAD" as any,
            videoPath: undefined,
            imgPath: undefined,
            percentage: 0,
            metadata: data,
          };
          dispatch(addVideo(fileContent));
        }
      } catch (error) {
        console.log("errror", error);
      }
    };
    Run();
    return () => {};
  }, []);

  const callback = (downloadProgress: FileSystem.DownloadProgressData) => {
    const progress =
      (downloadProgress.totalBytesWritten /
        downloadProgress.totalBytesExpectedToWrite) *
      100;
    throttledDispatch(progress);
    console.log(`progress for video id ${data.id}: ${progress}`);
  };

  const downloadResumable = useRef(
    FileSystem.createDownloadResumable(
      data.videoUrl,
      `${baseFolder}/${fileName(data.videoUrl)}`,
      {
        cache: true,
      },
      callback
    )
  );

  const handleDownload = useCallback(async () => {
    try {
      if (videos[data.id]?.downloadState === "DOWNLOAD") {
        /* update the first in redux and then entry in sql table at first time */
        // dispatch(
        //   updateVideoState({ id: data.id, downloadState: "DOWNLOADING" })
        // );
        const fileContent = {
          id: data.id,
          fileName: fileName(data.videoUrl) || "NA",
          downloadState: "DOWNLOADING" as any,
          videoPath: undefined,
          imgPath: undefined,
          percentage: 0,
          metadata: JSON.stringify(data),
        };
        console.error("filecontnent", fileContent);
        dispatch(addVideo(fileContent));
        addFileRecord(fileContent);
        updateDownloadState({ id: data.id, newState: "DOWNLOADING" });
        const res: FileSystem.FileSystemDownloadResult | undefined =
          await downloadResumable?.current?.downloadAsync();
        console.warn("res in handledonwload:", res?.uri);

        if (res?.uri) {
          dispatch(
            updateWhenDownloadComplete({ id: data.id, videoPath: res?.uri })
          );
          updateOnDownloadComplete({
            id: data.id,
            videoPath: res?.uri,
          });
          await getDoneRecords().then((value: any[]) => {
            dispatch(setOfflineDatatoView(value));
          });
        }
      } else if (
        videos[data.id]?.downloadState === "DOWNLOADING" ||
        videos[data.id]?.downloadState === "PAUSED"
      ) {
        bottomSheetRef.current?.expand();
      } else if (videos[data.id]?.downloadState === "DONE") {
        setdeleteDownload(data.id);
      } else {
        console.error("downloadState not defind");
      }
    } catch (error) {
      console.log("error--->", error);
      deleteOperation();
    }
  }, [videos]);

  const PauseDownloading = useCallback(async () => {
    try {
      // CancelDownloading()
      if (downloadResumable.current) {
        // CancelDownloading(); // issue in pause and resume, file beign courrpt
        await downloadResumable?.current.pauseAsync().then(() => {
          const saved = downloadResumable?.current?.savable();
          console.warn("saved", saved);
          AsyncStorage.setItem(
            videos[data.id]?.fileName,
            JSON.stringify(saved)
          );
          dispatch(updateVideoState({ id: data.id, downloadState: "PAUSED" }));
          updateWhenPauseDownloadState({
            id: data.id,
            newState: "PAUSED",
            percentage: videos[data.id]?.percentage?.toString(),
          });
          bottomSheetRef.current?.close();
        });
      }
    } catch (e) {
      console.error("Pause error:", e);
    }
  }, [videos]);

  const ResumeDownloading = useCallback(async () => {
    try {
      const downloadSnapshotJson: any = await AsyncStorage.getItem(
        videos[data.id]?.fileName
      );
      console.warn("downloadSnapshotJson", downloadSnapshotJson);
      if (downloadSnapshotJson) {
        const downloadSnapshot = JSON.parse(downloadSnapshotJson);
        downloadResumable.current = new FileSystem.DownloadResumable(
          downloadSnapshot.url,
          downloadSnapshot.fileUri,
          downloadSnapshot.options,
          callback,
          downloadSnapshot.resumeData
        );
        dispatch(
          updateVideoState({ id: data.id, downloadState: "DOWNLOADING" })
        );
        updateDownloadState({ id: data.id, newState: "DOWNLOADING" });
        bottomSheetRef.current?.close();
        const res: FileSystem.FileSystemDownloadResult | undefined =
          await downloadResumable?.current?.resumeAsync();
        if (res?.uri) {
          dispatch(
            updateWhenDownloadComplete({ id: data.id, videoPath: res?.uri })
          );
          updateOnDownloadComplete({
            id: data.id,
            videoPath: res?.uri,
          });
          // data.videoUrl = res?.uri;

          /* remove the pause data from localstorage */
          await AsyncStorage.removeItem(videos[data.id]?.fileName);
          await getDoneRecords().then((value: any[]) => {
            // console.log("value", value);
            dispatch(setOfflineDatatoView(value));
          });
        }
      }
    } catch (error) {
      console.error("Resume error:", error);
    }
  }, [videos]);

  const CancelDownloading = useCallback(async () => {
    try {
      if (downloadResumable.current) {
        await downloadResumable?.current
          ?.cancelAsync()
          .then(() => {
            bottomSheetRef.current?.close();
            dispatch(
              updateVideoState({ id: data.id, downloadState: "DOWNLOAD" })
            );
            deleteOperation();
          })
          .catch((error) => {
            console.log("error", error);
          });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const deleteOperation = useCallback(() => {
    try {
      DeleteVideo(fileName(data?.videoUrl)).then(async () => {
        data.videoUrl = videos[data.id]?.metadata?.videoUrl;
        setdeleteDownload(false);
        dispatch(updateVideoState({ id: data.id, downloadState: "DOWNLOAD" }));
        removeFileRecord(data.id);

        // Recreate the downloadResumable task correctly
        downloadResumable.current = FileSystem.createDownloadResumable(
          data.videoUrl,
          `${baseFolder}/${fileName(data.videoUrl)}`,
          {},
          callback
        );

        console.warn(
          "downloadResumable recreated:",
          downloadResumable?.current
        );
        await getDoneRecords().then((value: any[]) => {
          dispatch(setOfflineDatatoView(value));
        });
      });
    } catch (error) {
      console.error("Error in deleteOperation:", error);
    }
  }, [data, videos, setdeleteDownload, dispatch, callback, baseFolder]);

  const toBeforeScreen = () => {
    const temp = { ...data, videoUrl: videos[data.id]?.videoPath };
    console.warn(`temp data: ${JSON.stringify(temp)}`);
    navigation.navigate("VideoPlayer", {
      data: videos[data.id].downloadState == "DONE" ? temp : data,
      module: module,
      downloadState: videos[data.id].downloadState,
    });
  };

  return (
    <>
      <Portal>
        <Dialog
          visible={deleteDownload}
          dismissable={false}
          style={{
            backgroundColor: colorScheme == "dark" ? _theme.dark : _theme.light,
          }}
        >
          <Dialog.Title
            style={{ textAlign: "left" }}
            className="text-black dark:text-white"
          >
            Delete from downloads?
          </Dialog.Title>
          <Dialog.Content>
            <Text
              style={{
                textAlign: "left",
                fontFamily: "Nunito_500Medium",
              }}
              className="text-black dark:text-white"
            >
              This video won't be available to watch offline.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setdeleteDownload(false);
              }}
              mode="contained-tonal"
              contentStyle={{ paddingHorizontal: 5 }}
              labelStyle={{
                fontFamily: "Nunito_600SemiBold",
              }}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              labelStyle={{
                fontFamily: "Nunito_600SemiBold",
              }}
              contentStyle={{ paddingHorizontal: 5 }}
              onPress={deleteOperation}
            >
              Remove
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <GestureHandlerRootView
          style={{ flex: 1 }}
          className="bg-slate-100 dark:bg-slate-900"
        >
          {/* image */}
          <View
            style={{
              alignItems: "center",
            }}
          >
            <Image
              style={styles.ImageStyle}
              source={data.imageUrl}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={500}
            />
            <View
              style={{
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
            >
              <TouchableOpacity onPress={toBeforeScreen}>
                <IoniconsIcon
                  name="play-circle-outline"
                  size={50}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View></View>

          {/* new view that content auther, and horizontal butons and bottom sheet, but button taking full height at bottom */}
          <View
            style={{
              marginVertical: 10,
            }}
          >
            {/* authro name and title */}
            <View
              style={{
                marginHorizontal: 12,
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito_700Bold",
                  fontSize: 17,
                }}
                className="text-black dark:text-white"
              >
                {data.title}
              </Text>
              <Text
                className="text-black dark:text-white"
                style={{
                  fontFamily: "Nunito_500Medium",
                  fontSize: 14,
                }}
              >
                {data.author}
              </Text>
            </View>

            {/* button horizontal scrollview */}
            <ScrollView
              style={{
                marginTop: 18,
                marginHorizontal: 12,
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                justifyContent: "space-between",
              }}
            >
              <Button
                style={{ marginRight: 8 }}
                loading={videos[data.id]?.downloadState == "DOWNLOADING"}
                disabled={
                  videos[data.id]?.downloadState == "DOWNLOADING" &&
                  videos[data.id]?.percentage == 0
                }
                icon={() => (
                  <Icon
                    source={
                      videos[data.id]?.downloadState == "DOWNLOADING"
                        ? "loading"
                        : videos[data.id]?.downloadState == "DONE"
                        ? "check-circle"
                        : videos[data.id]?.downloadState == "PAUSED"
                        ? "pause-circle"
                        : videos[data.id]?.downloadState == "PREPARING"
                        ? "dots-circle"
                        : "download"
                    }
                    size={22}
                  />
                )}
                mode="contained-tonal"
                // disabled={isLoading}
                onPress={handleDownload}
              >
                {videos[data.id]?.downloadState == "DOWNLOADING"
                  ? `${
                      videos[data?.id]?.percentage == 0
                        ? 0
                        : Math.round(videos[data?.id]?.percentage)
                    }% Downloading`
                  : videos[data.id]?.downloadState == "DONE"
                  ? "Downloaded"
                  : videos[data.id]?.downloadState == "PAUSED"
                  ? "Paused"
                  : videos[data.id]?.downloadState == "PREPARING"
                  ? "Preparing"
                  : "Download"}
              </Button>
            </ScrollView>
          </View>

          {/* bottom sheet */}
          <BottomSheet
            enableContentPanningGesture={false}
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            index={-1}
            snapPoints={snapPoints}
            backdropComponent={(props) => (
              <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                // enableTouchThrough
              />
            )}
            handleComponent={null}
          >
            <BottomSheetView className="flex-1 justify-center">
              {videos[data.id]?.downloadState == "DOWNLOADING" && (
                <TouchableOpacity onPress={PauseDownloading}>
                  <View
                    style={{
                      width: "95%",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      padding: 16,
                    }}
                  >
                    <Icon
                      source="pause-circle"
                      color={theme.colors.primary}
                      size={26}
                    />
                    <Text
                      style={{
                        fontFamily: "Nunito_700Bold",
                        marginHorizontal: 8,
                        color: "black",
                      }}
                      className="text-black dark:text-white"
                    >
                      Pause
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              {videos[data.id]?.downloadState == "PAUSED" && (
                <TouchableOpacity onPress={ResumeDownloading}>
                  <View
                    style={{
                      width: "95%",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      padding: 16,
                    }}
                  >
                    <Icon
                      source="play"
                      color={theme.colors.primary}
                      size={26}
                    />
                    <Text
                      style={{
                        fontFamily: "Nunito_700Bold",
                        marginHorizontal: 8,
                        color: "black",
                      }}
                      className="text-black dark:text-white"
                    >
                      Resume
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={CancelDownloading}>
                <View
                  style={{
                    width: "95%",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    padding: 16,
                  }}
                >
                  <Icon
                    source="delete"
                    color={theme.colors.primary}
                    size={26}
                  />
                  <Text
                    style={{
                      fontFamily: "Nunito_700Bold",
                      marginHorizontal: 8,
                      color: "black",
                    }}
                    className="text-black dark:text-white"
                  >
                    Cancel download
                  </Text>
                </View>
              </TouchableOpacity>
            </BottomSheetView>
          </BottomSheet>
        </GestureHandlerRootView>
      </ScrollView>
    </>
  );
};

export default memo(withTheme(VideoDetails));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  btnstyle: { padding: 5, width: "45%", marginHorizontal: 5, borderRadius: 50 },
  contentContainer: {
    flex: 1,
  },
  ImageStyle: {
    width: "100%",
    height: width / 1.6,
  },

  flex1: { flex: 1 },
  imageContainer: { alignItems: "center" },
  imageStyle: { width: "100%", height: 200 },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  bannerContent: { justifyContent: "center" },
  bannerText: { fontFamily: "Nunito_700Bold", fontSize: 16 },
  bannerSubtext: { fontFamily: "Nunito_600SemiBold", fontSize: 14 },
  textContainer: { marginVertical: 10, marginHorizontal: 12 },
  title: { fontFamily: "Nunito_700Bold", fontSize: 17 },
  author: { fontFamily: "Nunito_500Medium", fontSize: 14 },
  buttonRow: { flexDirection: "row", marginTop: 18 },
  button: { marginRight: 8 },
  bottomSheetAction: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  bottomSheetActionText: { fontFamily: "Nunito_700Bold", marginHorizontal: 8 },
  snackbar: {
    position: "absolute",
    bottom: 5,
    alignSelf: "center",
    width: "90%",
    borderRadius: 18,
  },
  dialogTitle: { textAlign: "left" },
  dialogContent: { textAlign: "left", fontFamily: "Nunito_500Medium" },
  dialogButtonLabel: { fontFamily: "Nunito_600SemiBold" },
});
