import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    ImageBackground 
} from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebaseConfig';  // Use this imported 'auth' directly

const AuthScreen = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            onLoginSuccess();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLoginSuccess();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <ImageBackground 
            source={require('../assets/splash.png')}  // ✅ Add your splash image here
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Welcome to Project Genesis</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#0F0"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#0F0"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',  // Ensures image scales properly
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark overlay for readability
        padding: 20,
        borderRadius: 10,
        width: '90%',
    },
    title: {
        fontSize: 28,
        color: '#0F0',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#0F0',
        borderWidth: 1,
        marginBottom: 10,
        color: '#0F0',
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#0F0',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
});

export default AuthScreen;