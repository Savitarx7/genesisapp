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
      <View style={styles.container}>
        <Text style={styles.title}>Project Genesis</Text>
        <Text style={styles.subtitle}>Tap to escape the Matrix</Text>
        <TouchableOpacity style={styles.mineButton} onPress={handleMinePress}>
          <Text style={styles.mineText}>MINE</Text>
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
      </View>
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
    fontWeight: 'bold',
    color: '#00ff00',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#00ff00',
    marginBottom: 20,
  },
  mineButton: {
    backgroundColor: '#00ff00',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  mineText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  counterText: {
    color: '#fff',
    marginTop: 10,
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
    color: '#00ff00',
    fontSize: 16,
  },
});

export default MainScreen;
