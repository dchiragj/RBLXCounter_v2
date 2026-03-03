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
    Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { THEME } from '../../theme';
import PremiumButton from '../../components/PremiumButton';
import { getRedirectUrl } from '../../utils/remoteConfig';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const { width } = Dimensions.get('window');

const SpinWheel = ({ navigation }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [reward, setReward] = useState(0);
    const spinAnim = useRef(new Animated.Value(0)).current;

    const SPIN_RESULTS = ['79', '137', '195', '87', '699', '475', '400', '777', '125', '67'];

    const handleSpin = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        const randomResult = Math.floor(Math.random() * SPIN_RESULTS.length);
        const resultValue = SPIN_RESULTS[randomResult];

        // 5 full rotations + final position
        const rotationCount = 5;
        const finalValue = (rotationCount * 360) + (randomResult * (360 / SPIN_RESULTS.length));

        spinAnim.setValue(0);
        Animated.timing(spinAnim, {
            toValue: finalValue,
            duration: 3000,
            useNativeDriver: true,
        }).start(() => {
            setIsSpinning(false);
            setReward(resultValue);
            setTimeout(() => setModalVisible(true), 500);
        });
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
        setModalVisible(false);
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

    const spinRotate = spinAnim.interpolate({
        inputRange: [0, 360 * 10], // Support multiple rotations
        outputRange: ['0deg', '3600deg'],
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={THEME.gradients.background} style={StyleSheet.absoluteFill} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons name="chevron-back" size={28} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Spin Wheel</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.wheelWrapper}>
                    {/* Pointer */}
                    <View style={styles.pointerContainer}>
                        <Ionicons name="caret-down" size={40} color={THEME.colors.secondary} />
                    </View>

                    {/* The Wheel */}
                    <Animated.View style={[styles.wheelContainer, { transform: [{ rotate: spinRotate }] }]}>
                        <LinearGradient
                            colors={['#1a1a2e', '#16213e']}
                            style={styles.wheelGradient}
                        >
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
                        </LinearGradient>
                    </Animated.View>
                </View>

                <PremiumButton
                    title={isSpinning ? "SPINNING..." : "SPIN NOW"}
                    onPress={handleSpin}
                    style={styles.spinButton}
                    disabled={isSpinning}
                />
            </View>

            <Modal transparent visible={modalVisible} animationType="zoom">
                <View style={styles.modalOverlay}>
                    <LinearGradient
                        colors={['#1A1A2E', '#16213E']}
                        style={styles.modalBox}
                    >
                        <View style={styles.rewardIconContainer}>
                            <Ionicons name="sparkles" size={60} color={THEME.colors.secondary} />
                        </View>
                        <Text style={styles.congratsText}>Congratulations!</Text>
                        <Text style={styles.wonText}>You won {reward} coins</Text>
                        <PremiumButton
                            title="CLAIM REWARD"
                            onPress={handleClaim}
                            style={{ width: '100%' }}
                        />
                    </LinearGradient>
                </View>
            </Modal>
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
    },
    wheelWrapper: {
        width: width * 0.85,
        height: width * 0.85,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    pointerContainer: {
        position: 'absolute',
        top: -20,
        zIndex: 10,
    },
    wheelContainer: {
        width: '100%',
        height: '100%',
        borderRadius: width * 0.425,
        borderWidth: 8,
        borderColor: 'rgba(142, 45, 226, 0.3)',
        overflow: 'hidden',
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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: THEME.spacing.xl,
    },
    modalBox: {
        width: '100%',
        borderRadius: THEME.borderRadius.xl,
        padding: THEME.spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    rewardIconContainer: {
        marginBottom: 20,
    },
    congratsText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    wonText: {
        color: THEME.colors.secondary,
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 30,
    },
});

export default SpinWheel;
