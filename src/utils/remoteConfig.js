import remoteConfig from '@react-native-firebase/remote-config';

export const initRemoteConfig = async () => {
    await remoteConfig().setConfigSettings({
        minimumFetchIntervalMillis: 1000,
    });

    await remoteConfig().setDefaults({
        redirect_url: 'https://spinthewheel.app/',
    });

    await remoteConfig().fetchAndActivate();
};

export const getRedirectUrl = () => {
    try {
        return remoteConfig().getString('redirect_url');
    } catch (error) {
        return 'https://spinthewheel.app/';
    }
};
