import remoteConfig from '@react-native-firebase/remote-config';

/**
 * Initializes Remote Config with settings.
 * It will attempt to fetch the latest values from Firebase.
 */
export const initRemoteConfig = async () => {
    try {
        // Set settings (1000ms interval for development/testing)
        await remoteConfig().setConfigSettings({
            minimumFetchIntervalMillis: 1000,
        });

        // Fetch and activate the latest values from Firebase Console
        const fetchedRemotely = await remoteConfig().fetchAndActivate();
        if (fetchedRemotely) {
            console.log('✅ Remote Config fetched and activated from Firebase');
        } else {
            console.log('⚠️ Remote Config activated from local cache');
        }

        // Optional: Listen for real-time updates while the app is running
        remoteConfig().onConfigUpdated(async (event) => {
            console.log('🔄 Remote Config updating in real-time...');
            await remoteConfig().activate();
        });

    } catch (e) {
        console.error('❌ Remote Config Error:', e);
    }
};

/**
 * Fetches the 'redirect_url' JSON string from Firebase and parses it.
 */
export const getRemoteConfigData = () => {
    try {
        // getString('redirect_url') gets the value you set in Firebase Console
        const jsonString = remoteConfig().getString('redirect_url');
        if (!jsonString) return null;
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("❌ Error parsing remote config JSON:", error);
        return null; // Return null to let the app handle missing config
    }
};

/**
 * Legacy helper for raw string access
 */
export const getRedirectUrl = () => {
    return remoteConfig().getString('redirect_url');
};


