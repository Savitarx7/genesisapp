// ✅ MainScreen.js — Final Version with Firebase Mining Sync + Hermes-safe import
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
  AdEventType
} from 'react-native-google-mobile-ads';

import matrixBackground from '../assets/matrix-background.gif';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-5506676208773786/4493407648';

const MainScreen = () => {
  const navigation = useNavigation();
  const user = auth().currentUser;
  const [tokenCount, setTokenCount] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [rewardedAdLoaded, setRewardedAdLoaded] = useState(false);
  const [rewardedAd, setRewardedAd] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchTokens = async () => {
        const doc = await firestore().collection('users').doc(user.uid).get();
        if (doc.exists && doc.data().tokens) {
          setTokenCount(doc.data().tokens);
        }
      };
      fetchTokens();
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isMining && startTime) {
        const timeElapsed = (Date.now() - startTime) / (1000 * 60 * 60);
        const rate = 0.01 * Math.exp(-0.00001 * timeElapsed);
        const newTotal = tokenCount + rate;
        setTokenCount(newTotal);
        if (user) {
          firestore().collection('users').doc(user.uid).set(
            { tokens: newTotal },
            { merge: true }
          );
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isMining, startTime, tokenCount]);

  const loadAd = () => {
    const ad = RewardedAd.createForAdRequest(adUnitId);
    ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setRewardedAdLoaded(true);
    });
    ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      Alert.alert('✅', 'Mining started: 0.01/hr for 24 hrs');
      setStartTime(Date.now());
      setIsMining(true);
    });
    ad.addAdEventListener(AdEventType.CLOSED, () => {
      setRewardedAdLoaded(false);
      setRewardedAd(null);
    });
    ad.load();
    setRewardedAd(ad);
  };

  const onMinePressed = () => {
    if (!rewardedAdLoaded) {
      loadAd();
      Alert.alert('Loading...', 'Ad is being prepared. Tap MINE again shortly.');
    } else {
      rewardedAd?.show().catch(() => {
        Alert.alert('Error', 'Could not show ad. Try again later.');
      });
    }
  };

  return (
    <ImageBackground source={matrixBackground} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={styles.projectTitle}>PROJECT GENESIS</Text>
        <View style={styles.counterContainer}>
          <Text style={styles.counterLabel}>TOTAL MINED</Text>
          <Text style={styles.counter}>{tokenCount.toFixed(2)}</Text>
        </View>
        <Text style={styles.matrixText}>Tap to escape the Matrix</Text>
        <TouchableOpacity style={styles.button} onPress={onMinePressed}>
          <Text style={styles.buttonText}>MINE</Text>
        </TouchableOpacity>
        <Text style={styles.miningText}>
          {isMining ? `Mining started` : 'Mining paused'}
        </Text>
        <TouchableOpacity
          style={[styles.button, { marginTop: 30, backgroundColor: '#0F0' }]}
          onPress={() => navigation.navigate('Game')}
        >
          <Text style={[styles.buttonText, { color: '#000' }]}>BOOT ARCADE</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#000' },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  projectTitle: {
    fontSize: 36,
    color: '#0F0',
    fontWeight: 'bold',
    textShadowColor: '#0F0',
    textShadowRadius: 20,
    marginBottom: 50
  },
  counterContainer: {
    backgroundColor: 'rgba(0,255,0,0.1)',
    borderWidth: 2,
    borderColor: '#0F0',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginBottom: 40,
    alignItems: 'center'
  },
  counterLabel: { fontSize: 18, color: '#0F0', marginBottom: 5 },
  counter: { fontSize: 28, color: '#0F0', fontWeight: 'bold' },
  matrixText: {
    fontSize: 16,
    color: '#0F0',
    marginBottom: 10,
    textShadowColor: '#0F0',
    textShadowRadius: 10
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
    shadowRadius: 15
  },
  buttonText: { fontSize: 20, color: '#0F0', fontWeight: 'bold' },
  miningText: {
    marginTop: 20,
    fontSize: 18,
    color: '#0F0',
    textShadowColor: '#0F0',
    textShadowRadius: 10
  }
});

export default MainScreen;
