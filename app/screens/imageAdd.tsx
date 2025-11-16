import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlertModal from 'components/CustomAlertModal';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { uploadReportImage } from '../../src/services/reportImageService';
import { SHOW_TUTORIAL } from '../../src/services/storage';

export default function App() {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const MAX_IMAGES = 3;

  const { reportId } = useLocalSearchParams();

  const showCustomAlert = (message: string) => {
    setModalMessage(message);
    setIsModalVisible(true);
  };


  useEffect(() => {
    const loadDataAndShowTutorial = async () => {
      try {
        const showTutorialFlag = await AsyncStorage.getItem(SHOW_TUTORIAL);
        if (showTutorialFlag === "true") {
          showCustomAlert("Adicione até 3 imagens para a sua denúncia!");
        }
      } catch (e) {
        console.error("Falha ao carregar tutorial", e);
      }
    };

    loadDataAndShowTutorial();
  }, []);


  const handlePublish = async () => {
    if (!reportId || typeof reportId !== 'string') {
      Alert.alert("Erro", "ID da publicação não encontrado. Tente novamente.");
      return;
    }

    setIsUploading(true);

    try {
      if (selectedImages.length > 0) {
        for (const imageUri of selectedImages) {
          await uploadReportImage(reportId, imageUri);
        }
      }
      router.replace({ pathname: "/screens/publicationDetail", params: { reportId, from: 'imageAdd' } });
    } catch (error) {
      Alert.alert("Erro no Upload", "Ocorreu um erro ao enviar as imagens. Por favor, tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectImage = async () => {

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar a galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newUri = result.assets[0].uri;
      setSelectedImages(prev => [...prev, newUri]);
    }
  };

  const handleRemoveImage = (uri: string) => {
    setSelectedImages(prev => prev.filter(item => item !== uri));
  };

  const remaining = MAX_IMAGES - selectedImages.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="Retornar" color="#174791" onPress={() => router.back()} />
        <View style={{ flex: 1 }} />
        {isUploading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Button title="Publicar" color="#297E33" onPress={handlePublish} />
        )}
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.imageContainer}>
          {selectedImages.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} resizeMode="cover" />
              <Button
                title="Remover"
                onPress={() => handleRemoveImage(uri)}
                color="red"
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.floatingButton, (selectedImages.length >= MAX_IMAGES || isUploading) && styles.hidden]}
        onPress={handleSelectImage}
        disabled={selectedImages.length >= MAX_IMAGES || isUploading}
      >
        <Text style={styles.floatingButtonText}>
          Adicionar imagem ({remaining})
        </Text>
      </TouchableOpacity>
      <CustomAlertModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        message={modalMessage}
      />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#174791',
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#174791',
  },
  imageContainer: {
    marginTop: 10,
  },
  imageWrapper: {
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#297E33',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  hidden: {
    display: 'none',
  },
});
