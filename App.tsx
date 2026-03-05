import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './src/screens/Splash/SplashScreen';
import Dashboard from './src/screens/Dashboard/Dashboard';
import Rblxcalc from './src/screens/Calculator/Rblxcalc';
import SelectCalculator from './src/screens/Calculator/SelectCalculator';
import BCRobuxAmount from './src/screens/Calculator/BCRobuxAmount';
import QuizScreen from './src/screens/Games/QuizScreen';
import LuckyScratch from './src/screens/Games/LuckyScratch';
import SpinWheel from './src/screens/Games/SpinWheel';
import RedeemScreen from './src/screens/Utility/RedeemScreen';
import MemesScreen from './src/screens/Utility/MemesScreen';
import ClothesScreen from './src/screens/Utility/ClothesScreen';
import { initRemoteConfig } from './src/utils/remoteConfig';

const Stack = createNativeStackNavigator();

function App() {

  useEffect(() => {
    initRemoteConfig();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Rblxcalc" component={Rblxcalc} />
        <Stack.Screen name="Selectcalculator" component={SelectCalculator} />
        <Stack.Screen name="BCRobuxAmount" component={BCRobuxAmount} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Luckyscratch" component={LuckyScratch} />
        <Stack.Screen name="Spin" component={SpinWheel} />
        <Stack.Screen name="Redemaccount" component={RedeemScreen} />
        <Stack.Screen name="Memesfun" component={MemesScreen} />
        {/* <Stack.Screen name="Clothesselect" component={ClothesScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
