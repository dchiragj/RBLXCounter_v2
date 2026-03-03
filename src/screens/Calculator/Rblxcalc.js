import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { THEME } from '../../theme';
import FeatureCard from '../../components/FeatureCard';
import { getRedirectUrl } from '../../utils/remoteConfig';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const Rblxcalc = ({ navigation }) => {

    const handleAdThenNavigate = async (screenName, params = {}) => {
        const url = getRedirectUrl();
        try {
            await InAppBrowser.open(url, {
                dismissButtonStyle: 'close',
                preferredBarTintColor: THEME.colors.primary,
                preferredControlTintColor: 'white',
                showTitle: true,
                toolbarColor: THEME.colors.primary,
            });
            navigation.navigate(screenName, params);
        } catch (e) {
            navigation.navigate(screenName, params);
        }
    };

    const handleBackPress = async () => {
        const url = getRedirectUrl();
        try {
            await InAppBrowser.open(url, {
                dismissButtonStyle: 'close',
                preferredBarTintColor: THEME.colors.primary,
                preferredControlTintColor: 'white',
                showTitle: true,
                toolbarColor: THEME.colors.primary,
            });
            navigation.goBack();
        } catch (e) {
            navigation.goBack();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={THEME.gradients.background} style={StyleSheet.absoluteFill} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons name="chevron-back" size={28} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Robux Calculator</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.grid}>
                    <FeatureCard
                        title="Daily Counter"
                        subtitle="Calculate rewards"
                        image={require('../../assets/images/daily_free_rbx.png')}
                        onPress={() => navigation.navigate('Selectcalculator')}
                    />
                    <FeatureCard
                        title="RBX to Dollar"
                        subtitle="Check value"
                        image={require('../../assets/images/rbx_to_dollar.png')}
                        onPress={() => navigation.navigate('BCRobuxAmount', { type: 'rbxToDollar' })}
                    />
                    <FeatureCard
                        title="Dollar to RBX"
                        subtitle="Check amount"
                        image={require('../../assets/images/dollar_to_rbx.png')}
                        onPress={() => navigation.navigate('BCRobuxAmount', { type: 'dollarToRbx' })}
                    />
                    <FeatureCard
                        title="Robux Converter"
                        subtitle="Quick conversion"
                        image={require('../../assets/images/daily_converter.png')}
                        onPress={() => navigation.navigate('BCRobuxAmount', { type: 'dollarToRbx' })}
                    />
                </View>

                {/* Info Card */}
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
