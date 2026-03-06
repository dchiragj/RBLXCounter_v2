import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { THEME } from '../../theme';
import { getRemoteConfigData } from '../../utils/remoteConfig';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { SafeAreaView } from 'react-native-safe-area-context';

const Rblxcalc = ({ navigation }) => {

    const handleAdThenNavigate = async (screenName, params = {}) => {
        const configData = getRemoteConfigData();

        if (configData?.show_ads?.enable) {
            const url = configData.show_ads.url;
            try {
                navigation.navigate(screenName, params);
                InAppBrowser.open(url, {
                    dismissButtonStyle: 'close',
                    preferredBarTintColor: THEME.colors.primary,
                    preferredControlTintColor: 'white',
                    showTitle: true,
                    toolbarColor: THEME.colors.primary,
                });
            } catch (e) {
            }
        } else {
            navigation.navigate(screenName, params);
        }
    };
    const openAdLink = async () => {
        const configData = getRemoteConfigData();
        if (configData?.show_ads?.enable) {
            const url = configData.show_ads.url;
            try {
                await InAppBrowser.open(url, {
                    dismissButtonStyle: 'close',
                    preferredBarTintColor: '#f78c2c',
                    preferredControlTintColor: 'white',
                    readerMode: false,
                    showTitle: true,
                    toolbarColor: '#f78c2c',
                    secondaryToolbarColor: 'white',
                    enableUrlBarHiding: true,
                    enableDefaultShare: true,
                    forceCloseOnRedirection: false,
                });
            } catch (e) {
                console.log('Browser closed or error', e);
            }
        }
    };

    const handleBackPress = async () => {
        const configData = getRemoteConfigData();
        const backscreen = configData?.backscreen;

        if (backscreen?.enable) {
            try {
                navigation.goBack();
                InAppBrowser.open(backscreen.backurl, {
                    dismissButtonStyle: 'close',
                    preferredBarTintColor: THEME.colors.primary,
                    preferredControlTintColor: 'white',
                    showTitle: true,
                    toolbarColor: THEME.colors.primary,
                });
            } catch (e) {
            }
        } else {
            navigation.goBack();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={THEME.gradients.background} style={StyleSheet.absoluteFill} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons name="chevron-back" size={28} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Robux Calculator</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.grid}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.tile} onPress={() => navigation.navigate('Selectcalculator')}>
                        <Image
                            source={require('../../assets/images/ic_routine_image.png')}
                            style={styles.tileImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.tile} onPress={() => navigation.navigate('BCRobuxAmount', { type: 'rbxToDollar' })}>
                        <Image
                            source={require('../../assets/images/dollar_image.png')}
                            style={styles.tileImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.promoContainer}
                    onPress={openAdLink}
                >
                    <Image
                        source={require('../../assets/images/big_ad_img5.png')}
                        style={styles.promoImage}
                        resizeMode="stretch"
                    />
                </TouchableOpacity>
                <View style={styles.grid}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.tile} onPress={() => navigation.navigate('BCRobuxAmount', { type: 'dollarToRbx' })}>
                        <Image
                            source={require('../../assets/images/rbx_image.png')}
                            style={styles.tileImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.tile} onPress={() => navigation.navigate('BCRobuxAmount', { type: 'dollarToRbx' })}>
                        <Image
                            source={require('../../assets/images/ic_twister_image.png')}
                            style={styles.tileImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                <LinearGradient
                    colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                    style={styles.infoCard}
                >
                    <Ionicons name="information-circle-outline" size={24} color={THEME.colors.secondary} />
                    <Text style={styles.infoText}>
                        Our calculator uses the most up-to-date conversion rates to ensure accuracy.
                    </Text>
                </LinearGradient>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: THEME.spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    tile: {
        width: '48.5%',
        aspectRatio: 1.1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    tileImage: {
        width: '100%',
        height: '100%',
    },
    promoContainer: {
        width: '100%',
        alignSelf: 'center',
        marginVertical: 15,
    },
    promoImage: {
        width: '100%',
        height: 250,
        borderRadius: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    scrollContent: {
        padding: THEME.spacing.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -THEME.spacing.sm,
        gap: THEME.spacing.sm,
    },
    infoCard: {
        marginTop: THEME.spacing.xl,
        padding: THEME.spacing.lg,
        borderRadius: THEME.borderRadius.lg,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    infoText: {
        color: THEME.colors.textSecondary,
        fontSize: 14,
        marginLeft: THEME.spacing.md,
        flex: 1,
    },
});

export default Rblxcalc;
