import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Animated,
    Dimensions,
    Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { THEME } from '../../theme';
import PremiumButton from '../../components/PremiumButton';
import { getRedirectUrl } from '../../utils/remoteConfig';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const { width } = Dimensions.get('window');

const QUIZ_DATA = {
    1: [
        {
            question: "In 'Tower of Hell', which difficulty is considered the hardest for most players?",
            options: ['Tower of Hell', 'Tower of Speed', 'Tower of Rage', 'Tower of Misery'],
            correct: 'Tower of Hell'
        },
        {
            question: "What is the virtual currency used in Roblox?",
            options: ['V-Bicks', 'Minecoins', 'Robux', 'Gold'],
            correct: 'Robux'
        },
        {
            question: "Which of these is a famous Roblox game?",
            options: ['GTAV', 'Fortnite', 'Adopt Me!', 'Clash of Clans'],
            correct: 'Adopt Me!'
        },
        {
            question: "What is the programming language used in Roblox Studio?",
            options: ['Java', 'Python', 'Lua', 'C++'],
            correct: 'Lua'
        },
        {
            question: "What can players use Roblox for?",
            options: ['Buy pets', 'Customize avatar', 'Purchase game passes', 'All of the above'],
            correct: 'All of the above'
        }
    ],
    2: [
        {
            question: "Which hat is considered a legendary Roblox item?",
            options: ['Traffic Cone', 'Dominus', 'Fedora', 'Baseball Cap'],
            correct: 'Dominus'
        },
        {
            question: "What is the maximum number of friends you can have on Roblox?",
            options: ['100', '150', '200', 'Unlimited'],
            correct: '150'
        },
        {
            question: "Which Roblox game lets you raise pets and trade with others?",
            options: ['Arsenal', 'Tower of Hell', 'Brookhaven', 'Adopt Me!'],
            correct: 'Brookhaven'
        },
        {
            question: "Which platform does NOT support Roblox?",
            options: ['PC', 'Xbox', 'Nintendo Switch', 'Mobile'],
            correct: 'Nintendo Switch'
        },
        {
            question: "What is a game pass in Roblox?",
            options: ['A way to skip levels', 'A badge', 'A paid item giving special abilities', 'A free hat'],
            correct: 'A paid item giving special abilities'
        }
    ]
};

const QuizScreen = ({ navigation }) => {
    const [currentLevel, setCurrentLevel] = useState(1);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showResultModal, setShowResultModal] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);

    const fadeAnim = useRef(new Animated.Value(1)).current;

    const currentQuestions = QUIZ_DATA[currentLevel];
    const currentQuestion = currentQuestions[currentQIndex];

    const handleOptionPress = (option) => {
        if (isAnswered) return;

        setSelectedOption(option);
        setIsAnswered(true);

        const isCorrect = option === currentQuestion.correct;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            if (currentQIndex < currentQuestions.length - 1) {
                // Next Question
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    setCurrentQIndex(prev => prev + 1);
                    setSelectedOption(null);
                    setIsAnswered(false);
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }).start();
                });
            } else {
                // End of Level
                setShowResultModal(true);
            }
        }, 1500);
    };

    const getOptionStyle = (option) => {
        if (!selectedOption) return styles.optionButton;

        if (option === currentQuestion.correct) {
            return [styles.optionButton, styles.optionCorrect];
        }
        if (option === selectedOption && option !== currentQuestion.correct) {
            return [styles.optionButton, styles.optionWrong];
        }
        return styles.optionButton;
    };

    const startNextLevel = () => {
        if (currentLevel < Object.keys(QUIZ_DATA).length) {
            setCurrentLevel(prev => prev + 1);
            setCurrentQIndex(0);
            setScore(0);
            setSelectedOption(null);
            setIsAnswered(false);
            setShowResultModal(false);
        } else {
            navigation.goBack();
        }
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

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={THEME.gradients.background} style={StyleSheet.absoluteFill} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons name="chevron-back" size={28} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Robux Quiz</Text>
                <View style={styles.scoreBadge}>
                    <Text style={styles.scoreText}>{score}/{currentQuestions.length}</Text>
                </View>
            </View>

            <View style={styles.levelProgressContainer}>
                <Text style={styles.levelText}>Level {currentLevel}</Text>
                <View style={styles.progressBarBg}>
                    <View
                        style={[
                            styles.progressBarFill,
                            { width: `${((currentQIndex + 1) / currentQuestions.length) * 100}%` }
                        ]}
                    />
                </View>
            </View>

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <View style={styles.questionCard}>
                    <Text style={styles.questionText}>{currentQuestion.question}</Text>
                </View>

                <View style={styles.optionsGrid}>
                    {currentQuestion.options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.8}
                            onPress={() => handleOptionPress(option)}
                            style={getOptionStyle(option)}
                            disabled={isAnswered}
                        >
                            <Text style={styles.optionText}>{option}</Text>
                            {selectedOption === option && (
                                <Ionicons
                                    name={option === currentQuestion.correct ? "checkmark-circle" : "close-circle"}
                                    size={24}
                                    color="#FFF"
                                />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </Animated.View>

            <Modal transparent visible={showResultModal} animationType="fade">
                <View style={styles.modalOverlay}>
                    <LinearGradient
                        colors={['#1A1A2E', '#16213E']}
                        style={styles.modalBox}
                    >
                        <Ionicons name="trophy" size={80} color={THEME.colors.secondary} />
                        <Text style={styles.modalTitle}>Level {currentLevel} Complete!</Text>
                        <Text style={styles.modalScore}>Score: {score}/{currentQuestions.length}</Text>

                        <PremiumButton
                            title={currentLevel < Object.keys(QUIZ_DATA).length ? "Next Level" : "Finish Quiz"}
                            onPress={startNextLevel}
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
    scoreBadge: {
        backgroundColor: 'rgba(142, 45, 226, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(142, 45, 226, 0.4)',
    },
    scoreText: {
        color: THEME.colors.primary,
        fontWeight: 'bold',
    },
    levelProgressContainer: {
        paddingHorizontal: THEME.spacing.lg,
        marginTop: THEME.spacing.md,
    },
    levelText: {
        color: THEME.colors.textSecondary,
        fontSize: 14,
        marginBottom: 8,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: THEME.colors.primary,
    },
    content: {
        flex: 1,
        padding: THEME.spacing.lg,
        justifyContent: 'center',
    },
    questionCard: {
        padding: THEME.spacing.xl,
        borderRadius: THEME.borderRadius.xl,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: THEME.spacing.xl,
    },
    questionText: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 32,
    },
    optionsGrid: {
        gap: THEME.spacing.md,
    },
    optionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: THEME.spacing.lg,
        borderRadius: THEME.borderRadius.lg,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    optionText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
    },
    optionCorrect: {
        backgroundColor: 'rgba(74, 222, 128, 0.2)',
        borderColor: '#4ADE80',
    },
    optionWrong: {
        backgroundColor: 'rgba(248, 113, 113, 0.2)',
        borderColor: '#F87171',
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
    modalTitle: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: THEME.spacing.lg,
    },
    modalScore: {
        color: THEME.colors.textSecondary,
        fontSize: 18,
        marginVertical: THEME.spacing.lg,
    },
});

export default QuizScreen;
