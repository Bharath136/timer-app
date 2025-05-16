import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CustomHeader from '../components/Header';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createStackNavigator();

const HistoryStack = () => (
    <Stack.Navigator>
        
        <Stack.Screen
            name="HistoryScreen"
            component={HistoryScreen}
            options={{
                header: () => <CustomHeader title="History" back={false} />, // Custom header for Home screen
            }}
        />


    </Stack.Navigator>
);

export default HistoryStack;

