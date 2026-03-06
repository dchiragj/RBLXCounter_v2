import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Share,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { THEME } from '../../theme';
import { getRemoteConfigData } from '../../utils/remoteConfig';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { SafeAreaView } from 'react-native-safe-area-context';

const MEME_DATA = [
    { title: "Robux Dreamer", subtitle: "When you calculate how many chores it'll take to afford 400 Robux." },
    { title: "The Robux Beggar", subtitle: "When you ask in chat for free Robux, knowing no one’s gonna give you any." },
    { title: "Robux Inflation", subtitle: "When everything in the catalog suddenly costs 1000 Robux." },
    { title: "Rich Server, Poor You", subtitle: "Everyone flexes their limiteds, and you're still rockin the Bacon hair." },
    { title: "Robux Sale Hype", subtitle: "When you hear there's a Robux sale... but it's just 5% off." },
    { title: "Just One More Robux", subtitle: "When you're 1 Robux short from buying your dream item." },
    { title: "Daily Login Disappointment", subtitle: "You login in daily hoping for free Robux. Still nothing." },
    { title: "The Game Pass Trap", subtitle: "you join a cool game , then realize every feature needs Robux." },
];

const MemesScreen = ({ navigation }) => {

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

    const handleShare = async (title, subtitle) => {
        try {
            await Share.share({
                message: `${title}\n${subtitle}\n\nCheck out RBLX Counter for more fun!`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const MemeCard = ({ title, subtitle }) => (
        <View style={styles.memeCard}>
            <LinearGradient
                colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']}
                style={styles.memeGradient}
            >
                <View style={styles.memeHeader}>
                    <View style={styles.memeAvatar}>
                        <Ionicons name="happy-outline" size={24} color={THEME.colors.secondary} />
                    </View>
                    <Text style={styles.memeTitle}>{title}</Text>
                </View>
                <Text style={styles.memeText}>{subtitle}</Text>
                <TouchableOpacity
                    style={styles.shareButton}
                    onPress={() => handleShare(title, subtitle)}
                >
                    <Ionicons name="share-social" size={18} color="#FFF" />
                    <Text style={styles.shareText}>Share Meme</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={THEME.gradients.background} style={StyleSheet.absoluteFill} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons name="chevron-back" size={28} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Roblox Memes</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {MEME_DATA.map((meme, index) => (
                    <MemeCard key={index} {...meme} />
                ))}

                {/* Promo Image */}
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
        padding: THEME.spacing.md,
    },
    memeCard: {
        marginBottom: THEME.spacing.lg,
        borderRadius: THEME.borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    memeGradient: {
        padding: THEME.spacing.lg,
    },
    memeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: THEME.spacing.md,
    },
    memeAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,215,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: THEME.spacing.md,
    },
    memeTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    memeText: {
        color: THEME.colors.textSecondary,
        fontSize: 15,
        lineHeight: 22,
        marginBottom: THEME.spacing.lg,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: THEME.colors.primary,
        paddingVertical: 10,
        borderRadius: THEME.borderRadius.md,
    },
    shareText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    promoContainer: {
        marginTop: THEME.spacing.md,
        marginBottom: THEME.spacing.xl,
        borderRadius: THEME.borderRadius.lg,
        overflow: 'hidden',
    },
    promoImage: {
        width: '100%',
        height: 250,
    },
});

export default MemesScreen;
