import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';

const CustomHeader = ({ title , back=true}) => {
    const navigation = useNavigation();
    const cartCount = 15; // Hardcoded cart count for this example
    const wishListCount = 5; // Hardcoded cart count for this example
    const notificationsCount = 9;

    return (
        // <View style={tw`flex-row justify-between items-center bg-gray-300 p-4 pt-12`}>
        <LinearGradient
            colors={['#0D47A1',  '#FFFFFF']} // Blue to white gradient
            style={tw`flex-row justify-between items-center p-4 pt-12`} // Tailwind classes for other styling
        >
            <View style={tw`flex-row items-center`}>
                {back && <Ionicons
                    name="arrow-back"
                    size={24}
                    style={tw``}
                    onPress={() => navigation.goBack()}
                />}
                <Text style={tw`text-lg font-bold ml-2 `}>{title} <Text className="text-[12px] text-grey-200">{title === 'Wishlist' && `(${wishListCount} items)`} </Text></Text>
            </View>
           
        </LinearGradient>
    );
};

export default CustomHeader;
