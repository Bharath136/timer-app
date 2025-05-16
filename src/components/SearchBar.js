

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // or from 'react-native-vector-icons/Ionicons' if not using Expo
import tw from 'twrnc';
import Voice from 'react-native-voice'; // Import react-native-voice

export default function SearchBar() {
    const [searchText, setSearchText] = useState('');
    const [isListening, setIsListening] = useState(false);

    // Initialize voice recognition
    useEffect(() => {
        // Event listener for speech start
        Voice.onSpeechStart = () => {
            setIsListening(true);
        };

        // Event listener for speech end
        Voice.onSpeechEnd = () => {
            setIsListening(false);
        };

        // Event listener for speech results
        Voice.onSpeechResults = (e) => {
            setSearchText(e.value[0]); // Set the recognized speech as search text
        };

        // Clean up listeners when the component unmounts
        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    // Handle start and stop of speech recognition
    const handleSpeechToText = async () => {
        if (isListening) {
            // Stop listening if already listening
            await Voice.stop();
        } else {
            // Start listening if not listening
            await Voice.start('en-US'); // 'en-US' is the language code for English
        }
    };

    return (
        <View style={tw`px-4 py-2 border-b border-gray-100 shadow-b`}>
            <View style={tw`flex-row items-center bg-gray-200 rounded px-4 py-1`}>
                <TextInput
                    style={tw`flex-1 text-gray-500`} // Takes up remaining space for search input
                    placeholder="Search..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <TouchableOpacity onPress={handleSpeechToText}>
                    <Ionicons
                        name={isListening ? 'mic-off' : 'mic'}  // Change icon based on listening state
                        size={20}
                        style={tw`ml-2`}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}
