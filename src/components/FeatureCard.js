import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { THEME } from '../theme';

const { width } = Dimensions.get('window');

const FeatureCard = ({ title, image, icon, onPress }) => {
    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.container}>
            <LinearGradient
                colors={['rgba(30, 30, 50, 0.8)', 'rgba(20, 20, 40, 0.9)']}
                style={styles.card}
            >
                <View style={styles.content}>
                    <View style={styles.imageWrapper}>
                        {image ? (
                            <Image source={image} style={styles.image} resizeMode="contain" />
                        ) : (
                            <Ionicons name={icon || 'cube'} size={40} color={THEME.colors.primary} />
                        )}
                    </View>

                    <Text style={styles.title}>{title}</Text>

                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Click Here</Text>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: (width - 48) / 2,
        marginBottom: 16,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    card: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 180,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    imageWrapper: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    title: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
        height: 44, // Fixed height for 2 lines
        textAlignVertical: 'center',
    },
    button: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        width: '90%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 12,
        fontWeight: '800',
    },
});

export default FeatureCard;
