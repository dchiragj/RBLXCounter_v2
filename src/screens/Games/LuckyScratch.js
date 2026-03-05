import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,

    Animated,
    Dimensions,
    Image,
    Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { THEME } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRemoteConfigData } from '../../utils/remoteConfig';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const { width } = Dimensions.get('window');

const LuckyScratch = ({ navigation }) => {
    const [isScratched, setIsScratched] = useState(false);
    const [reward, setReward] = useState(0);
    const [coins, setCoins] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const scratchAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        loadCoins();
    }, []);

    const loadCoins = async () => {
        try {
            const savedCoins = await AsyncStorage.getItem("user_coins");
            if (savedCoins) {
                setCoins(parseInt(savedCoins));
            }
        } catch (error) {
            console.log("Error loading coins:", error);
        }
    };

    const rewards = [50, 100, 250, 500, 750, 1000];

    const handleScratch = () => {
        if (isScratched) return;

        // Random reward
        const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
        setReward(randomReward);

        Animated.timing(scratchAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            setIsScratched(true);
            setTimeout(() => setModalVisible(true), 500);
        });
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
                });
            } catch (e) {
                // navigation.goBack(); // Already gone back
            }
        } else {
            navigation.goBack();
        }
    };

    const handleClaim = async () => {
        setModalVisible(false);
        const rewardAmount = parseInt(reward) || 0;

        try {
            // Update coins locally in state and storage
            const newCoins = coins + rewardAmount;
            setCoins(newCoins);
            await AsyncStorage.setItem("user_coins", newCoins.toString());
            console.log("✅ Coins updated locally in LuckyScratch:", newCoins);
        } catch (error) {
            console.log("❌ Error updating coins in LuckyScratch:", error);
        }

        // Reset scratch card for next play
        setIsScratched(false);
        scratchAnim.setValue(1);

        const configData = getRemoteConfigData();
        if (configData?.show_ads?.enable) {
            const url = configData.show_ads.url;
            try {
                // Just open the browser, don't navigate
                InAppBrowser.open(url, {
                    dismissButtonStyle: 'close',
                    preferredBarTintColor: THEME.colors.primary,
                });
            } catch (e) {
                console.log("InAppBrowser Error:", e);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={THEME.gradients.background} style={StyleSheet.absoluteFill} />

            <LinearGradient
                colors={['#1a1a2e', 'rgba(26, 26, 46, 0.8)']}
                style={styles.header}
            >
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons name="chevron-back" size={28} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lucky Scratch</Text>
                <LinearGradient
                    colors={['#f78c2c', '#e94057']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.coinContainer}
                >
                    <Image source={require('../../assets/images/coin.png')} style={styles.coinIcon} />
                    <Text style={styles.coinText}>{coins}</Text>
                </LinearGradient>
            </LinearGradient>

            <View style={styles.content}>
                <Text style={styles.instruction}>Scratch the card to reveal your prize!</Text>

                <View style={styles.cardContainer}>
                    {/* Reward Layer (Revealed) */}
                    <View style={styles.rewardLayer}>
                        <LinearGradient
                            colors={['rgba(255,215,0,0.1)', 'rgba(255,215,0,0.05)']}
                            style={styles.rewardBackground}
                        >
                            <Ionicons name="gift" size={50} color={THEME.colors.secondary} />
                            <Text style={styles.rewardText}>{reward}</Text>
                            <Text style={styles.rewardSub}>Coins Won!</Text>
                        </LinearGradient>
                    </View>

                    {/* Scratch Layer (Cover) */}
                    {!isScratched && (
                        <Animated.View
                            style={[
                                styles.scratchLayer,
                                { opacity: scratchAnim, transform: [{ scale: scratchAnim }] }
                            ]}
                        >
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={handleScratch}
                                style={styles.scratchTouch}
                            >
                                <Image
                                    source={require('../../assets/images/lucky_scratch_img.png')}
                                    style={styles.scratchImage}
                                    resizeMode="stretch"
                                />
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </View>

                {!isScratched && (
                    <TouchableOpacity
                        style={styles.promoContainer}
                        onPress={() => {
                            const config = getRemoteConfigData();
                            if (config?.show_ads?.enable) {
                                InAppBrowser.open(config.show_ads.url);
                            }
                        }}
                    >
                        <Image
                            source={require('../../assets/images/big_ad_img5.png')}
                            style={styles.promoImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                )}
            </View>

            <Modal transparent visible={modalVisible} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <View style={styles.rewardIconContainer}>
                            <Image source={require('../../assets/images/ic_daily_rbx.png')} style={styles.trofee} resizeMode="contain" />
                            <Text style={styles.rewardNumber}>{reward}</Text>
                        </View>
                        <Text style={styles.congratsDescription}>
                            Congratulations ! {reward} RBX Coins are added to your virtual balance.
                        </Text>
                        <TouchableOpacity
                            style={styles.okayButton}
                            onPress={handleClaim}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.okayButtonText}>Okay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Tip Card */}
            <View style={styles.tipCard}>
                <Ionicons name="bulb-outline" size={20} color={THEME.colors.accent} />
                <Text style={styles.tipText}>
                    Come back every hour for a new lucky scratch!
                </Text>
            </View>
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
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // padding: THEME.spacing.xl,
    },
    instruction: {
        color: THEME.colors.textSecondary,
        fontSize: 16,
        marginBottom: 30,
        textAlign: 'center',
    },
    cardContainer: {
        width: width * 0.8,
        aspectRatio: 1,
        borderRadius: THEME.borderRadius.xl,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
        elevation: 10,
        shadowColor: THEME.colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    rewardLayer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rewardBackground: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rewardText: {
        color: THEME.colors.secondary,
        fontSize: 48,
        fontWeight: '900',
        marginTop: 10,
    },
    rewardSub: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 2,
    },
    scratchLayer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2,
    },
    scratchTouch: {
        flex: 1,
    },
    scratchGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scratchText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
        marginTop: 20,
        letterSpacing: 3,
    },
    scratchPattern: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    patternLine: {
        width: 1,
        height: '100%',
        backgroundColor: '#FFF',
        transform: [{ rotate: '45deg' }],
    },
    scratchImage: {
        width: '100%',
        height: '100%',
    },
    coinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
    },
    coinIcon: {
        width: 18,
        height: 18,
        marginRight: 6,
    },
    coinText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    claimButton: {
        marginTop: 30,
        width: '100%',
    },
    promoContainer: {
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    promoImage: {
        width: width,
        height: 270,
        borderRadius: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: THEME.spacing.xl,
    },
    modalBox: {
        width: '95%',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 30,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
        backgroundColor: '#1E0B36', // Dark purple background
    },
    rewardIconContainer: {
        width: 180,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    trofee: {
        width: '100%',
        height: '100%',
    },
    rewardNumber: {
        position: 'absolute',
        bottom: 45,
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    congratsDescription: {
        color: '#FFF',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
        fontWeight: '500',
        width: '100%',
        paddingHorizontal: 10,
    },
    okayButton: {
        backgroundColor: '#A020F0', // Vibrant purple
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 40,
        width: '100%',
        alignItems: 'center',
    },
    okayButtonText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    tipCard: {
        margin: THEME.spacing.lg,
        padding: THEME.spacing.md,
        backgroundColor: 'rgba(0, 242, 254, 0.1)',
        borderRadius: THEME.borderRadius.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 242, 254, 0.2)',
    },
    tipText: {
        color: THEME.colors.accent,
        fontSize: 12,
        marginLeft: 10,
        flex: 1,
    },
});

export default LuckyScratch;
