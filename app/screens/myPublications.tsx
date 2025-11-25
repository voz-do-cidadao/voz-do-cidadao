import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getReportsByEmail, ReportDetail } from '../../src/services/reportService';
import { EMAIL_USER_KEY } from '../../src/services/storage';

export default function MyPublicationscreen() {
    const router = useRouter();
    const [publications, setPublications] = useState<ReportDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPublicationsByEmail = async () => {
            try {
                const savedEmail = await AsyncStorage.getItem(EMAIL_USER_KEY);
                if (savedEmail !== null) {
                    const data = await getReportsByEmail(savedEmail);
                    setPublications(data);
                } else {
                    console.log("Nenhum email encontrado no storage.");
                }
            } catch (e) {
                console.error("Falha ao buscar publicações:", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPublicationsByEmail();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Data indisponível';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatTheme = (theme: string) => {
        if (!theme) return '';
        const lowercased = theme.toLowerCase();
        return lowercased.charAt(0).toUpperCase() + lowercased.slice(1);
    };

    if (isLoading) {
        return (
            <View style={[styles.mainContainer, styles.centered]}>
                <ActivityIndicator size="large" color="#174791" />
            </View>
        );
    }

    const handleCardPress = (reportId: string) => {
        router.push({ pathname: '/screens/publicationDetail', params: { reportId } });
    };

    const formatAddress = (address: ReportDetail['reportAddressRequest']) => {
        const { street, number, city, state } = address;
        const parts = [];
        if (street) parts.push(`${street}, ${number}`);
        if (city) parts.push(city);
        if (state) parts.push(state.toUpperCase());
        return parts.join(' - ');
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace("/menu")} style={styles.backButton}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Image source={require('assets/images/logo_b.png')} style={styles.logo} />
            </View>
            <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
                <View style={styles.logoContainer}>
                    <Text style={styles.headerTitle}>Minhas denúncias</Text>
                </View>
                {publications.length > 0 ? (
                    publications.map((publication) => (
                        <TouchableOpacity key={publication.id} style={styles.card} onPress={() => handleCardPress(publication.id)}>
                            <Text style={styles.cardDate}>
                                Publicado em: {formatDate(publication.report.images?.[0]?.uploadedAt || new Date().toISOString())}
                            </Text>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{publication.report.report}</Text>
                                <Text style={styles.cardText}><Text style={styles.bold}>Tema:</Text> {formatTheme(publication.report.reportCategory)}</Text>
                                <Text style={styles.cardAddress}><Text style={styles.bold}>Endereço:</Text> {formatAddress(publication.reportAddressRequest)}</Text>
                                <Text
                                    style={styles.cardDescription}
                                    numberOfLines={4}>
                                    {publication.report.reportDescription}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noPublicationsText}>Você ainda não fez nenhuma denúncia.</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#0057a3',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    scrollArea: {
        marginTop: 120,
        borderRadius: 20,
        backgroundColor: "#fff",
    },

    headerTitle: {
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        overflow: 'hidden',
    },
    cardContent: {
        padding: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#297E33',
        marginBottom: 8,
    },
    cardText: {
        fontSize: 16,
        marginBottom: 5,
    },
    cardDate: {
        fontSize: 12,
        color: '#FFFFFF',
        backgroundColor: '#297E33',
        paddingVertical: 6,
        paddingHorizontal: 15,
        width: '100%',
        textAlign: 'right',
    },
    cardDescription: {
        fontSize: 14,
        color: '#333',
        fontWeight: '400',
        lineHeight: 20,
    },
    logoContainer: {
        alignItems: "center",
        marginHorizontal: -20,
        marginBottom: 10,
    },
    cardAddress: {
        fontSize: 15,
        color: '#555',
        marginBottom: 5,
    },
    bold: {
        fontWeight: 'bold',
    },
    noPublicationsText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        marginBottom: 20,
    },
    container: {
        flex: 1,
        backgroundColor: "#0057a3",
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#0057a3",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 12,
        paddingTop: 40,
        paddingBottom: 10,
        zIndex: 10,
        elevation: 0,
    },

    backButton: {
        marginRight: 10,
        position: 'absolute',
        left: 20,
        top: 60,
    },

    backText: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
    },

    logo: {
        width: 180,
        height: 60,
        resizeMode: 'contain',
    },
});