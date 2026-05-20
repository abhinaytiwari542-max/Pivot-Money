import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Home,
  PieChart,
  MessageCircle,
  UserCircle,
} from 'lucide-react-native';

import { HomeScreen } from './src/screens/HomeScreen';
import { PortfolioScreen } from './src/screens/PortfolioScreen';
import { WhispererScreen } from './src/screens/WhispererScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { MobileFrame } from './src/components/MobileFrame';

const Tab = createBottomTabNavigator();

const ACTIVE_COLOR = '#534AB7';
const INACTIVE_COLOR = '#9CA3AF';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <MobileFrame>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: ACTIVE_COLOR,
              tabBarInactiveTintColor: INACTIVE_COLOR,
              tabBarStyle: {
                backgroundColor: '#FFFFFF',
                borderTopWidth: 1,
                borderTopColor: '#E5E7EB',
                paddingBottom: 6,
                paddingTop: 6,
                height: 56,
                elevation: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
              },
              tabBarLabelStyle: {
                fontSize: 10,
                fontWeight: '600',
                marginTop: 1,
              },
              animation: 'fade',
            }}
          >
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Home size={size - 2} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Portfolio"
              component={PortfolioScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <PieChart size={size - 2} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Whisperer"
              component={WhispererScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MessageCircle size={size - 2} color={color} />
                ),
                tabBarLabel: 'Whisperer',
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <UserCircle size={size - 2} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </MobileFrame>
    </SafeAreaProvider>
  );
}
