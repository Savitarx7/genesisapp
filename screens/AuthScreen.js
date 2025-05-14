// AuthScreen.js (FIXED & COMPLETE)
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  const handleSignup = async () => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Signup Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GenesisApp Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.signup]} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  title: {
    fontSize: 24,
    color: '#0F0',
    marginBottom: 30
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderColor: '#0F0',
    borderWidth: 1,
    borderRadius: 8,
    color: '#FFF'
  },
  button: {
    backgroundColor: '#0F0',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 15
  },
  signup: {
    backgroundColor: '#0A0',
    marginTop: 10
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold'
  }
});
