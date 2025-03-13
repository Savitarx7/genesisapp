import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import AuthScreen from './components/AuthScreen';  // Authentication screen import
import { auth } from './firebaseConfig'; // Firebase import
import { AdMobRewarded } from 'expo-ads-admob';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [tokenCount, setTokenCount] = useState(0);
    const [autoCounter, setAutoCounter] = useState(0);
    const [isMining, setIsMining] = useState(false);
    const [startTime, setStartTime] = useState(null);

    // Exponential Decay Function
    const getMiningRate = (timeElapsed) => {
        const initialRate = 0.01; // Starting rate
        const decayRate = 0.00001; // Decay rate for 5-year mining limit
        return initialRate * Math.exp(-decayRate * timeElapsed);
    };

    // Auto-incrementing counter (visual appeal)
    useEffect(() => {
        const interval = setInterval(() => {
            setAutoCounter((prevCount) => prevCount + 0.01);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Mining logic using exponential decay
    useEffect(() => {
        if (isMining) {
            const miningInterval = setInterval(() => {
                const timeElapsed = (Date.now() - startTime) / (1000 * 60 * 60); // Time in hours
                const currentRate = getMiningRate(timeElapsed);
                setTokenCount((prevCount) => prevCount + currentRate);
            }, 1000); // Update every second

            return () => clearInterval(miningInterval);
        }
    }, [isMining, startTime]);

    // Show Rewarded Ad before mining
    const showRewardedAd = async () => {
        try {
            await AdMobRewarded.setAdUnitID("ca-app-pub-5506676208773786/4493407648"); // Replace with your actual AdMob ad unit ID
            await AdMobRewarded.requestAdAsync();
            await AdMobRewarded.showAdAsync();

            AdMobRewarded.addEventListener("rewarded", () => {
                alert("Mining started: 0.01 per hour for 24 hours");
                startMining();
            });

        } catch (error) {
            console.error("Ad Error:", error);
        }
    };

    const startMining = () => {
        if (!isMining) {
            setIsMining(true);
            setStartTime(Date.now());
        }
    };

    // Authentication Handling
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    if (!isAuthenticated) {
        return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <ImageBackground
            source={require('./assets/matrix-background.gif')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <Text style={styles.projectTitle}>PROJECT GENESIS</Text>

                <View style={styles.counterContainer}>
                    <Text style={styles.counterLabel}>TOTAL MINED</Text>
                    <Text style={styles.counter}>{autoCounter.toFixed(2)}</Text>
                </View>

                <Text style={styles.matrixText}>Tap to escape the Matrix</Text>
                <TouchableOpacity style={styles.button} onPress={showRewardedAd}>
                    <Text style={styles.buttonText}>MINE</Text>
                </TouchableOpacity>

                <Text style={styles.miningText}>
                    {isMining
                        ? `Mining started: ${tokenCount.toFixed(4)} tokens`
                        : 'Mining paused'}
                </Text>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    projectTitle: {
        fontSize: 36,
        color: '#0F0',
        fontWeight: 'bold',
        textShadowColor: '#0F0',
        textShadowRadius: 20,
        marginBottom: 50,
    },
    counterContainer: {
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        borderWidth: 2,
        borderColor: '#0F0',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 15,
        marginBottom: 40,
        alignItems: 'center',
    },
    counterLabel: {
        fontSize: 18,
        color: '#0F0',
        marginBottom: 5,
    },
    counter: {
        fontSize: 28,
        color: '#0F0',
        fontWeight: 'bold',
    },
    matrixText: {
        fontSize: 16,
        color: '#0F0',
        marginBottom: 10,
        textShadowColor: '#0F0',
        textShadowRadius: 10,
    },
    button: {
        backgroundColor: '#000',
        borderColor: '#0F0',
        borderWidth: 2,
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 10,
        shadowColor: '#0F0',
        shadowOpacity: 0.9,
        shadowRadius: 15,
    },
    buttonText: {
        fontSize: 20,
        color: '#0F0',
        fontWeight: 'bold',
    },
    miningText: {
        marginTop: 20,
        fontSize: 18,
        color: '#0F0',
        textShadowColor: '#0F0',
        textShadowRadius: 10,
    },
});