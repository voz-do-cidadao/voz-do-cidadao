import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { EMAIL_USER_KEY, SHOW_TUTORIAL } from '../src/services/storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoToMenu = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Email Inválido", "Por favor, insira um endereço de email válido.");
      return;
    }

    try {
      await AsyncStorage.setItem(EMAIL_USER_KEY, email);
      await AsyncStorage.setItem(SHOW_TUTORIAL, 'false');
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
        source={require('../assets/images/logo_b.png')}
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

      <TouchableOpacity style={styles.loginButton} onPress={handleGoToMenu}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/screens/register')}>
        <Text style={styles.linkText}>Não possui conta ainda? Registre-se</Text>
      </TouchableOpacity>
    </ScrollView >
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
    color: '#000000',
  },
  loginButton: {
    width: 168,
    height: 51,
    backgroundColor: '#297E33',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 20,
  },
  loginButtonText: {
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