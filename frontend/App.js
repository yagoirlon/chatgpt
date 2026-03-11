import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginScreen, RegisterScreen } from './screens/AuthScreens';
import { HomeScreen, MissionsScreen, TasksScreen, ReferralScreen, WalletScreen, WithdrawalScreen, ProfileScreen, LeaderboardScreen } from './screens/AppScreens';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function SplashScreen() {
  return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 30, fontWeight: '700' }}>StepReward</Text></View>;
}

function MainTabs() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name='Home' component={HomeScreen} />
      <Tabs.Screen name='Missions' component={MissionsScreen} />
      <Tabs.Screen name='Tasks' component={TasksScreen} />
      <Tabs.Screen name='Referral' component={ReferralScreen} />
      <Tabs.Screen name='Wallet' component={WalletScreen} />
      <Tabs.Screen name='Withdraw' component={WithdrawalScreen} />
      <Tabs.Screen name='Leaderboard' component={LeaderboardScreen} />
      <Tabs.Screen name='Profile' component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

function RootNav() {
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showSplash] = useState(false);

  if (showSplash) return <SplashScreen />;
  if (user) return <MainTabs />;
  return showRegister ? <RegisterScreen onSwitch={() => setShowRegister(false)} /> : <LoginScreen onSwitch={() => setShowRegister(true)} />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Root' component={RootNav} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
