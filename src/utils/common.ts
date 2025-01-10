import * as Linking from "expo-linking";
import { format, parseISO } from "date-fns";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from 'expo-web-browser';
import { useCallback } from "react";
import { TouchableOpacity } from "react-native";

export const toTitlecase = (str: string | null | undefined) => {
    if (str) return str.charAt(0).toUpperCase() + str?.slice(1);
    return "NA";
};

export const call = (num: number | string) => {
    Linking.openURL(`tel:${num}`);
};

export const whatsapp = (mobile_number: number | string) => {
    Linking.openURL(`https://wa.me/+91${mobile_number}?text=${"नमस्ते"}`);
};

export const gender_data = [
    {
        id: 1,
        label: "Female",
        // img: require("../../assets/images/spiritual/female.png"),
    },
    {
        id: 2,
        label: "Male",
        // img: require("../../assets/images/spiritual/male.png"),
    },
];

export const encode = (value: object) => {
    return JSON.stringify(value);
};

export const decode = (value: string) => {
    return JSON.parse(value);
};

export const convertDateToYYYYMMDD = (date: Date) => {
    return format(date, "yyyy-MM-dd");
};

export const isoDateInIST = (date: string) => {
    return format(parseISO(date), "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'");
}

export const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export const activeOpacity = 0.8;

export const theme = {
    dark: '#0f172a',
    light: '#f1f5f9'
}

export const ddMMMMyyyy = (date: Date) => {
    const formattedDate = format(date, 'dd MMMM yyyy');
    return formattedDate;
}

export interface langType { id: string; name: string }
export const Lang: langType[] = [
    {
        id: 'en',
        name: 'English',
    },
    {
        id: 'hi',
        name: 'हिंदी ',
    },
    {
        id: 'mar',
        name: 'मराठी',
    },
];


export async function logout(key: string = 'access_token') {
    await SecureStore.deleteItemAsync(key);
}

export const deviceActivity = {
    connected: "rgb(0, 104, 116)",
    disconnected: 'red'
}

export const _handlePressButtonAsync = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
};

