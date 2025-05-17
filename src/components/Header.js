import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

const CustomHeader = ({ title, back = true }) => {
    const navigation = useNavigation();

    return (
        <View style={tw`flex-row items-center p-4 pt-12`}>
            {back && <Ionicons
                name="arrow-back"
                size={24}
                style={tw``}
                onPress={() => navigation.goBack()}
            />}
            <Text style={tw`text-lg font-bold ml-2 `}>{title}</Text>
        </View>
    );
};

export default CustomHeader;
