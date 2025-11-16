import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import AddressModal from 'app/screens/address';
import CustomAlertModal from 'components/CustomAlertModal';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Button, Keyboard, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
          showCustomAlert("Preencha os campos realizar sua denúncia. Forneça o máximo de detalhes que puder.");
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
            <Button title="Cancelar" color='#297E33' onPress={onCancelPress} />
            <View style={{ flex: 1 }} />

          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Nova publicação</Text>

          <View style={styles.inputGroup}>
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Tema
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <Picker
              selectedValue={theme}
              style={styles.picker}
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

          <View style={styles.inputGroup} >
            <Text style={styles.label}>Endereço<Text style={styles.asterisk}> *</Text></Text>
            {address ? (
              <Text style={styles.address} onPress={() => setShowAddressModal(true)}>{address}</Text>
            ) : (
              <Text style={styles.placeholder} onPress={() => setShowAddressModal(true)}>Nenhum endereço cadastrado. Clique aqui para adicionar</Text>
            )}
          </View>
          <AddressModal
            visible={showAddressModal}
            onClose={() => setShowAddressModal(false)}
            onConfirm={(fullAddress, details) => {
              setAddress(fullAddress);
              setAddressDetails(details);
              setShowAddressModal(false);
            }} />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nome
              {!anonymous && <Text style={styles.asterisk}> *</Text>}
            </Text>
            <View style={styles.rowView}>
              <TextInput
                style={[styles.input, anonymous && styles.inputDisabled]}
                placeholder={anonymous ? "" : "Digite seu nome"}
                placeholderTextColor="#AAAAAA"
                maxLength={30}
                value={name}
                onChangeText={setName}
                editable={!anonymous}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              <View style={styles.switchContainer}>
                <Switch value={anonymous} onValueChange={(value) => setAnonymous(value)} />
                <Text style={styles.switchLabel}>Permanecer anônimo</Text>
              </View>
            </View>
          </View>

          <View style={styles.textAreaGroup}>
            <Text style={styles.counter}>{complaint.length}/500</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Descreva sua reclamação aqui..."
              placeholderTextColor="#AAAAAA"
              multiline
              maxLength={500}
              value={complaint}
              onChangeText={setComplaint}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          <TouchableOpacity style={{ backgroundColor: '#297E33', borderRadius: 10, padding: 10, justifyContent: "center", alignItems: "center" }} onPress={handlePublishAndNavigate} >
            <Text style={{ fontSize: 15, color: "#FFFFFF" }}>Próxima etapa</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
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
  publishBtn: {
    backgroundColor: '#297E33',
    paddingHorizontal: 22,
    borderRadius: 5,
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 15,
  },
  inputGroup: {
    borderWidth: 1,
    borderColor: 'gray',
    borderStyle: 'solid',
    borderRadius: 15,
    padding: 14,
    marginBottom: 10,
  },
  label: {
    color: '#297E33',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  asterisk: {
    color: 'red',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    fontSize: 16,
    color: '#555555',
    flex: 1
  },
  picker: {
    height: 50,
    color: '#555555',
  },
  switchContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 10,
    color: '#297E33',
    marginTop: -5,
  },
  textAreaGroup: {
    borderWidth: 1,
    borderColor: 'gray',
    borderStyle: 'solid',
    borderRadius: 15,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  counter: {
    textAlign: 'right',
    fontSize: 16,
    color: '#555555',
    marginBottom: 6,
  },
  textArea: {
    height: 199,
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF',
    padding: 10,
    fontSize: 16,
    color: '#555555',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: -15,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 30,
  },
  addressText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 30,
    textAlign: "center"
  },
  address: {
    fontSize: 18,
    color: "#333"
  },
  placeholder: {
    fontSize: 16,
    color: "#AAAAAA"
  },
  inputDisabled: {
    height: 30,
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    color: '#999',
    opacity: 0.7,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: -5,
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

});