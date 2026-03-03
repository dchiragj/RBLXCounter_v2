import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Pressable, StatusBar, Modal } from "react-native";
import InAppBrowser from "react-native-inappbrowser-reborn";
import { getRedirectUrl } from "../../utils/remoteConfig";
import { SafeAreaView } from "react-native-safe-area-context";

const Dashboard = () => {

    const navigation = useNavigation();

    const [coins, setCoins] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [alreadyClaimedModal, setAlreadyClaimedModal] = useState(false);
    const [todayReward, setTodayReward] = useState(20);  // dynamic
    const [claimedToday, setClaimedToday] = useState(false);

    useEffect(() => {
        loadCoins();
        checkClaimStatus();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const state = navigation.getState();
            const currentRoute = state.routes[state.index];

            if (currentRoute.params?.spinReward) {
                handleSpinReward(currentRoute.params.spinReward);
                // Clear the params
                navigation.setParams({ spinReward: undefined });
            }
        });

        return unsubscribe;
    }, [navigation]);

    const loadCoins = async () => {
        try {
            const savedCoins = await AsyncStorage.getItem("user_coins");
            console.log("💰 Loaded coins from storage:", savedCoins);
            if (savedCoins) {
                const coinsValue = parseInt(savedCoins);
                setCoins(coinsValue);
            } else {
                setCoins(0);
                await AsyncStorage.setItem("user_coins", "0");
            }
        } catch (error) {
            console.log("Error loading coins:", error);
        }
    };

    const saveCoins = async (newCoins) => {
        try {
            await AsyncStorage.setItem("user_coins", newCoins.toString());
        } catch (error) {
            console.log("Error saving coins:", error);
        }

    };

    const handleSpinReward = async (reward) => {
        try {
            const currentCoins = await AsyncStorage.getItem("user_coins");
            const currentCoinsValue = parseInt(currentCoins) || 0;

            if (reward && reward > 0) {
                const newCoins = currentCoinsValue + reward;
                setCoins(newCoins);
                await saveCoins(newCoins);
            }
        } catch (error) {
            console.log("Error in handleSpinReward:", error);
        }
    };

    const checkClaimStatus = async () => {
        try {
            let lastClaimDate = await AsyncStorage.getItem("daily_claim_date");
            let today = new Date().toDateString();
            if (lastClaimDate === today) {
                setClaimedToday(true);
            }
        } catch (error) {
            console.log("Error checking claim status:", error);
        }
    };

    const handleDailyReward = () => {
        if (claimedToday) {
            setAlreadyClaimedModal(true);
        } else {
            setModalVisible(true);
        }
    };

    const handleAddNow = async () => {
        try {
            const currentCoins = await AsyncStorage.getItem("user_coins");
            const currentCoinsValue = parseInt(currentCoins) || 0;

            const newCoins = currentCoinsValue + todayReward;
            setCoins(newCoins);

            await saveCoins(newCoins);

            let today = new Date().toDateString();
            await AsyncStorage.setItem("daily_claim_date", today);
            setClaimedToday(true);

            setModalVisible(false);


            const url = getRedirectUrl();
            await InAppBrowser.open(url, {
                dismissButtonStyle: 'close  ',
                preferredBarTintColor: '#f78c2c',
                preferredControlTintColor: 'white',
                readerMode: false,
                showTitle: true,
                toolbarColor: '#f78c2c',
                secondaryToolbarColor: 'white',
                enableUrlBarHiding: true,
                enableDefaultShare: true,
                forceCloseOnRedirection: false,
            });

        } catch (error) {
            console.log("Error in handleAddNow:", error);
        }
    };

    // set the all click event on ads
    const openAdLink = async () => {
        const url = getRedirectUrl();
        try {
            await InAppBrowser.open(url, {
                dismissButtonStyle: 'close  ',
                preferredBarTintColor: '#f78c2c',
                preferredControlTintColor: 'white',
                readerMode: false,
                showTitle: true,
                toolbarColor: '#f78c2c',
                secondaryToolbarColor: 'white',
                enableUrlBarHiding: true,
                enableDefaultShare: true,
                forceCloseOnRedirection: false,
            });
        } catch (e) {
            console.log('Browser closed or error', e);
        }
    };

    const handleAdThenNavigate = async (screenName, params = {}) => {
        const url = getRedirectUrl();

        try {
            await InAppBrowser.open(url, {
                dismissButtonStyle: 'close  ',
                preferredBarTintColor: '#f78c2c',
                preferredControlTintColor: 'white',
                readerMode: false,
                showTitle: true,
                toolbarColor: '#f78c2c',
                secondaryToolbarColor: 'white',
                enableUrlBarHiding: true,
                enableDefaultShare: true,
                forceCloseOnRedirection: false,
            });

            navigation.navigate(screenName, params);

        } catch (e) {
            console.log("InAppBrowser Error:", e);
            navigation.navigate(screenName, params);
        }
    };

    return (
        <SafeAreaView style={styles.container} >
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Get Daily Rbux</Text>
                    <Text style={styles.headerSubtitle}>Counters & RBC Calc</Text>
                </View>
                <View style={styles.coinContainer}>
                    <Image
                        source={require('../../assets/images/coin.png')}
                        style={styles.coinIcon}
                        resizeMode="contain"
                    />
                    <Text style={styles.coinText}>{coins}</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 45 }}>
                {/* Daily Converter Card */}
                <Pressable style={styles.converterCard} onPress={() => handleAdThenNavigate('Rblxcalc')}>
                    <Image
                        source={require('../../assets/images/daily_converter.png')}
                        style={styles.converterImage}
                        resizeMode="contain"
                    />
                </Pressable>

                {/* Promo Image */}
                <Pressable style={styles.promoContainer} onPress={openAdLink}>
                    <Image
                        source={require('../../assets/images/big_ad_img5.png')}
                        style={styles.promoImage}
                        resizeMode="cover"
                    />
                </Pressable>

                {/* ---------- ROW 1 ---------- */}
                <View style={styles.row}>
                    <Pressable style={styles.tile} onPress={handleDailyReward}>
                        <Image
                            source={require('../../assets/images/daily_rbx.png')}
                            style={styles.tileImage}
                            resizeMode="contain"
                        />
                    </Pressable>

                    <Pressable style={styles.tile} onPress={() => handleAdThenNavigate('Spin')}>
                        <Image
                            source={require('../../assets/images/spin_wheel.png')}
                            style={styles.tileImage}
                            resizeMode="contain"
                        />
                    </Pressable>
                </View>

                {/* ---------- ROW 2 ---------- */}
                <View style={styles.row}>
                    <Pressable style={styles.tile} onPress={() => handleAdThenNavigate('Luckyscratch')}>
                        <Image
                            source={require('../../assets/images/scratch_card_main.png')}
                            style={styles.tileImage}
                            resizeMode="contain"
                        />
                    </Pressable>

                    <Pressable style={styles.tile} onPress={() => handleAdThenNavigate('Quiz')}>
                        <Image
                            source={require('../../assets/images/logic_quize_time.png')}
                            style={styles.tileImage}
                            resizeMode="contain"
                        />
                    </Pressable>
                </View>

                {/* ---------- ROW 3 ---------- */}
                <View style={styles.row}>
                    <Pressable style={styles.tile} onPress={() => handleAdThenNavigate('Redemaccount')}>
                        <Image
                            source={require('../../assets/images/redeem_coin.png')}
                            style={styles.tileImage}
                            resizeMode="contain"
                        />
                    </Pressable>

                    <Pressable style={styles.tile} onPress={() => handleAdThenNavigate('Memesfun')}>
                        <Image
                            source={require('../../assets/images/meme_fun.png')}
                            style={styles.tileImage}
                            resizeMode="contain"
                        />
                    </Pressable>
                </View>

                {/* Promo Image */}
                <Pressable style={styles.promoContainer} onPress={openAdLink}>
                    <Image
                        source={require('../../assets/images/big_ad_img4.png')}
                        style={styles.promoImage}
                        resizeMode="cover"
                    />
                </Pressable>

                <View style={{ marginTop: 15 }}>
                    <Pressable style={styles.convertbox} onPress={() => handleAdThenNavigate('BCRobuxAmount', { type: 'dollarToRbx' })}>
                        <Image source={require('../../assets/images/dollar_rbx.png')} resizeMode="contain" style={styles.convertimage} />
                    </Pressable>

                    <Pressable style={styles.convertbox} onPress={() => handleAdThenNavigate('BCRobuxAmount', { type: 'rbxToDollar' })}>
                        <Image source={require('../../assets/images/rbx_dollar.png')} resizeMode="contain" style={styles.convertimage} />
                    </Pressable>
                </View>

            </ScrollView>


            {/* DAILY REWARD MODAL */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalMain}>
                    <View style={styles.modalBox}>

                        <Image
                            source={require('../../assets/images/reward_img.png')}
                            style={{ width: 150, height: 150, alignSelf: "center" }}
                        />

                        <Text style={styles.mainText}>Well done! You've achieved</Text>
                        <Text style={styles.coinWon}>You Won {todayReward} Coins</Text>

                        <TouchableOpacity style={styles.addButton} onPress={handleAddNow}>
                            <Text style={styles.addText}>Add Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* ALREADY CLAIMED MODAL */}
            <Modal visible={alreadyClaimedModal} transparent animationType="fade">
                <View style={styles.modalMain}>
                    <View style={styles.modalBox}>
                        <Image
                            source={require('../../assets/images/try_again_img.png')}
                            style={{ width: 150, height: 150, alignSelf: "center" }}
                        />

                        <Text style={[styles.mainText, { marginHorizontal: 25 }]}>You Have Already Collect Today's Reward, Try again Tomorrow</Text>

                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => setAlreadyClaimedModal(false)}
                        >
                            <Text style={styles.addText}>Okay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 17,
        color: "#aaa",
    },
    headerSubtitle: {
        fontSize: 20,
        color: "#fff",
        marginTop: 2,
        fontWeight: "700",
    },
    coinContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1F1F1F",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
    },
    coinIcon: {
        width: 25,
        height: 25,
    },
    coinText: {
        color: "#fff",
        marginLeft: 6,
        fontWeight: "600",
        fontSize: 16
    },
    converterCard: {
        width: '100%',
        height: 120,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: "center"
    },
    converterImage: {
        width: '100%',
        height: '100%',
        justifyContent: "center"
    },
    promoContainer: {
        marginVertical: 10,
        width: '100%',
        alignSelf: 'center',
    },
    promoImage: {
        width: '98%',
        height: 250,
        borderRadius: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    tile: {
        width: '48%',
        aspectRatio: 1.1,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tileImage: {
        width: '100%',
        height: '100%',
    },
    convertbox: {
        width: '100%',
        height: 100
    },
    convertimage: {
        height: '100%',
        width: '100%'
    },
    modalMain: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: '#221f2e',
        borderRadius: 30,
        padding: 20,
        alignItems: 'center',
        width: '100%',
        maxWidth: 350,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
        elevation: 20,
        borderWidth: 1,
        borderColor: '#221f2e'
    },
    mainText: {
        color: "#fff",
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center'
    },
    coinWon: {
        color: "#E9B300",
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 5
    },
    addButton: {
        backgroundColor: "#aa42fe",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 10
    },
    addText: { color: "#fff", fontSize: 17, fontWeight: "600" }
});
