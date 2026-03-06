import remoteConfig from '@react-native-firebase/remote-config';

export const initRemoteConfig = async () => {
    try {
        await remoteConfig().setConfigSettings({
            minimumFetchIntervalMillis: 1000,
        });

        await remoteConfig().fetchAndActivate();

        remoteConfig().onConfigUpdated(async () => {
            await remoteConfig().activate();
        });

    } catch (e) {
        console.error('Remote Config Error:', e);
    }
};

/**
 * Fetches the 'redirect_url' JSON string from Firebase and parses it.
 */
export const getRemoteConfigData = () => {
    try {
        const jsonString = remoteConfig().getString('redirect_url');
        if (!jsonString) return null;
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error parsing remote config JSON:", error);
        return null;
    }
};

/**
 * Legacy helper for raw string access
 */
export const getRedirectUrl = () => {
    return remoteConfig().getString('redirect_url');
};