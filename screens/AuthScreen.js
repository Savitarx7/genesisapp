// screens/AuthScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => Alert.alert('Signed up!'))
      .catch((error) => Alert.alert('Signup Error', error.message));
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => Alert.alert('Logged in!'))
      .catch((error) => Alert.alert('Login Error', error.message));
  };

  return (
    <LinearGradient
      colors={["#000000", "#001a00"]}
      style={styles.container}
    >
      <Text style={styles.header}>Genesis Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Ionicons name="log-in-outline" size={20} color="#000" />
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Ionicons name="person-add-outline" size={20} color="#000" />
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  header: {
    fontSize: 28,
    color: '#00ff00',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'FiraCode-Bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#00ff00',
    color: '#00ff00',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    fontFamily: 'FiraCode-Regular',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00ff00',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  buttonText: {
    marginLeft: 8,
    color: '#000',
    fontSize: 16,
    fontFamily: 'FiraCode-Bold',
  },
});
