import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import AuthScreen from './components/AuthScreen';
import { auth } from './firebaseConfig';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-5506676208773786/4493407648'; // Replace with your actual ad unit ID

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const [autoCounter, setAutoCounter] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const getMiningRate = (timeElapsed) => {
    const initialRate = 0.01;
    const decayRate = 0.00001;
    return initialRate * Math.exp(-decayRate * timeElapsed);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAutoCounter((prevCount) => prevCount + 0.01);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isMining) {
      const miningInterval = setInterval(() => {
        const timeElapsed = (Date.now() - startTime) / (1000 * 60 * 60);
        const currentRate = getMiningRate(timeElapsed);
        setTokenCount((prevCount) => prevCount + currentRate);
      }, 1000);
      return () => clearInterval(miningInterval);
    }
  }, [isMining, startTime]);

  const showRewardedAd = async () => {
    try {
      const unsubscribeLoaded = rewarded.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => {
          rewarded.show();
        }
      );

      const unsubscribeEarned = rewarded.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          alert('Mining started: 0.01 per hour for 24 hours');
          startMining();
        }
      );

      rewarded.load();

      setTimeout(() => {
        unsubscribeLoaded();
        unsubscribeEarned();
      }, 10000);
    } catch (error) {
      console.error('Ad Error:', error);
    }
  };

  const startMining = () => {
    if (!isMining) {
      setIsMining(true);
      setStartTime(Date.now());
    }
  };

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
