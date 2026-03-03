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
import { getRedirectUrl } from '../../utils/remoteConfig';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const SelectCalculator = ({ navigation }) => {

    const openCalculator = async (type) => {
        const url = getRedirectUrl();
        try {
            await InAppBrowser.open(url, {
                dismissButtonStyle: 'close',
                preferredBarTintColor: THEME.colors.primary,
                preferredControlTintColor: 'white',
                showTitle: true,
                toolbarColor: THEME.colors.primary,
            });
            navigation.navigate('BCRobuxAmount', { type });
        } catch (error) {
            navigation.navigate('BCRobuxAmount', { type });
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

    const CalculatorOption = ({ title, type, color }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => openCalculator(type)}
            style={styles.optionContainer}
        >
            <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.glassBackground}
            >
                <View style={[styles.indicator, { backgroundColor: color }]} />
                <Text style={styles.optionTitle}>{title}</Text>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={THEME.gradients.background} style={StyleSheet.absoluteFill} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons name="chevron-back" size={28} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Membership</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.introContainer}>
                    <Text style={styles.introText}>Choose your membership type to calculate your daily rewards accurately.</Text>
                </View>

                <CalculatorOption title="BC RBX Counter" type="BC" color="#CD7F32" />
                <CalculatorOption title="TBC RBX Counter" type="TBC" color="#C0C0C0" />
                <CalculatorOption title="OBC RBX Counter" type="OBC" color="#FFD700" />
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
    introContainer: {
        marginBottom: THEME.spacing.xl,
    },
    introText: {
        color: THEME.colors.textSecondary,
        fontSize: 16,
        lineHeight: 24,
    },
    optionContainer: {
        marginBottom: THEME.spacing.md,
        borderRadius: THEME.borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    glassBackground: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: THEME.spacing.lg,
    },
    indicator: {
        width: 4,
        height: 24,
        borderRadius: 2,
        marginRight: THEME.spacing.md,
    },
    optionTitle: {
        flex: 1,
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default SelectCalculator;
