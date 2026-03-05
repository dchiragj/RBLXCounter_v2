import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { THEME } from '../../theme';

const SplashScreen = ({ navigation }) => {
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.8);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
        ]).start();

        // Navigate to Dashboard after 3 seconds
        const timer = setTimeout(() => {
            navigation.replace('Dashboard');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={THEME.gradients.background}
                style={StyleSheet.absoluteFill}
            />
            <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
                <Image
                    source={require('../../assets/images/splash.png')}
                    style={styles.logo}
                    resizeMode="cover"
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
});

export default SplashScreen;
