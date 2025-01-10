import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { updateDownloadState } from "../../utils/SqlSystem";


export interface VideoState {
    id: number;
    fileName: string;
    downloadState: "DOWNLOAD" | "PREPARING" | "DOWNLOADING" | "PAUSED" | "DONE";
    videoPath: string | undefined;
    imgPath: string | undefined;
    percentage: number;
    metadata: any;
}

interface OfflineVideoState {
    videos: Record<number, VideoState>; // Store video states by their IDs
    offline_data: undefined | any[]

}

const initialState: OfflineVideoState = {
    videos: {},
    offline_data: undefined
};

export const OfflineVideoStateSlice = createSlice({
    name: "offlinevideostateslice",
    initialState,
    reducers: {
        addVideo: (state, action: PayloadAction<VideoState>) => {
            state.videos[action.payload.id] = action.payload;
        },
        updateVideoState: (
            state,
            action: PayloadAction<{ id: number; downloadState: VideoState["downloadState"] }>
        ) => {
            const { downloadState, id } = action.payload;
            const video = state.videos[id];
            if (video) {
                video.downloadState = action.payload.downloadState;
            }
        },
        updateWhenDownloadComplete: (state,
            action: PayloadAction<{ id: number, videoPath: string }>) => {
            const { videoPath, id } = action.payload;
            const video = state.videos[id];
            if (video) {
                video.downloadState = "DONE";
                video.videoPath = videoPath
            }
        },
        updatePercentage: (
            state,
            action: PayloadAction<{ id: number; percentage: number }>
        ) => {
            const { percentage, id } = action.payload;
            const video = state.videos[id];
            if (video) {
                video.percentage = percentage;
            }
            // if (percentage != 100 && percentage != 0) {
            //     video.downloadState = 'DOWNLOADING'

            // }
        },
        removeVideo: (state, action: PayloadAction<number>) => {
            delete state.videos[action.payload];
        },
        resetState: (state) => {
            state.videos = {};
        },
        setOfflineDatatoView: (state, action: PayloadAction<any[]>) => {
            state.offline_data = action.payload
        }
    },
});

export const {
    addVideo,
    updateVideoState,
    updateWhenDownloadComplete,
    updatePercentage,
    removeVideo,
    resetState,
    setOfflineDatatoView
} = OfflineVideoStateSlice.actions;

export default OfflineVideoStateSlice.reducer;
