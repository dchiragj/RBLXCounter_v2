import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    ScrollView,
    Image,
    Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { THEME } from '../../theme';
import PremiumButton from '../../components/PremiumButton';
import { getRedirectUrl } from '../../utils/remoteConfig';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const { width } = Dimensions.get('window');

const CLOTHES_DATA = [
    { id: 1, name: "Long Coat", image: require('../../assets/images/cloth1.png') },
    { id: 2, name: "Boy T-shirt", image: require('../../assets/images/cloth2.png') },
    { id: 3, name: "Winter Jacket", image: require('../../assets/images/cloth3.png') },
    { id: 4, name: "Brown Backpack", image: require('../../assets/images/cloth4.png') },
    { id: 5, name: "Stylish Hat", image: require('../../assets/images/cloth5.png') },
    { id: 6, name: "Cool Sneakers", image: require('../../assets/images/cloth6.png') },
];

const ClothesScreen = ({ navigation }) => {
    const [selectedId, setSelectedId] = useState(1);

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

    const handleNext = async () => {
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

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={THEME.gradients.background} style={StyleSheet.absoluteFill} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons name="chevron-back" size={28} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Roblox Designer</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.subtitle}>Select an item to customize your avatar</Text>

                <View style={styles.grid}>
                    {CLOTHES_DATA.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            activeOpacity={0.8}
                            onPress={() => setSelectedId(item.id)}
                            style={[
                                styles.card,
                                selectedId === item.id && styles.selectedCard
                            ]}
                        >
                            <LinearGradient
                                colors={
                                    selectedId === item.id
                                        ? ['rgba(142,45,226,0.2)', 'rgba(74,0,224,0.1)']
                                        : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']
                                }
                                style={styles.cardGradient}
                            >
                                <View style={styles.imageContainer}>
                                    <Image source={item.image} style={styles.clothImage} resizeMode="contain" />
                                </View>
                                <Text style={styles.clothName}>{item.name}</Text>
                                {selectedId === item.id && (
                                    <View style={styles.checkIcon}>
                                        <Ionicons name="checkmark-circle" size={20} color={THEME.colors.primary} />
                                    </View>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>

                <PremiumButton
                    title="APPLY TO AVATAR"
                    onPress={handleNext}
                    style={styles.nextButton}
                />
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
    subtitle: {
        color: THEME.colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: THEME.spacing.xl,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: THEME.spacing.md,
    },
    card: {
        width: (width - THEME.spacing.md * 3) / 2,
        borderRadius: THEME.borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    selectedCard: {
        borderColor: THEME.colors.primary,
        borderWidth: 2,
    },
    cardGradient: {
        padding: THEME.spacing.md,
        alignItems: 'center',
        height: 180,
    },
    imageContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    clothImage: {
        width: '80%',
        height: '80%',
    },
    clothName: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 10,
    },
    checkIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    nextButton: {
        marginTop: THEME.spacing.xl,
        marginBottom: THEME.spacing.xl,
    },
});

export default ClothesScreen;
