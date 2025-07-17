// ✅ Updated MainScreen.js — using Web SDK-compatible Firebase
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth, rtdb } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get, set, onValue } from 'firebase/database';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-5506676208773786/4493407648';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const backgroundImage = require('../assets/matrix-background.gif');
const ACCENT = '#00ffff';

const MainScreen = () => {
  const [user, setUser] = useState(null);
  const [isMining, setIsMining] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [autoCounter, setAutoCounter] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = ref(rtdb, `mining_sessions/${currentUser.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data && data.totalTokens) {
            setTotalTokens(data.totalTokens);
          }
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let interval;
    if (isMining) {
      interval = setInterval(() => {
        setAutoCounter((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMining]);

  const handleMinePress = () => {
    if (!rewarded.loaded) {
      rewarded.load();
      Alert.alert('Ad not ready', 'Please try again in a few seconds.');
      return;
    }
    rewarded.show();
  };

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => console.log('Ad loaded')
    );

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        setIsMining(true);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);

        if (user) {
          const userRef = ref(rtdb, `mining_sessions/${user.uid}`);
          get(userRef).then((snapshot) => {
            const data = snapshot.val();
            const previous = data?.totalTokens || 0;
            const newTotal = previous + 0.01;
            set(userRef, {
              totalTokens: newTotal,
              lastStart: Date.now(),
            });
            setTotalTokens(newTotal);
          });
        }
      }
    );

    const unsubscribeClosed = rewarded.addAdEventListener(
      RewardedAdEventType.CLOSED,
      () => rewarded.load()
    );

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
    };
  }, [user]);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <LinearGradient
        colors={["rgba(0,0,0,0.8)", "#001a00"]}
        style={styles.container}
      >
        <Text style={styles.title}>Project Genesis</Text>
        <Text style={styles.subtitle}>Tap to escape the Matrix</Text>
        <TouchableOpacity style={styles.mineButton} onPress={handleMinePress}>
          <Ionicons name="rocket-outline" size={20} color="#000" />
          <Text style={styles.mineText}>Mine</Text>
        </TouchableOpacity>
        <Text style={styles.counterText}>Auto Counter: {autoCounter}</Text>
        <Text style={styles.counterText}>
          Total Tokens: {totalTokens.toFixed(2)}
        </Text>
        <Modal transparent visible={showPopup} animationType="fade">
          <View style={styles.popupContainer}>
            <View style={styles.popup}>
              <Text style={styles.popupText}>
                Mining started: 0.01 per hour for 24 hours
              </Text>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 34,
    color: '#00ff00',
    marginBottom: 10,
    fontFamily: 'FiraCode-Bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#00ff00',
    marginBottom: 20,
    fontFamily: 'FiraCode-Regular',
  },
  mineButton: {
    backgroundColor: '#00ff00',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  mineText: {
    color: '#000',
    fontSize: 20,
    fontFamily: 'FiraCode-Bold',
    marginLeft: 8,
  },
  counterText: {
    color: ACCENT,
    marginTop: 10,
    fontFamily: 'FiraCode-Regular',
  },
  popupContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#000',
    borderColor: '#00ff00',
    borderWidth: 2,
    padding: 20,
    borderRadius: 10,
  },
  popupText: {
    color: ACCENT,
    fontSize: 16,
    fontFamily: 'FiraCode-Regular',
  },
});

export default MainScreen;
