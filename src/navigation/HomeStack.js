// HomeStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CustomHeader from '../components/Header';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createStackNavigator();

const HomeStack = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
                header: () => <CustomHeader title="Timer" back={false} />, // Custom header for Home screen
            }}
            // options={{ headerShown: false }}
        />

    </Stack.Navigator>
);

export default HomeStack;

