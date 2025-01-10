import * as FileSystem from 'expo-file-system';
export const baseFolder = `${FileSystem.documentDirectory}offline/videos`;

export async function ensureDirExists(value?: string): Promise<boolean> {
    try {
        const fileDir: string = `${baseFolder}${value ? `/${value}` : ''}`
        console.log('---fileDir--->', fileDir)
        const dirInfo = await FileSystem.getInfoAsync(fileDir);
        if (!dirInfo.exists) {
            return false;
        }
        return true;
    } catch (error) {
        console.error('error', error)
        return false;
    }
}

export const makeDir = async () => {
    ensureDirExists().then(async (flag: boolean) => {
        console.log('====flag====', flag)
        if (!flag) {
            await FileSystem.makeDirectoryAsync(baseFolder, { intermediates: true }).then((res) => {
                console.log('res:', res)
            });
        }
    });
}

export const fileName = (url: string): string => {
    // Decode the URL to get the original file name
    const decodedUrl = decodeURIComponent(url);
    // Extract the file name
    const extractedFileName = decodedUrl.split('/').pop();
    // Return the clean file name or an empty string if extraction fails
    return extractedFileName || '';
};


export const saveMediaFromUrl = async (url: string, filename: string) => {
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    await FileSystem.downloadAsync(url, fileUri);
    console.log(`Media saved at: ${fileUri}`);
    return fileUri;
};

export const DeleteVideo = async (fileName: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const fileUri = `${baseFolder}/${fileName}`
            const res = await FileSystem.deleteAsync(fileUri, {
                idempotent: true
            })
            console.log('res', res)
            resolve(true);
        } catch (error) {
            console.log('error whiel deleting', error)
            reject(false);
        }
    });
}