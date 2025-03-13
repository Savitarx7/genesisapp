import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import { getAuth } from "firebase/auth";
import { startMiningSession, getMiningSession, updateEarnedTokens } from "../services/miningService";

const MINING_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const MiningScreen = () => {
    const [miningRate, setMiningRate] = useState(0);
    const [miningStarted, setMiningStarted] = useState(false);
    const [earnedTokens, setEarnedTokens] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        if (!userId) return;

        // Load previous mining session
        const loadSession = async () => {
            const session = await getMiningSession();
            if (session) {
                const { startTime, miningRate, earnedTokens } = session;
                const elapsedTime = Date.now() - startTime;
                if (elapsedTime < MINING_DURATION) {
                    setMiningRate(miningRate);
                    setEarnedTokens(earnedTokens);
                    setMiningStarted(true);
                    setTimeLeft(MINING_DURATION - elapsedTime);
                }
            }
        };

        loadSession();
    }, [userId]);

    useEffect(() => {
        let interval;
        if (miningStarted && timeLeft > 0) {
            interval = setInterval(() => {
                setEarnedTokens((prev) => prev + miningRate / 3600);
                setTimeLeft((prev) => prev - 1000);
            }, 1000);
        } else if (timeLeft <= 0) {
            setMiningStarted(false);
            Alert.alert("Mining session ended", "Watch an ad to restart mining.");
        }

        return () => clearInterval(interval);
    }, [miningStarted, timeLeft]);

    const handleStartMining = async () => {
        if (miningStarted) return;
        
        Alert.alert("Watch an ad", "You need to watch an ad before mining starts.", [
            { text: "OK", onPress: async () => {
                const { miningRate, startTime } = await startMiningSession();
                setMiningRate(miningRate);
                setMiningStarted(true);
                setTimeLeft(MINING_DURATION);
            }}
        ]);
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Project Genesis</Text>
            <Text style={{ fontSize: 18 }}>Mining Rate: {miningRate.toFixed(6)} per hour</Text>
            <Text style={{ fontSize: 18 }}>Earned Tokens: {earnedTokens.toFixed(6)}</Text>
            <Text style={{ fontSize: 18 }}>Time Left: {Math.max(0, Math.floor(timeLeft / 1000))}s</Text>
            <Button title="Tap to escape the Matrix" onPress={handleStartMining} disabled={miningStarted} />
        </View>
    );
};

export default MiningScreen;