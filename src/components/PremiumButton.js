import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { THEME } from '../theme';

const PremiumButton = ({ title, onPress, style, textStyle, gradient = THEME.gradients.primary }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.container, style]}>
            <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                <Text style={[styles.text, textStyle]}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 56,
        borderRadius: THEME.borderRadius.md,
        overflow: 'hidden',
        marginVertical: THEME.spacing.sm,
        elevation: 5,
        shadowColor: THEME.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing.lg,
    },
    text: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
});

export default PremiumButton;
