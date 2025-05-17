import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const TimerContext = createContext();

const categories = ['Study', 'Workout', 'Break', 'Game'];

export const TimerProvider = ({ children }) => {

       const [timers, setTimers] = useState([]);
        const [name, setName] = useState('');
        const [duration, setDuration] = useState('');
        const [category, setCategory] = useState(categories[0]);
        const [modalVisible, setModalVisible] = useState(false);
        const [completedTimer, setCompletedTimer] = useState(null);
        const [expandedCategories, setExpandedCategories] = useState({});
        const intervals = useRef({});

    useEffect(() => {
        const loadTimers = async () => {
            const data = await AsyncStorage.getItem('timers');
            if (data) {
                const parsedTimers = JSON.parse(data);
                setTimers(parsedTimers);
                parsedTimers.forEach(timer => {
                    if (timer.status === 'running') startTimer(timer.id, true);
                });
            }
        };
        loadTimers();
    }, []);

    const saveTimers = async (updatedTimers) => {
        setTimers(updatedTimers);
        await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
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


    const updateTimerStatus = (id, status) => {
        setTimers((prev) => {
            const updated = prev.map(timer => timer.id === id ? { ...timer, status } : timer);
            saveTimers(updated);
            return updated;
        });
    };

    const pauseTimer = (id) => {
        clearInterval(intervals.current[id]);
        delete intervals.current[id];

        const updatedTimers = timers.map(timer =>
            timer.id === id ? { ...timer, status: 'paused' } : timer
        );

        saveTimers(updatedTimers);
    };

    const deleteTimer = async (id) => {
        clearInterval(intervals.current[id]);
        delete intervals.current[id];
        const updatedTimers = timers.filter(timer => timer.id !== id);
        await saveTimers(updatedTimers);
    };

    // const resetTimers = async () => {
    //     Object.values(intervals.current).forEach(clearInterval);
    //     intervals.current = {};
    //     setTimers([]);
    //     await AsyncStorage.removeItem('timers');
    // };

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

    return (
        <TimerContext.Provider
            value={{
                timers,
                completedTimer,
                modalVisible,
                setModalVisible,
                addTimer,
                startTimer,
                pauseTimer,
                resetTimer,
                deleteTimer,
                resetTimers,
            }}
        >
            {children}
        </TimerContext.Provider>
    );
};

export const useTimerContext = () => useContext(TimerContext);