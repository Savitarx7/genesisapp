import { auth, database } from "../firebaseConfig";
import { ref, get, set, update } from "@react-native-firebase/database";

// Constants
const BASE_RATE = 0.01; // Initial mining rate per hour
const DECAY_CONSTANT = 5.82e-8; // Controls the rate decrease
const MINING_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Get number of active miners
export const getActiveUsers = async () => {
    const rtdb = database();
    const usersRef = ref(rtdb, "active_users");
    const snapshot = await get(usersRef);
    return snapshot.exists() ? snapshot.val() : 1; // Default to 1 if no data
};

// Calculate dynamic mining rate
export const calculateMiningRate = (activeUsers) => {
    return BASE_RATE * Math.exp(-DECAY_CONSTANT * activeUsers);
};

// Start a mining session
export const startMiningSession = async () => {
    const user = auth().currentUser;
    if (!user) throw new Error("User not authenticated");

    const userId = user.uid;
    const activeUsers = await getActiveUsers();
    const miningRate = calculateMiningRate(activeUsers);
    const startTime = Date.now();
    const rtdb = database();
    await set(ref(rtdb, `mining_sessions/${userId}`), {
        startTime,
        miningRate,
        earnedTokens: 0,
    });

    return { miningRate, startTime };
};

// Get existing mining session
export const getMiningSession = async () => {
    const user = auth().currentUser;
    if (!user) return null;

    const rtdb = database();
    const sessionRef = ref(rtdb, `mining_sessions/${user.uid}`);
    const snapshot = await get(sessionRef);
    return snapshot.exists() ? snapshot.val() : null;
};

// Update earned tokens
export const updateEarnedTokens = async (newTokens) => {
    const user = auth().currentUser;
    if (!user) return;

    const rtdb = database();
    await update(ref(rtdb, `mining_sessions/${user.uid}`), { earnedTokens: newTokens });
};