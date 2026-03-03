import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Animated,
    Dimensions,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { THEME } from '../../theme';
import PremiumButton from '../../components/PremiumButton';
import { getRedirectUrl } from '../../utils/remoteConfig';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const { width } = Dimensions.get('window');

const LuckyScratch = ({ navigation }) => {
    const [isScratched, setIsScratched] = useState(false);
    const [reward, setReward] = useState(0);
    const scratchAnim = useRef(new Animated.Value(1)).current;

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
        }).start(() => setIsScratched(true));
    };

    const handleBackPress = async () => {
        const url = getRedirectUrl();
        try {
            await InAppBrowser.open(url, {
                dismissButtonStyle: 'close',
                preferredBarTintColor: THEME.colors.primary,
            });
            navigation.goBack();
        } catch (e) {
            navigation.goBack();
        }
    };

    const handleClaim = async () => {
        const url = getRedirectUrl();
        try {
            await InAppBrowser.open(url, {
                dismissButtonStyle: 'close',
                preferredBarTintColor: THEME.colors.primary,
            });
            // Here you would normally update the user's coins in AsyncStorage
            navigation.goBack();
        } catch (e) {
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
                <Text style={styles.headerTitle}>Lucky Scratch</Text>
                <View style={styles.coinContainer}>
                    <Image source={require('../../assets/images/coin.png')} style={styles.coinIcon} />
                    <Text style={styles.coinText}>278</Text>
                </View>
            </View>

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
                                <LinearGradient
                                    colors={['#8E2DE2', '#4A00E0']}
                                    style={styles.scratchGradient}
                                >
                                    <View style={styles.scratchPattern}>
                                        {[...Array(6)].map((_, i) => (
                                            <View key={i} style={styles.patternLine} />
                                        ))}
                                    </View>
                                    <Ionicons name="sparkles" size={40} color="rgba(255,255,255,0.4)" />
                                    <Text style={styles.scratchText}>TAP TO SCRATCH</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </View>

                {isScratched ? (
                    <PremiumButton
                        title="CLAIM REWARD"
                        onPress={handleClaim}
                        style={styles.claimButton}
                    />
                ) : (
                    <TouchableOpacity
                        style={styles.promoContainer}
                        onPress={() => InAppBrowser.open(getRedirectUrl())}
                    >
                        <Image
                            source={require('../../assets/images/big_ad_img5.png')}
                            style={styles.promoImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                )}
            </View>

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
        padding: THEME.spacing.xl,
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
    coinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.3)',
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
        marginTop: 40,
        width: width * 0.8,
        borderRadius: THEME.borderRadius.lg,
        overflow: 'hidden',
    },
    promoImage: {
        width: '100%',
        height: 180,
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
