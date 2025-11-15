import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { EMAIL_USER_KEY, SHOW_TUTORIAL } from '../../src/services/storage';

export default function RegisterScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Email Inválido", "Por favor, insira um endereço de email válido.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Senhas não coincidem", "As senhas inseridas não são iguais.");
            return;
        }

        try {
            await AsyncStorage.setItem(EMAIL_USER_KEY, email);
            await AsyncStorage.setItem(SHOW_TUTORIAL, 'true');
        } catch (e) {
            Alert.alert("Erro", "Não foi possível salvar o email.");
        }
        router.replace('/menu');
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContentContainer}
            keyboardShouldPersistTaps="handled"
        >
            <Image
                source={require('../../assets/images/logo_b.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                placeholder="Confirmação de senha"
                placeholderTextColor="#888"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Criar conta</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.linkText}>Já possui conta? Faça o login</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#174791',
    },
    scrollContentContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 60,
    },
    logo: {
        width: '100%',
        height: 80,
        marginBottom: 70,
    },
    input: {
        width: '85%',
        height: 52,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 20,
    },
    registerButton: {
        width: 168,
        height: 51,
        backgroundColor: '#297E33',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
        marginTop: 20,
    },
    registerButtonText: {
        color: '#FDFDFD',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkText: {
        color: '#FFFFFF',
        fontSize: 14,
        marginTop: 15,
    },
});