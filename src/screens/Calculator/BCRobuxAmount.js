import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    TextInput,
    Modal,
    Image,
    Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { THEME } from '../../theme';
import { getRemoteConfigData } from '../../utils/remoteConfig';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import PremiumButton from '../../components/PremiumButton';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');

const BCRobuxAmount = ({ route, navigation }) => {

    const { type } = route.params;
    const [amount, setAmount] = useState('');
    const [error, setError] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [result, setResult] = useState(0);

    const titleMap = {
        BC: 'BC Daily Counter',
        TBC: 'TBC Daily Counter',
        OBC: 'OBC Daily Counter',
        rbxToDollar: "Free RBX To Dollar",
        dollarToRbx: "Dollar to RBX Calculator",
    };

    const handleCountNow = () => {
        if (!amount.trim()) {
            setError(true);
            return;
        }
        setError(false);
        const value = parseFloat(amount);
        let calculatedValue = 0;

        if (type === "BC") calculatedValue = value * 15;
        else if (type === "TBC") calculatedValue = value * 35;
        else if (type === "OBC") calculatedValue = value * 60;
        else if (type === "rbxToDollar") calculatedValue = value * 0.0125;
        else if (type === "dollarToRbx") calculatedValue = value * 80;

        setResult(calculatedValue);
        setShowModal(true);
    };

    const handleContinue = async () => {
        setShowModal(false);
        const configData = getRemoteConfigData();

        if (configData?.show_ads?.enable) {
            const url = configData.show_ads.url;
            try {
                InAppBrowser.open(url, {
                    dismissButtonStyle: 'close',
                    preferredBarTintColor: THEME.colors.primary,
                    preferredControlTintColor: 'white',
                });
            } catch (e) {
                console.log('Browser error', e);
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
                });
            } catch (e) {
                // navigation.goBack(); // Already gone back
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
                <Text style={styles.headerTitle}>{titleMap[type] || 'Calculator'}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.iconContainer}>
                    {(type === 'dollarToRbx' || type === 'rbxToDollar') ? (
                        <Image
                            source={require('../../assets/images/calcuimage.png')}
                            style={styles.calcImage}
                            resizeMode="contain"
                        />
                    ) : (
                        <Image
                            source={require('../../assets/images/calcuimage.png')}
                            style={styles.calcImage}
                            resizeMode="contain"
                        />
                    )}
                </View>

                <View style={styles.inputCard}>
                    <Text style={styles.label}>
                        {type === "rbxToDollar" || type === "dollarToRbx" ? "Enter amount" : "Enter number of days"}
                    </Text>
                    <TextInput
                        style={[styles.input, error && styles.inputError]}
                        placeholder="0"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={(text) => {
                            setAmount(text);
                            setError(false);
                        }}
                    />
                    {error && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={16} color={THEME.colors.error} />
                            <Text style={styles.errorText}>Please enter a valid amount</Text>
                        </View>
                    )}

                    <PremiumButton
                        title="Calculate Now"
                        onPress={handleCountNow}
                        style={{ marginTop: THEME.spacing.lg }}
                    />

                </View>
                <Image
                    source={require('../../assets/images/big_ad_img4.png')}
                    style={styles.promoImage}
                    resizeMode="cover"
                />
            </ScrollView>

            <Modal transparent visible={showModal} animationType="fade">
                <View style={styles.modalOverlay}>
                    <LinearGradient
                        colors={['#1A1A2E', '#16213E']}
                        style={styles.modalBox}
                    >
                        <View style={styles.successIcon}>
                            <Ionicons name="checkmark-circle" size={50} color={THEME.colors.success} />
                        </View>
                        <Text style={styles.modalTitle}>Calculation Complete!</Text>
                        <Text style={styles.modalText}>
                            {type === "rbxToDollar" ? "The total value is:" : "Your total Robux reward is:"}
                        </Text>
                        <Text style={styles.modalAmount}>
                            {type === "rbxToDollar" ? `$${result.toFixed(4)}` : `${result.toFixed(1)} RBX`}
                        </Text>
                        <PremiumButton
                            title="Continue"
                            onPress={handleContinue}
                            style={styles.modalButton}
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    scrollContent: {
        padding: THEME.spacing.md,
        alignItems: 'center',
    },
    iconContainer: {
        marginVertical: THEME.spacing.xl,
    },
    iconGlow: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(142, 45, 226, 0.4)',
    },
    calcImage: {
        width: 160,
        height: 160,
    },
    inputCard: {
        width: '100%',
        padding: THEME.spacing.lg,
        borderRadius: THEME.borderRadius.xl,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    label: {
        color: THEME.colors.textSecondary,
        fontSize: 14,
        marginBottom: THEME.spacing.sm,
    },
    input: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: THEME.borderRadius.md,
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        padding: THEME.spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    inputError: {
        borderColor: THEME.colors.error,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: THEME.spacing.xs,
    },
    errorText: {
        color: THEME.colors.error,
        fontSize: 12,
        marginLeft: 4,
    },
    promoImage: {
        width: width,
        height: 270,
        borderRadius: 5,
        marginTop: THEME.spacing.xl,
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
    successIcon: {
        marginBottom: THEME.spacing.md,
    },
    modalTitle: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    modalText: {
        color: THEME.colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
    },
    modalAmount: {
        color: THEME.colors.secondary,
        fontSize: 32,
        fontWeight: '800',
        marginVertical: THEME.spacing.lg,
    },
    modalButton: {
        width: '100%',
    },
});

export default BCRobuxAmount;
