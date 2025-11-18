import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import AddressModal from 'app/screens/address';
import CustomAlertModal from 'components/CustomAlertModal';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Keyboard, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { publishReport, PublishReportData } from '../../src/services/reportService';
import { EMAIL_USER_KEY, SHOW_TUTORIAL } from '../../src/services/storage';

export default function App() {
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [complaint, setComplaint] = useState('');
  const [address, setAddress] = useState("");
  const [addressDetails, setAddressDetails] = useState(null);
  const router = useRouter();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCancelMessage, setShowCancelMessage] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const showCustomAlert = (message: string) => {
    setModalMessage(message);
    setIsModalVisible(true);
  };

  useEffect(() => {
    const loadDataAndShowTutorial = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem(EMAIL_USER_KEY);
        if (savedEmail !== null) {
          setEmail(savedEmail);
        }

        const showTutorialFlag = await AsyncStorage.getItem(SHOW_TUTORIAL);
        if (showTutorialFlag === "true") {
          showCustomAlert("Preencha os campos para realizar a sua denúncia. Forneça o máximo de detalhes que puder.");
        }
      } catch (e) {
        console.error("Falha ao carregar dados iniciais ou tutorial", e);
      }
    };

    loadDataAndShowTutorial();
  }, []);

  useEffect(() => {
    const handleBackPress = () => {
      if (showCancelMessage) {
        setShowCancelMessage(false);
        return true;
      }

      onCancelPress();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [showCancelMessage]);

  const limparCampos = () => {
    setTitle('');
    setTheme('');
    setName('');
    setAnonymous(false);
    setComplaint('');
    setAddress("");
    setAddressDetails(null);
  };

  const handlePublishAndNavigate = async () => {
    if (!title || !theme || !email || !complaint || !addressDetails || (!anonymous && !name)) {
      showCustomAlert("Preencha todos os campos obrigatórios.");
      return;
    }

    const body: PublishReportData = {
      userRequest: {
        name: anonymous ? "Usuário Anônimo" : name,
        email: email,
      },
      reportAddressRequest: {
        number: addressDetails.number,
        zipCode: addressDetails.zipCode,
        street: addressDetails.street,
        complement: addressDetails.complement,
        city: addressDetails.city,
        state: addressDetails.state.toUpperCase(),
        country: "Brasil"
      },
      report: {
        report: title,
        reportDescription: complaint,
        reportCategory: theme.toUpperCase(),
      }
    };

    try {
      const responseData = await publishReport(body);
      limparCampos();
      router.replace({ pathname: '/screens/imageAdd', params: { reportId: responseData.id } });
    } catch (error) {
      console.error("Erro ao publicar:", error);
    }
  };

  const onCancelPress = () => {
    setShowCancelMessage(true);
  };

  const closeCancelMessage = () => {
    setShowCancelMessage(false);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={onCancelPress}>
              <Text style={styles.cancelButtonHeaderText}>Cancelar</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Nova denúncia</Text>

          <View style={[styles.inputRow, { borderTopWidth: 1, borderTopColor: '#AAAAAA' }]}>
            <Text style={styles.label}>
              Título
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o título aqui..."
              placeholderTextColor="#AAAAAA"
              maxLength={60}
              value={title}
              onChangeText={setTitle}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          <View style={[styles.inputRow, { paddingVertical: 5 }]}>
            <Text style={styles.label}>
              Tema
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={theme}
                style={styles.input}
                onValueChange={(itemValue) => setTheme(itemValue)}
              >
                <Picker.Item label="Selecione um tema" value="" />
                <Picker.Item label="Limpeza" value="LIMPEZA" />
                <Picker.Item label="Meio Ambiente" value="MEIO AMBIENTE" />
                <Picker.Item label="Infraestrutura" value="INFRAESTRUTURA" />
                <Picker.Item label="Transporte" value="TRANSPORTE" />
                <Picker.Item label="Mobilidade" value="MOBILIDADE" />
                <Picker.Item label="Serviços" value="SERVIÇOS" />
                <Picker.Item label="Água" value="ÁGUA" />
                <Picker.Item label="Energia Elétrica" value="ENERGIA ELÉTRICA" />
                <Picker.Item label="Saneamento Básico" value="SANEAMENTO BÁSICO" />
                <Picker.Item label="Pertubação do Sossego" value="PERTUBAÇÃO DO SOSSEGO" />
                <Picker.Item label="Segurança" value="SEGURANÇA" />
                <Picker.Item label="Animais e Zoonoses" value="ANIMAIS E ZOONOSES" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputRow} >
            <Text style={styles.label}>Endereço<Text style={styles.asterisk}> *</Text></Text>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowAddressModal(true)}>
              {address ? (
                <Text style={[styles.input, styles.address]}>{address}</Text>
              ) : (
                <Text style={[styles.input, styles.placeholder]}>Clique aqui para adicionar</Text>
              )}
            </TouchableOpacity>
          </View>
          <AddressModal
            visible={showAddressModal}
            onClose={() => setShowAddressModal(false)}
            onConfirm={(fullAddress, details) => {
              setAddress(fullAddress);
              setAddressDetails(details);
              setShowAddressModal(false);
            }} />

          <View style={[styles.inputRow]}>
            <Text style={styles.label}>
              Nome
              {!anonymous && <Text style={styles.asterisk}> *</Text>}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={anonymous ? "" : "Digite seu nome"}
              placeholderTextColor="#AAAAAA"
              maxLength={30}
              value={name}
              onChangeText={setName}
              editable={!anonymous}
            />
            <View style={styles.switchContainer}>
              <Switch
                value={anonymous}
                onValueChange={(value) => {
                  setAnonymous(value);
                  if (value) {
                    setName('');
                  }
                }}
                trackColor={{ false: '#AAAAAA', true: '#297E33' }}
              />
              <Text style={styles.switchLabel}>Permanecer anônimo</Text>
            </View>
          </View>

          <View style={styles.textAreaRow}>
            <TextInput
              style={styles.textArea}
              placeholder="Descreva sua reclamação/sugestão aqui..."
              placeholderTextColor="#AAAAAA"
              multiline
              maxLength={500}
              value={complaint}
              onChangeText={setComplaint}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            <Text style={styles.counter}>{complaint.length}/500</Text>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handlePublishAndNavigate} >
            <Text style={styles.submitButtonText}>Próxima etapa</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {showCancelMessage && (
        <View style={styles.cancelMessageContainer}>
          <Text style={styles.cancelMessageText}>Ao cancelar você irá excluir o conteúdo da publicação. Deseja continuar?</Text>
          <View style={{ flex: 1 }} />
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={() => { router.replace("/menu") }} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeCancelMessage} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <CustomAlertModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        message={modalMessage}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#174791',
    paddingVertical: 20,
    paddingHorizontal: 14,
  },
  headerButtons: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 31,
  },
  cancelButtonHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#AAAAAA',
    paddingVertical: 12,
  },
  label: {
    color: '#297E33',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
    minWidth: 90,
  },
  asterisk: {
    color: 'red',
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  pickerWrapper: {
    flex: 1,
  },
  switchContainer: {
    alignItems: 'center',
    marginLeft: 8,
  },
  switchLabel: {
    fontSize: 12,
    color: '#555555',
    marginTop: 2,
    textAlign: 'center',
  },
  textAreaRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flex: 1,
  },
  counter: {
    textAlign: 'right',
    fontSize: 14,
    color: '#888888',
    paddingTop: 4,
    fontWeight: 'bold',
  },
  textArea: {
    flex: 1,
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF',
    padding: 0,
    fontSize: 16,
    color: '#333333',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: -15,
    flex: 1, // <-- MUDANÇA 4 AQUI
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 30,
  },
  address: {
    fontSize: 18,
    color: "#333"
  },
  placeholder: {
    fontSize: 16,
    color: "#AAAAAA"
  },
  cancelMessageContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#174791',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 60,
  },
  cancelMessageText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 7,
    paddingVertical: 15,
    marginHorizontal: 10,
    marginVertical: 15,
    width: "100%",
    alignItems: "center"
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    marginHorizontal: 10,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#297E33',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#AAAAAA',
    paddingTop: 12,
  },
  submitButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
  },
});