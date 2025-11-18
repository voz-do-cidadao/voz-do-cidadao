import CustomAlertModal from 'components/CustomAlertModal';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getReportImageUrl } from '../../src/services/reportImageService';
import { getReportById, ReportDetail } from "../../src/services/reportService";

export default function PublicationDetailScreen() {
    const router = useRouter();
    const { reportId, from } = useLocalSearchParams<{ reportId: string, from?: string }>();
    const [publication, setPublication] = useState<ReportDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const showCustomAlert = (message: string) => {
        setModalMessage(message);
        setIsModalVisible(true);
    };

    useEffect(() => {
        if (!reportId || typeof reportId !== 'string') {
            console.error("Nenhum ID de publicação foi fornecido.");
            setIsLoading(false);
            return;
        }
        if (from === 'imageAdd') {
            showCustomAlert("Sua denúncia foi enviada com sucesso!");
        }

        const fetchPublication = async () => {
            try {
                const data = await getReportById(reportId);
                setPublication(data);
            } catch (error) {
                console.error("Erro ao buscar detalhes da publicação:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPublication();
    }, [reportId]);

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
                <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
        );
    }

    if (!publication) {
        return (
            <View style={[styles.mainContainer, styles.centered]}>
                <Text style={styles.errorText}>Não foi possível carregar a publicação.</Text>
                <Button title="Voltar ao Menu" onPress={() => router.replace('/menu')} />
            </View>
        );
    }

    const publicationDate = publication.report.images?.[0]?.uploadedAt || new Date().toISOString();

    const formatAddress = () => {
        const { street, number, complement, city, state, zipCode } = publication.reportAddressRequest;
        const parts = [];
        if (street) parts.push(`${street}, ${number}`);
        if (complement) parts.push(complement);
        if (city) parts.push(city);
        if (state) parts.push(state.toUpperCase());
        return parts.join(' - ');
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.header}>
                {from === 'imageAdd' ? (
                    <View style={styles.concludeButtonContainer}>
                        <Button title="Concluir" color='#297E33' onPress={() => router.replace('/screens/myPublications')} />
                    </View>
                ) : (
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                )}
                <Image source={require('../../assets/images/logo_b.png')} style={styles.logo} />
            </View>
            <View style={styles.content}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.topContent}>
                        <Text style={styles.publishedAt}>Enviado em: {formatDate(publicationDate)}</Text>

                        <Text style={styles.publicationTitle}>{publication.report.report}</Text>

                        <Text style={styles.detailText}><Text style={styles.bold}>Tema da reclamação:</Text> {formatTheme(publication.report.reportCategory)}</Text>
                        <Text style={styles.detailText}><Text style={styles.bold}>Endereço:</Text> {formatAddress()}</Text>
                        <Text style={styles.detailText}><Text style={styles.bold}>Nome:</Text> {publication.userRequest.name}</Text>

                        <Text style={styles.detailText}>{publication.report.reportDescription || "Nenhuma descrição fornecida."}</Text>
                    </View>

                    <View style={styles.bottomContent}>
                        {publication.report.images && publication.report.images.length > 0 && (
                            <>
                                <View style={styles.divider} />
                                <Text style={styles.mediaTitle}>Mídia anexada</Text>
                                <View style={styles.mediaContainer}>
                                    {publication.report.images.map((image, index) => (
                                        <Image key={image.id} source={{ uri: getReportImageUrl(publication.id, index) }} style={styles.mediaImage} />
                                    ))}
                                </View>
                            </>
                        )}
                    </View>
                </ScrollView>
            </View>
            <CustomAlertModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                message={modalMessage}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#174791',
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 110,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    topContent: {
        paddingHorizontal: 16,
    },
    bottomContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#174791',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 12,
        paddingTop: 40,
        paddingBottom: 10,
        zIndex: 10,
        elevation: 0,
    },
    logo: {
        width: 180,
        height: 60,
        resizeMode: 'contain',
    },
    concludeButtonContainer: {
        position: 'absolute',
        top: 40,
        right: 16,
        backgroundColor: '#297E33',
        borderRadius: 5,
        justifyContent: 'center',
        height: 40,
    },
    publishedAt: {
        fontSize: 12,
        color: '#FFFFFF',
        backgroundColor: '#297E33',
        paddingVertical: 6,
        paddingHorizontal: 15,
        textAlign: 'right',
        marginBottom: 20,
        marginHorizontal: -16,
    },
    publicationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#297E33',
        marginBottom: 15,
    },
    detailText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 12,
    },
    bold: {
        fontWeight: 'bold',
    },

    complaintText: {
        color: '#888',
        fontStyle: 'italic',
    },
    complaintContentText: {
        color: '#333',
        fontSize: 16,
        lineHeight: 22,
    },
    divider: {
        height: 2,
        backgroundColor: '#297E33',
        marginVertical: 25,
    },
    mediaTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#297E33',
        marginBottom: 15,
    },
    mediaContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    mediaImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: '#E0E0E0',
    },
    errorText: {
        color: 'white',
        fontSize: 18,
        marginBottom: 20,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 40,
        bottom: 0,
        justifyContent: 'center',
    },
    backText: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
    },
});