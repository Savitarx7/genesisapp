// screens/AuthScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
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
    <View style={styles.container}>
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
      <Button title="Login" onPress={handleLogin} color="#00ff00" />
      <View style={{ marginTop: 10 }} />
      <Button title="Sign Up" onPress={handleSignup} color="#00ff00" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    padding: 30,
  },
  header: {
    fontSize: 28,
    color: '#00ff00',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#00ff00',
    color: '#00ff00',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
});
