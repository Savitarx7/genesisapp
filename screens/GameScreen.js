import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';

import song1 from '../assets/audio/song1.mp3';
import song2 from '../assets/audio/song2.mp3';
import song3 from '../assets/audio/song3.mp3';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CURSOR_WIDTH = 24;
const CURSOR_HEIGHT = 24;
const CURSOR_X = 50;
const OBSTACLE_WIDTH = 60;
const OBSTACLE_GAP = 160;
const OBSTACLE_SPACING = 320;
const BASE_SPEED = 6;
const COLORS = ['#00ff66', '#00ffff', '#ff00ff', '#ffff00'];

const getGravity = (score) => {
  if (score < 20) return 5.5 + score * 0.15;
  if (score < 30) return 8.5 + (score - 20) * 0.1;
  return 9.5;
};

const getJumpHeight = (score) => {
  if (score < 20) return 55;
  if (score < 30) return 55 + (score - 20) * 1.5;
  return 70;
};

let lastGapCenterY = screenHeight / 2;

const MatrixRain = () => {
  const characters = '01ABCD#$&%*+=@';
  const numCols = 40;
  const [drops, setDrops] = useState(
    Array(numCols).fill().map(() => Math.random() * screenHeight)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDrops((prev) =>
        prev.map((y) => (y > screenHeight ? 0 : y + Math.random() * 12 + 8))
      );
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const rain = drops.map((y, i) => (
    <Text
      key={i}
      style={{
        position: 'absolute',
        top: y,
        left: (screenWidth / numCols) * i,
        color: '#00ff66',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontSize: 14,
      }}
    >
      {characters[Math.floor(Math.random() * characters.length)]}
    </Text>
  ));

  return <View style={StyleSheet.absoluteFill} pointerEvents="none">{rain}</View>;
};

const MatrixCode = ({ width, height }) => {
  const characters = '01ABCD#$&%*+=@';
  const fontSize = 14;
  const lineHeight = fontSize * 1.2;
  const charsPerLine = Math.floor(width / (fontSize * 0.6));
  const linesPerBlock = Math.ceil((height + 200) / lineHeight);
  const generateCodeBlock = () => {
    let block = '';
    for (let i = 0; i < linesPerBlock; i++) {
      for (let j = 0; j < charsPerLine; j++) {
        block += characters[Math.floor(Math.random() * characters.length)];
      }
      block += '\n';
    }
    return block;
  };

  const [code, setCode] = useState(generateCodeBlock());
  useEffect(() => {
    const interval = setInterval(() => setCode(generateCodeBlock()), 200);
    return () => clearInterval(interval);
  }, [height, width]);

  const block = (
    <Text style={[styles.codeText, { fontSize, lineHeight }]}>{code}</Text>
  );

  return <View style={[styles.codeContainer, { width, height }]}>{block}</View>;
};

const songs = [song1, song2, song3];

export default function GameScreen() {
  const [cursorY, setCursorY] = useState(screenHeight / 2);
  const [obstacles, setObstacles] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [menuVisible, setMenuVisible] = useState(true);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [sound, setSound] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const gameTimerId = useRef(null);
  const obstacleTimerId = useRef(null);
  const idCounter = useRef(0);

  const playRandomSong = async () => {
    if (!soundOn) return;
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    const { sound: newSound } = await Audio.Sound.createAsync(randomSong);
    setSound(newSound);
    await newSound.playAsync();
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish && soundOn) {
        newSound.unloadAsync();
        playRandomSong();
      }
    });
  };

  useEffect(() => {
    if (soundOn) playRandomSong();
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [soundOn]);

  const generateObstacle = (xPosition) => {
    const safeMargin = 80;
    const maxStep = 200;
    const minCenter = safeMargin + OBSTACLE_GAP / 2;
    const maxCenter = screenHeight - safeMargin - OBSTACLE_GAP / 2;
    const minStep = Math.max(minCenter, lastGapCenterY - maxStep);
    const maxStepLimit = Math.min(maxCenter, lastGapCenterY + maxStep);
    const newGapCenterY = Math.floor(Math.random() * (maxStepLimit - minStep + 1) + minStep);
    lastGapCenterY = newGapCenterY;
    return { id: idCounter.current++, left: xPosition, height: newGapCenterY - OBSTACLE_GAP / 2, passed: false };
  };

  const resetObstacles = () => {
    idCounter.current = 0;
    lastGapCenterY = screenHeight / 2;
    return [
      generateObstacle(screenWidth),
      generateObstacle(screenWidth + OBSTACLE_SPACING),
      generateObstacle(screenWidth + OBSTACLE_SPACING * 2),
    ];
  };

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameTimerId.current = setInterval(() => {
        setCursorY((prev) => Math.max(prev - getGravity(score), 0));
      }, 30);
    }
    return () => clearInterval(gameTimerId.current);
  }, [gameStarted, gameOver, score]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      obstacleTimerId.current = setInterval(() => {
        setObstacles((prev) => {
          const speed = Math.min(BASE_SPEED + Math.floor(score / 10), 14);
          let updated = prev.map((ob) => {
            let newLeft = ob.left - speed;
            let passed = ob.passed;
            if (!passed && newLeft + OBSTACLE_WIDTH < CURSOR_X) {
              setScore((s) => s + 1);
              passed = true;
            }
            return { ...ob, left: newLeft, passed };
          });
          if (updated.length > 0 && updated[0].left < -OBSTACLE_WIDTH) {
            updated.shift();
            updated.push(generateObstacle(updated[updated.length - 1].left + OBSTACLE_SPACING));
          }
          return updated;
        });
      }, 30);
    }
    return () => clearInterval(obstacleTimerId.current);
  }, [gameStarted, gameOver, score]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const playerBox = {
      x: CURSOR_X,
      y: screenHeight - cursorY - CURSOR_HEIGHT,
      width: CURSOR_WIDTH,
      height: CURSOR_HEIGHT
    };
    const isColliding = (a, b) =>
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y;
    for (const ob of obstacles) {
      const topWall = { x: ob.left, y: 0, width: OBSTACLE_WIDTH, height: ob.height };
      const bottomWall = {
        x: ob.left,
        y: ob.height + OBSTACLE_GAP,
        width: OBSTACLE_WIDTH,
        height: screenHeight - (ob.height + OBSTACLE_GAP)
      };
      if (isColliding(playerBox, topWall) || isColliding(playerBox, bottomWall)) {
        setGameOver(true);
        clearInterval(gameTimerId.current);
        clearInterval(obstacleTimerId.current);
        break;
      }
    }
    if (cursorY + CURSOR_HEIGHT >= screenHeight) {
      setGameOver(true);
      clearInterval(gameTimerId.current);
      clearInterval(obstacleTimerId.current);
    }
  }, [cursorY, obstacles, gameStarted, gameOver]);

  const jump = () => {
    if (!gameStarted || gameOver) {
      setGameStarted(true);
      setObstacles(resetObstacles());
      setScore(0);
      setGameOver(false);
      setCursorY(screenHeight / 2);
    } else {
      setCursorY((prev) => Math.min(prev + getJumpHeight(score), screenHeight - CURSOR_HEIGHT));
    }
  };

  const gameView = (
    <TouchableWithoutFeedback onPress={jump}>
      <View style={styles.container}>
        <MatrixRain />
        <View style={[styles.cursor, { bottom: cursorY, left: CURSOR_X }]}>
          <Text style={{ color: selectedColor }}>▲</Text>
        </View>
        {obstacles.map((ob) => (
          <>
            <MatrixCode key={`${ob.id}-top`} width={OBSTACLE_WIDTH} height={ob.height} />
            <MatrixCode
              key={`${ob.id}-bottom`}
              width={OBSTACLE_WIDTH}
              height={screenHeight - (ob.height + OBSTACLE_GAP)}
            />
          </>
        ))}
        <Text style={styles.score}>Score: {score}</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  return gameView;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  cursor: {
    position: 'absolute',
    width: CURSOR_WIDTH,
    height: CURSOR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    position: 'absolute',
    top: 50,
    left: 20,
    fontSize: 24,
    color: '#0F0',
    fontWeight: 'bold',
  },
  codeContainer: { overflow: 'hidden', backgroundColor: '#002200' },
  codeText: {
    color: '#00FF66',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
