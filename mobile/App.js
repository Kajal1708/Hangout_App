import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import UsersScreen from './screens/UsersScreen';
import RequestsScreen from './screens/RequestsScreen';
import ConnectionsScreen from './screens/ConnectionsScreen';
import HangoutScreen from './screens/HangoutScreen';
import HangoutApprovalRequestsScreen from './screens/HangoutApprovalRequestsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Users"
        component={UsersScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="account-multiple" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Requests"
        component={RequestsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="account-clock" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Connections"
        component={ConnectionsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="account-check" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Hangouts"
        component={HangoutScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="account-group" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Approvals"
        component={HangoutApprovalRequestsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="account-alert" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
