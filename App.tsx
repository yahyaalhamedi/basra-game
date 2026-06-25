// ============================================================
// Basra Manager — Main Application Entry
// ============================================================

import React, { useEffect } from 'react';
import { I18nManager, StatusBar, Platform, UIManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import ScoreboardScreen from './src/screens/ScoreboardScreen';
import RotationScreen from './src/screens/RotationScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import { theme, colors } from './src/theme/theme';
import {
  TAB_SCOREBOARD,
  TAB_ROTATION,
  TAB_LEADERBOARD,
} from './src/utils/constants';

// Force RTL layout for Arabic
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

// Enable layout animations on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Tab = createBottomTabNavigator();

type TabIconName = 'scoreboard' | 'scoreboard-outline' | 'account-switch' | 'account-switch-outline' | 'trophy' | 'trophy-outline';

const TAB_ICONS: Record<string, { focused: TabIconName; unfocused: TabIconName }> = {
  Scoreboard: { focused: 'scoreboard', unfocused: 'scoreboard-outline' },
  Rotation: { focused: 'account-switch', unfocused: 'account-switch-outline' },
  Leaderboard: { focused: 'trophy', unfocused: 'trophy-outline' },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <StatusBar barStyle="light-content" backgroundColor={colors.background} />
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                  const icons = TAB_ICONS[route.name];
                  const iconName = focused ? icons.focused : icons.unfocused;
                  return (
                    <MaterialCommunityIcons
                      name={iconName}
                      size={size}
                      color={color}
                    />
                  );
                },
                tabBarActiveTintColor: colors.tabActive,
                tabBarInactiveTintColor: colors.tabInactive,
                tabBarStyle: {
                  backgroundColor: colors.tabBarBg,
                  borderTopColor: colors.tabBarBorder,
                  borderTopWidth: 1,
                  height: Platform.OS === 'ios' ? 88 : 64,
                  paddingBottom: Platform.OS === 'ios' ? 28 : 8,
                  paddingTop: 8,
                  elevation: 0,
                  shadowOpacity: 0,
                },
                tabBarLabelStyle: {
                  fontSize: 12,
                  fontWeight: '600',
                  writingDirection: 'rtl',
                },
                tabBarHideOnKeyboard: true,
              })}
            >
              <Tab.Screen
                name="Scoreboard"
                component={ScoreboardScreen}
                options={{ tabBarLabel: TAB_SCOREBOARD }}
              />
              <Tab.Screen
                name="Rotation"
                component={RotationScreen}
                options={{ tabBarLabel: TAB_ROTATION }}
              />
              <Tab.Screen
                name="Leaderboard"
                component={LeaderboardScreen}
                options={{ tabBarLabel: TAB_LEADERBOARD }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
