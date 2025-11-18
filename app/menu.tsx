import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EMAIL_USER_KEY, SHOW_TUTORIAL } from '../src/services/storage';

export default function MenuScreen() {
    const router = useRouter();
    const { message, status } = useLocalSearchParams();

    useEffect(() => {
        if (message && typeof message === 'string') {
            const alertTitle = status === 'success' ? "Publicação Enviada" : "Erro na Publicação";
            Alert.alert(alertTitle, message);
        }
    }, [message, status]);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem(EMAIL_USER_KEY);
            await AsyncStorage.removeItem(SHOW_TUTORIAL);
            router.replace('/');

        } catch (e) {
            console.error("Não foi possível limpar os dados de sessão", e);
            router.replace('/');
        }
    };

    return (
        <View style={styles.appContainer}>
            <View style={styles.header}>
                <Image
                    source={require('../assets/images/logo_b.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.contentWrapper}>
                <View style={styles.content}>
                    <TouchableOpacity style={styles.newPostButton} onPress={() => router.push('/screens/publish')}>
                        <Text style={styles.newPostButtonText}>Fazer uma nova denúncia</Text>
                        <View style={styles.plusIconContainer}>
                            <Text style={styles.plusIcon}>+</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.gridContainer}>
                        <View style={styles.gridRow}>
                            <TouchableOpacity style={[styles.card, { marginRight: 8 }]} onPress={() => router.push('/screens/services')}>
                                <Image
                                    source={require('../assets/images/infraestrutura.png')}
                                    style={styles.cardImage}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.card, { marginLeft: 8 }]} onPress={() => router.push('/screens/chatbot')}>
                                <Image
                                    source={require('../assets/images/assistente.png')}
                                    style={styles.cardImage}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.gridRow, { marginBottom: 0 }]}>
                            <TouchableOpacity style={[styles.card, { marginRight: 8 }]} onPress={() => router.push('/screens/myPublications')}>
                                <Image
                                    source={require('../assets/images/pub.png')}
                                    style={styles.cardImage}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.card, { marginLeft: 8 }]} onPress={() => router.push('/screens/manual')}>
                                <Image
                                    source={require('../assets/images/manual.jpg')}
                                    style={styles.cardImage}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.divider} />
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={handleLogout}
                        >
                            <Text style={styles.logoutButtonText}>Sair do aplicativo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: '#174791',
    },
    contentWrapper: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    content: {
        paddingTop: 24,
    },
    header: {
        backgroundColor: '#174791',
        paddingTop: 60,
        paddingBottom: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 230,
        height: 73,
    },
    newPostButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#297E33',
        borderRadius: 10,
        marginHorizontal: 14,
        paddingVertical: 18,
        paddingHorizontal: 15,
        marginBottom: 30,
    },
    newPostButtonText: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    plusIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusIcon: {
        color: '#297E33',
        fontSize: 20,
        fontWeight: 'bold',
        lineHeight: 22,
    },
    gridContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 25,
    },
    card: {
        flex: 1,
        height: 220,
        borderRadius: 10,
        backgroundColor: '#E0E0E0',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginTop: 10,
        marginBottom: 15,
    },
    logoutButton: {
        backgroundColor: '#FFFFFF',
        borderColor: '#174791',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButtonText: {
        color: '#174791',
        fontSize: 16,
        fontWeight: 'bold',
    },
});