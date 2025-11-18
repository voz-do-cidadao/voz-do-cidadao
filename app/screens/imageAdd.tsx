import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlertModal from 'components/CustomAlertModal';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { uploadReportImage } from '../../src/services/reportImageService';
import { SHOW_TUTORIAL } from '../../src/services/storage';

const ImageSourceModal = ({ visible, onClose, onSelectGallery, onSelectCamera }: { visible: boolean, onClose: () => void, onSelectGallery: () => void, onSelectCamera: () => void }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>

          <View style={modalStyles.titleContainer}>
            <Text style={modalStyles.modalTitle}>Anexar imagem</Text>
          </View>

          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonConfirm]}
              onPress={onSelectCamera}
            >
              <Text style={modalStyles.textStyleConfirm}>Abrir câmera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonConfirm]}
              onPress={onSelectGallery}
            >
              <Text style={modalStyles.textStyleConfirm}>Selecionar da galeria</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonCancel]}
              onPress={onClose}
            >
              <Text style={modalStyles.textStyleCancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};


const DeleteConfirmationModal = ({ visible, onClose, onConfirm }: { visible: boolean, onClose: () => void, onConfirm: () => void }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>

          <View style={modalStyles.titleContainer}>
            <Text style={modalStyles.modalTitle}>Deseja excluir a imagem anexada?</Text>
          </View>

          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonDelete]}
              onPress={onConfirm}
            >
              <Text style={modalStyles.textStyleDelete}>Excluir imagem</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonCancel]}
              onPress={onClose}
            >
              <Text style={modalStyles.textStyleCancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const NoImagesConfirmationModal = ({ visible, onClose, onConfirm }: { visible: boolean, onClose: () => void, onConfirm: () => void }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>

          <View style={modalStyles.titleContainer}>
            <Text style={modalStyles.modalTitle}>Deseja seguir sem anexar imagens?</Text>
          </View>

          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonConfirm]}
              onPress={onConfirm}
            >
              <Text style={modalStyles.textStyleConfirm}>Enviar denúncia</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonCancel]}
              onPress={onClose}
            >
              <Text style={modalStyles.textStyleCancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const AddImagePlaceholder = ({ onPress, disabled }: { onPress: () => void, disabled: boolean }) => (
  <TouchableOpacity
    style={[styles.addImagePlaceholder, disabled && styles.disabledPlaceholder]}
    onPress={onPress}
    disabled={disabled}
  >
    <Image
      source={require('../../assets/images/upload.png')}
      style={{ width: 30, height: 30, tintColor: '#777' }}
    />
    <Text style={styles.addImageText}>Adicionar imagem</Text>
  </TouchableOpacity>
);

const SelectedImageItem = ({ uri, onRemove }: { uri: string, onRemove: (uri: string) => void }) => (
  <View style={styles.selectedImageWrapper}>
    <Image source={{ uri }} style={styles.selectedImage} resizeMode="cover" />
    <TouchableOpacity
      style={styles.removeButton}
      onPress={() => onRemove(uri)}
    >
      <Text style={styles.removeButtonText}>Excluir</Text>
    </TouchableOpacity>
  </View>
);

export default function App() {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isNoImagesModalVisible, setIsNoImagesModalVisible] = useState(false);
  const MAX_IMAGES = 3;

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const [isImageSourceModalVisible, setIsImageSourceModalVisible] = useState(false);

  const HEADER_FULL_HEIGHT = (StatusBar.currentHeight || 0) + 110;
  const { reportId } = useLocalSearchParams();

  const showCustomAlert = (message: string) => {
    setModalMessage(message);
    setIsModalVisible(true);
  };


  useEffect(() => {
    StatusBar.setBarStyle('light-content', true);
    const loadDataAndShowTutorial = async () => {
      try {
        const showTutorialFlag = await AsyncStorage.getItem(SHOW_TUTORIAL);
        if (showTutorialFlag === "true") {
          showCustomAlert("Adicione até 3 imagens para a sua denúncia!");
          await AsyncStorage.setItem(SHOW_TUTORIAL, "false");
        }
      } catch (e) {
        console.error("Falha ao carregar tutorial", e);
      }
    };
    loadDataAndShowTutorial();
  }, []);


  const proceedToPublish = async () => {
    setIsNoImagesModalVisible(false);
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

  const handlePublish = async () => {
    if (selectedImages.length === 0) {
      setIsNoImagesModalVisible(true);
    } else {
      await proceedToPublish();
    }
  };

  const addImageToList = (uri: string) => {
    setSelectedImages(prev => {
      if (prev.length < MAX_IMAGES) {
        return [...prev, uri];
      }
      Alert.alert('Limite Atingido', `Você pode adicionar no máximo ${MAX_IMAGES} imagens.`);
      return prev;
    });
  };

  const handleSelectGallery = async () => {
    setIsImageSourceModalVisible(false);
    if (selectedImages.length >= MAX_IMAGES) {
      Alert.alert('Limite Atingido', `Você pode adicionar no máximo ${MAX_IMAGES} imagens.`);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar a galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      addImageToList(result.assets[0].uri);
    }
  };

  const handleOpenCamera = async () => {
    setIsImageSourceModalVisible(false);
    if (selectedImages.length >= MAX_IMAGES) {
      Alert.alert('Limite Atingido', `Você pode adicionar no máximo ${MAX_IMAGES} imagens.`);
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar a câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      addImageToList(result.assets[0].uri);
    }
  };

  const promptDeleteImage = (uri: string) => {
    setImageToDelete(uri);
    setIsDeleteModalVisible(true);
  };

  const confirmDeleteImage = () => {
    if (imageToDelete) {
      setSelectedImages(prev => prev.filter(item => item !== imageToDelete));
    }
    setIsDeleteModalVisible(false);
    setImageToDelete(null);
  };

  const cancelDeleteImage = () => {
    setIsDeleteModalVisible(false);
    setImageToDelete(null);
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[styles.scrollArea, { marginTop: HEADER_FULL_HEIGHT - 30 }]}
        contentContainerStyle={styles.scrollContent}>

        <View style={styles.contentHeader}>
          <Text style={styles.contentHeaderTitle}>Adicionar imagem</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.contentArea}>
          {selectedImages.map((uri, index) => (
            <SelectedImageItem
              key={index}
              uri={uri}
              onRemove={promptDeleteImage}
            />
          ))}
          {selectedImages.length < MAX_IMAGES && (
            <AddImagePlaceholder
              onPress={() => setIsImageSourceModalVisible(true)}
              disabled={isUploading}
            />
          )}
        </View>
      </ScrollView>
      <View style={styles.publishButtonWrapper}>
        <TouchableOpacity
          style={[styles.publishButton, isUploading && styles.disabledPublishButton]}
          onPress={handlePublish}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.publishButtonText}>
              Publicar
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <CustomAlertModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        message={modalMessage}
      />
      <DeleteConfirmationModal
        visible={isDeleteModalVisible}
        onClose={cancelDeleteImage}
        onConfirm={confirmDeleteImage}
      />
      <NoImagesConfirmationModal
        visible={isNoImagesModalVisible}
        onClose={() => setIsNoImagesModalVisible(false)}
        onConfirm={proceedToPublish}
      />
      <ImageSourceModal
        visible={isImageSourceModalVisible}
        onClose={() => setIsImageSourceModalVisible(false)}
        onSelectGallery={handleSelectGallery}
        onSelectCamera={handleOpenCamera}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#174791",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#174791",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingTop: StatusBar.currentHeight + 10,
    paddingBottom: 40,
    zIndex: 10,
    elevation: 4,
  },
  backButton: {
    position: 'absolute',
    left: 14,
    top: StatusBar.currentHeight + 10,
    bottom: 0,
    justifyContent: 'center',
    paddingRight: 15,
  },
  backText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  scrollArea: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    paddingTop: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  contentHeader: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  contentHeaderTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 10,
  },
  contentArea: {
    gap: 16,
  },
  addImagePlaceholder: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  disabledPlaceholder: {
    opacity: 0.6,
  },
  addImageText: {
    marginTop: 0,
    color: '#777',
    fontSize: 14,
  },
  selectedImageWrapper: {
    marginBottom: 0,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  selectedImage: {
    width: '100%',
    height: 180,
  },
  removeButton: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  removeButtonText: {
    color: 'red',
    fontWeight: '600',
    fontSize: 14,
  },
  publishButtonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    zIndex: 10,
  },
  publishButton: {
    backgroundColor: '#297E33',
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledPublishButton: {
    opacity: 0.7,
  },
  publishButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%'
  },
  titleContainer: {
    backgroundColor: '#174791',
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left'
  },
  buttonContainer: {
    padding: 24,
    width: '100%',
    gap: 12,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  buttonDelete: {
    backgroundColor: '#DC2626',
  },
  textStyleDelete: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  buttonCancel: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: '#174791',
  },
  textStyleCancel: {
    color: "#174791",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  buttonConfirm: {
    backgroundColor: '#297E33',
  },
  textStyleConfirm: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  }
});