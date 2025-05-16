import React, { useEffect, useState, useRef, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Alert,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar } from 'react-native-paper';
import { useTimerContext } from '../contexts/TimerContext';

const categories = ['Study', 'Workout', 'Break', 'Game'];

const HomeScreen = () => {
    const [timers, setTimers] = useState([]);
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [modalVisible, setModalVisible] = useState(false);
    const [completedTimer, setCompletedTimer] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState({});
    const intervals = useRef({});

  

    useEffect(() => {
        loadTimers();
        return () => {
            Object.values(intervals.current).forEach(clearInterval);
        };
    }, []);

    const loadTimers = async () => {
        const saved = await AsyncStorage.getItem('timers');
        const parsed = saved ? JSON.parse(saved) : [];
        setTimers(parsed);
    };

    const saveTimers = async (data) => {
        await AsyncStorage.setItem('timers', JSON.stringify(data));
    };

    const addTimer = async () => {
        if (!name || !duration || isNaN(duration) || parseInt(duration) <= 0) {
            Alert.alert('Invalid input', 'Please enter a valid name and duration');
            return;
        }
        const newTimer = {
            id: Date.now().toString(),
            name,
            duration: parseInt(duration),
            remaining: parseInt(duration),
            category,
            status: 'paused',
        };
        const updated = [...timers, newTimer];
        setTimers(updated);
        await saveTimers(updated);
        setName('');
        setDuration('');
        setCategory(categories[0]);
    };

    const startTimer = (id) => {
        if (intervals.current[id]) return;

        intervals.current[id] = setInterval(() => {
            setTimers((prevTimers) => {
                const updatedTimers = prevTimers.map((timer) => {
                    if (timer.id === id) {
                        if (timer.remaining > 1) {
                            const updatedTimer = { ...timer, remaining: timer.remaining - 1 };
                            if (!timer.halfwayAlertShown && updatedTimer.remaining === Math.floor(timer.duration / 2)) {
                                Alert.alert('Halfway Alert', `${timer.name} is halfway done!`);
                                updatedTimer.halfwayAlertShown = true;
                            }
                            return updatedTimer;
                        } else {
                            clearInterval(intervals.current[id]);
                            delete intervals.current[id];
                            const completed = { ...timer, remaining: 0, status: 'completed' };
                            setCompletedTimer(completed);
                            setModalVisible(true);
                            return completed;
                        }
                    }
                    return timer;
                });
                saveTimers(updatedTimers);
                return updatedTimers;
            });
        }, 1000);
        updateTimerStatus(id, 'running');
    };

    const pauseTimer = (id) => {
        if (intervals.current[id]) {
            clearInterval(intervals.current[id]);
            delete intervals.current[id];
        }
        updateTimerStatus(id, 'paused');
    };

    const resetTimer = (id) => {
        if (intervals.current[id]) {
            clearInterval(intervals.current[id]);
            delete intervals.current[id];
        }
        setTimers((prev) => {
            const updated = prev.map(timer =>
                timer.id === id ? { ...timer, remaining: timer.duration, status: 'paused' } : timer
            );
            saveTimers(updated);
            return updated;
        });
    };

    const updateTimerStatus = (id, status) => {
        setTimers((prev) => {
            const updated = prev.map(timer => timer.id === id ? { ...timer, status } : timer);
            saveTimers(updated);
            return updated;
        });
    };

    const groupedTimers = timers.reduce((acc, timer) => {
        acc[timer.category] = acc[timer.category] || [];
        acc[timer.category].push(timer);
        return acc;
    }, {});

    const toggleCategory = (category) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const startAllTimersInCategory = (category) => {
        const timersToStart = groupedTimers[category].filter(t => t.status !== 'running' && t.status !== 'completed');
        timersToStart.forEach(t => startTimer(t.id));
    };

    const pauseAllTimersInCategory = (category) => {
        const timersToPause = groupedTimers[category].filter(t => t.status === 'running');
        timersToPause.forEach(t => pauseTimer(t.id));
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>⏱️ Add New Timer</Text>
            <TextInput placeholder="Timer Name" value={name} onChangeText={setName} style={styles.input} />
            <TextInput placeholder="Duration (seconds)" value={duration} onChangeText={setDuration} keyboardType="numeric" style={styles.input} />

            <Text style={styles.sectionLabel}>Select Category</Text>
            <View style={styles.categoryPicker}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[
                            styles.categoryOption,
                            cat === category && styles.categoryOptionSelected,
                        ]}
                        onPress={() => setCategory(cat)}
                    >
                        <Text style={cat === category ? styles.categoryTextSelected : styles.categoryText}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={addTimer}>
                <Text style={styles.buttonText}> Add Timer</Text>
            </TouchableOpacity>

            {Object.entries(groupedTimers).map(([cat, timers]) => {
                const isExpanded = expandedCategories[cat];
                return (
                    <View key={cat} style={styles.categoryGroup}>
                        <TouchableOpacity onPress={() => toggleCategory(cat)} style={styles.categoryHeader}>
                            <Text style={styles.categoryTitle}>{isExpanded ? '▼' : '▶'} {cat}</Text>
                            <View style={styles.bulkButtons}>
                                <TouchableOpacity onPress={() => startAllTimersInCategory(cat)} style={styles.smallButton}>
                                    <Text style={styles.buttonText}>Start All</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => pauseAllTimersInCategory(cat)} style={styles.smallButton}>
                                    <Text style={styles.buttonText}>Pause All</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                        {isExpanded && timers.map(timer => (
                            <View key={timer.id} style={styles.timerCard}>
                                <Text style={styles.timerName}>{timer.name}</Text>
                                <Text>Status: {timer.status}</Text>
                                <Text>Remaining: {timer.remaining}s</Text>
                                <ProgressBar progress={timer.remaining / timer.duration} color={'#4caf50'} style={styles.progress} />
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity onPress={() => startTimer(timer.id)} disabled={timer.status === 'running' || timer.status === 'completed'} style={styles.smallButton}>
                                        <Text style={styles.buttonText}>Start</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => pauseTimer(timer.id)} disabled={timer.status !== 'running'} style={styles.smallButton}>
                                        <Text style={styles.buttonText}>Pause</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => resetTimer(timer.id)} style={styles.smallButton}>
                                        <Text style={styles.buttonText}>Reset</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                );
            })}

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>🎉 Timer "{completedTimer?.name}" Completed!</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.primaryButton}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f2f2f7' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#6200ee' },
    sectionLabel: { marginTop: 10, fontWeight: 'bold', color: '#333' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#fff',
    },
    categoryPicker: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 },
    categoryOption: {
        borderWidth: 1,
        borderColor: '#6200ee',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 15,
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    categoryOptionSelected: { backgroundColor: '#6200ee' },
    categoryText: { color: '#6200ee' },
    categoryTextSelected: { color: '#fff' },
    primaryButton: {
        backgroundColor: '#6200ee',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    categoryGroup: { marginTop: 15, marginBottom: 20, },
    categoryHeader: {
        backgroundColor: '#e0e0f8',
        padding: 10,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    bulkButtons: { flexDirection: 'row', gap: 10 },
    smallButton: {
        backgroundColor: '#6200ee',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginLeft: 5,
    },
    timerCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    timerName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    progress: { height: 8, marginTop: 10, borderRadius: 10 },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 30,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
});

export default HomeScreen;
