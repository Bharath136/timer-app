import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const HistoryScreen = () => {
    const [completedTimers, setCompletedTimers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCompletedTimers = async () => {
        try {
            const saved = await AsyncStorage.getItem('timers');
            const parsed = saved ? JSON.parse(saved) : [];
            const completed = parsed.filter(timer => timer.status === 'completed');
            setCompletedTimers(completed);
        } catch (error) {
            console.error('Failed to fetch timers:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchCompletedTimers();
        }, [])
    );

    const clearHistory = async () => {
        try {
            const saved = await AsyncStorage.getItem('timers');
            const parsed = saved ? JSON.parse(saved) : [];
            const nonCompleted = parsed.filter(timer => timer.status !== 'completed');
            await AsyncStorage.setItem('timers', JSON.stringify(nonCompleted));
            setCompletedTimers([]);
        } catch (error) {
            console.error('Failed to clear history:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.timerCard}>
            <Text style={styles.timerName}>{item.name}</Text>
            <Text style={styles.timerInfo}>
                Category: <Text style={styles.bold}>{item.category}</Text>
            </Text>
            <Text style={styles.timerInfo}>
                Duration: <Text style={styles.bold}>{item.duration}s</Text>
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>⏱ Completed Timers</Text>

            <TouchableOpacity
                onPress={clearHistory}
                style={[styles.primaryButton, { backgroundColor: '#d32f2f', marginBottom: 15 }]}
            >
                <Text style={styles.buttonText}>Clear History</Text>
            </TouchableOpacity>

            {loading ? (
                <Text style={styles.noData}>Loading history...</Text>
            ) : completedTimers.length === 0 ? (
                <Text style={styles.noData}>No completed timers yet.</Text>
            ) : (
                <FlatList
                    data={completedTimers}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f9fc',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e1e1e',
        marginBottom: 15,
    },
    noData: {
        textAlign: 'center',
        color: '#888',
        fontSize: 16,
        marginTop: 50,
    },
    listContent: {
        paddingBottom: 20,
    },
    timerCard: {
        backgroundColor: '#ffffff',
        borderLeftWidth: 5,
        borderLeftColor: '#4caf50',
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    timerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    timerInfo: {
        fontSize: 14,
        color: '#555',
        marginBottom: 2,
    },
    bold: {
        fontWeight: '600',
        color: '#222',
    },
    primaryButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default HistoryScreen;
