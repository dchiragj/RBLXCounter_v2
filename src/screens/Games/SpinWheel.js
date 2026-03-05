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
    Pressable,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { THEME } from '../../theme';
import PremiumButton from '../../components/PremiumButton';
import { getRemoteConfigData } from '../../utils/remoteConfig';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const SpinWheel = ({ navigation }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [reward, setReward] = useState(0);
    const [coins, setCoins] = useState(0);
    const spinAnim = useRef(new Animated.Value(0)).current;

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

    const SPIN_RESULTS = ['79', '137', '195', '87', '699', '475', '400', '777', '125', '67'];

    const handleSpin = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        const winnerIndex = Math.floor(Math.random() * SPIN_RESULTS.length);
        const resultValue = SPIN_RESULTS[winnerIndex];

        // Calculate the rotation needed to bring winnerIndex to the top (0 degrees)
        const segmentAngle = 360 / SPIN_RESULTS.length;
        const winnerRotation = (360 - (winnerIndex * segmentAngle)) % 360;

        // 5 full rotations + final position
        const rotationCount = 5;
        const finalValue = (rotationCount * 360) + winnerRotation;

        spinAnim.setValue(0);
        Animated.timing(spinAnim, {
            toValue: finalValue,
            duration: 3000,
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) {
                console.log("🎡 Spin finished! Result:", resultValue);
                setReward(resultValue);
                setModalVisible(true);
                setIsSpinning(false);
            }
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
    // set the ads
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

    const handleClaim = async () => {
        setModalVisible(false);
        const rewardAmount = parseInt(reward) || 0;

        try {
            // Update coins locally in state and storage
            const newCoins = coins + rewardAmount;
            setCoins(newCoins);
            await AsyncStorage.setItem("user_coins", newCoins.toString());
            console.log("✅ Coins updated locally in SpinWheel:", newCoins);
        } catch (error) {
            console.log("❌ Error updating coins in SpinWheel:", error);
        }

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

    const spinRotate = spinAnim.interpolate({
        inputRange: [0, 360 * 10], // Support multiple rotations
        outputRange: ['0deg', '3600deg'],
    });

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
                <Text style={styles.headerTitle}>Spin Wheel</Text>
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
            <ScrollView>

                <View style={styles.content}>
                    <View style={styles.wheelWrapper}>
                        {/* Pointer */}
                        <View style={styles.pointerContainer}>
                            <Image source={require('../../assets/images/spin_point.png')} style={styles.pointerImage} resizeMode="contain" />
                        </View>

                        {/* The Wheel */}
                        <Animated.View style={[styles.wheelContainer, { transform: [{ rotate: spinRotate }] }]}>
                            <View style={styles.wheelGradient}>
                                {/* Decorative Segments */}
                                <View style={styles.segmentsContainer}>
                                    {[...Array(SPIN_RESULTS.length)].map((_, i) => (
                                        <View
                                            key={i}
                                            style={[
                                                styles.segment,
                                                { transform: [{ rotate: `${i * (360 / SPIN_RESULTS.length)}deg` }] }
                                            ]}
                                        />
                                    ))}
                                </View>

                                {/* Numbers */}
                                {SPIN_RESULTS.map((val, i) => (
                                    <View
                                        key={i}
                                        style={[
                                            styles.numberWrapper,
                                            { transform: [{ rotate: `${i * (360 / SPIN_RESULTS.length)}deg` }] }
                                        ]}
                                    >
                                        <Text style={styles.wheelNumber}>{val}</Text>
                                    </View>
                                ))}

                                {/* Center Pin */}
                                <View style={styles.centerPin}>
                                    <View style={styles.innerPin} />
                                </View>
                            </View>
                        </Animated.View>
                        <Image
                            source={require('../../assets/images/outer_boarder.png')}
                            style={styles.outerBoarder}
                            pointerEvents="none"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.spinButton, isSpinning && styles.disabledButton]}
                        onPress={handleSpin}
                        disabled={isSpinning}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.spinButtonText}>
                            {isSpinning ? "SPINNING..." : "SPIN NOW"}
                        </Text>
                    </TouchableOpacity>
                    {/* Promo Image */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.promoContainer}
                        onPress={openAdLink}
                    >
                        <Image
                            source={require('../../assets/images/big_ad_img4.png')}
                            style={styles.promoImage}
                            resizeMode="stretch"
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>

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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
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
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wheelWrapper: {
        width: width * 0.85,
        height: width * 0.85,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 50,
    },
    pointerContainer: {
        position: 'absolute',
        top: -45,
        zIndex: 20,
        alignItems: 'center',
    },
    pointerImage: {
        width: 45,
        height: 60,
    },
    wheelContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    wheelImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    outerBoarder: {
        position: 'absolute',
        width: width * 0.9,
        height: width * 0.9,
        zIndex: 15,
    },
    wheelGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    segmentsContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    segment: {
        position: 'absolute',
        top: 0,
        left: '50%',
        width: 2,
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginLeft: -1,
    },
    numberWrapper: {
        position: 'absolute',
        height: '80%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    wheelNumber: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    centerPin: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: THEME.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
        elevation: 5,
    },
    innerPin: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFF',
        opacity: 0.8,
    },
    spinButton: {
        width: width * 0.7,
        backgroundColor: '#A020F0',
        paddingVertical: 15,
        borderRadius: 40,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#A020F0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    disabledButton: {
        opacity: 0.6,
    },
    spinButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    promoContainer: {
        marginVertical: 25,
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    promoImage: {
        width: width,
        height: 270,
        borderRadius: 15,
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
});

export default SpinWheel;
