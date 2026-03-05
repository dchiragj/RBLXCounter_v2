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
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRemoteConfigData } from '../../utils/remoteConfig';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const RedeemScreen = ({ navigation }) => {

    const handleBackPress = async () => {
        const configData = getRemoteConfigData();
        const backscreen = configData?.backscreen;

        if (backscreen?.enable) {
            try {
                navigation.goBack();
                InAppBrowser.open(backscreen.backurl, {
                    dismissButtonStyle: 'close',
                    preferredBarTintColor: THEME.colors.primary,
                });
            } catch (e) {
                // navigation.goBack(); // Already gone back
            }
        } else {
            navigation.goBack();
        }
    };

    const handleServerPress = async (type) => {
        const configData = getRemoteConfigData();

        if (configData?.show_ads?.enable) {
            const url = configData.show_ads.url;
            try {
                navigation.navigate('BCRobuxAmount', { type });
                InAppBrowser.open(url, {
                    dismissButtonStyle: 'close',
                    preferredBarTintColor: THEME.colors.primary,
                });
            } catch (e) {
                // navigation.navigate('BCRobuxAmount', { type }); // Already navigated
            }
        } else {
            navigation.navigate('BCRobuxAmount', { type });
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
                <Text style={styles.headerTitle}>Redeem Rewards</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.walletCard}>
                    <LinearGradient
                        colors={['rgba(255,215,0,0.2)', 'rgba(255,215,0,0.05)']}
                        style={styles.walletGlow}
                    >
                        <Ionicons name="wallet" size={60} color={THEME.colors.secondary} />
                        <Text style={styles.balanceLabel}>Current Balance</Text>
                        <Text style={styles.balanceValue}>278 RBX</Text>
                    </LinearGradient>
                </View>

                <View style={styles.progressSection}>
                    <View style={styles.progressInfo}>
                        <Text style={styles.progressLabel}>Minimum Redeem</Text>
                        <Text style={styles.progressValue}>7,500 RBX</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: '5%' }]} />
                    </View>
                    <Text style={styles.hintText}>Keep playing and calculating to reach your goal!</Text>
                </View>

                <View style={styles.serversContainer}>
                    <Text style={styles.sectionTitle}>Redeem Servers</Text>

                    <TouchableOpacity
                        style={styles.serverItem}
                        onPress={() => handleServerPress('dollarToRbx')}
                    >
                        <Image
                            source={require('../../assets/images/redeem_server1.png')}
                            style={styles.serverItemImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.serverItem}
                        onPress={() => handleServerPress('rbxToDollar')}
                    >
                        <Image
                            source={require('../../assets/images/redeem_server2.png')}
                            style={styles.serverItemImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                {/* Promo Image */}
                <TouchableOpacity style={styles.promoContainer} onPress={() => handleServerPress('promo')}>
                    <Image
                        source={require('../../assets/images/big_ad_img3.png')}
                        style={styles.promoImage}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
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
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    scrollContent: {
        padding: THEME.spacing.lg,
    },
    walletCard: {
        marginVertical: THEME.spacing.xl,
        borderRadius: THEME.borderRadius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.2)',
    },
    walletGlow: {
        padding: THEME.spacing.xl,
        alignItems: 'center',
    },
    balanceLabel: {
        color: THEME.colors.textSecondary,
        fontSize: 14,
        marginTop: THEME.spacing.md,
    },
    balanceValue: {
        color: THEME.colors.secondary,
        fontSize: 32,
        fontWeight: 'bold',
    },
    progressSection: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: THEME.spacing.lg,
        borderRadius: THEME.borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    progressLabel: {
        color: '#FFF',
        fontSize: 14,
    },
    progressValue: {
        color: THEME.colors.secondary,
        fontWeight: 'bold',
    },
    progressBarBg: {
        height: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 15,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: THEME.colors.secondary,
    },
    hintText: {
        color: THEME.colors.textSecondary,
        fontSize: 12,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    serversContainer: {
        marginTop: THEME.spacing.xl,
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: THEME.spacing.md,
    },
    serverItem: {
        marginBottom: THEME.spacing.md,
        height: 80,
    },
    serverItemImage: {
        width: '100%',
        height: '100%',
    },
    promoContainer: {
        marginTop: THEME.spacing.xl,
        borderRadius: THEME.borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    promoImage: {
        width: '100%',
        height: 200,
    },
});

export default RedeemScreen;
