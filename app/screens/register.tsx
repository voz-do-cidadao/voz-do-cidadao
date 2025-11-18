import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlertModal from 'components/CustomAlertModal';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Image,
    Keyboard,
    KeyboardEvent,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { EMAIL_USER_KEY, SHOW_TUTORIAL } from '../../src/services/storage';

export default function RegisterScreen() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const keyboardOffset = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const showEvent = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
        const hideEvent = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

        const showSub = Keyboard.addListener(showEvent, (event: KeyboardEvent) => {
            Animated.timing(keyboardOffset, {
                toValue: event.endCoordinates.height - 40,
                duration: 250,
                useNativeDriver: false,
            }).start();
        });

        const hideSub = Keyboard.addListener(hideEvent, () => {
            Animated.timing(keyboardOffset, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }).start();
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const showCustomAlert = (message: string) => {
        setModalMessage(message);
        setIsModalVisible(true);
    };

    const handleRegister = async () => {
        if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
            showCustomAlert("Por favor, preencha todos os campos.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showCustomAlert("Por favor, insira um endereço de email válido.");
            return;
        }

        if (password !== confirmPassword) {
            showCustomAlert("As senhas inseridas não são iguais.");
            return;
        }

        try {
            await AsyncStorage.setItem(EMAIL_USER_KEY, email);
            await AsyncStorage.setItem(SHOW_TUTORIAL, 'true');
        } catch (e) {
            console.error("Não foi possível salvar o email.");
        }

        router.replace('/menu');
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#174791" }}>
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

                <Animated.View style={{ marginBottom: keyboardOffset, alignItems: "center", width: "100%" }}>
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
                </Animated.View>

                <CustomAlertModal
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    message={modalMessage}
                />
            </ScrollView>
        </View>
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
        textAlign: 'center',
    },
});
