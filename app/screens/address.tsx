import { Picker } from "@react-native-picker/picker";
import CustomAlertModal from "components/CustomAlertModal";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Modal, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { getAddressByCep } from "../../src/services/viaCepService";

export default function AddressModal({ visible, onClose, onConfirm }) {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [complement, setComplement] = useState("");
  const [number, setNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const showCustomAlert = (message: string) => {
    setModalMessage(message);
    setIsModalVisible(true);
  };


  const handleNumberChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setNumber(cleaned);
  };

  const handleZipCodeChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 8);
    const masked = limited.replace(/^(\d{5})(\d)/, '$1-$2');

    setZipCode(masked);
  };

  useEffect(() => {
    const fetchAddress = async () => {
      if (zipCode.length === 9) {
        setIsLoadingCep(true);
        const addressData = await getAddressByCep(zipCode);
        setIsLoadingCep(false);
        if (addressData) {
          setStreet(addressData.logradouro);
          setNeighborhood(addressData.bairro);
          setCity(addressData.localidade);
          setState(addressData.uf.toLowerCase());
        }
      }
    };
    fetchAddress();
  }, [zipCode]);

  const handleConfirm = () => {

    if (!zipCode || !state || !city || !neighborhood || !street || !number) {
      showCustomAlert("Preencha todos os campos obrigatórios.");
      return;
    }

    const parts = [];
    if (street) parts.push(street);
    if (number) parts.push(number);
    if (neighborhood) parts.push(neighborhood);
    if (city) parts.push(city);
    if (state) parts.push(state.toUpperCase());
    if (complement) parts.push(complement);

    const fullAddress = parts.join(", ");

    const addressDetails = {
      street,
      number,
      neighborhood,
      city,
      state,
      complement,
      zipCode,
    };

    onConfirm(fullAddress, addressDetails);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.title}>Endereço</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                CEP<Text style={styles.asterisk}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o CEP"
                value={zipCode}
                placeholderTextColor="#AAAAAA"
                onChangeText={handleZipCodeChange}
                keyboardType="numeric"
                maxLength={9}
              />
              {isLoadingCep && <ActivityIndicator size="small" color="#297E33" style={styles.loadingIndicator} />}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Estado<Text style={styles.asterisk}> *</Text>
              </Text>
              <Picker
                selectedValue={state}
                onValueChange={(itemValue) => setState(itemValue)}
                style={styles.picker}>

                <Picker.Item label="Selecione o estado" value="" />
                <Picker.Item label="Acre" value="ac" />
                <Picker.Item label="Alagoas" value="al" />
                <Picker.Item label="Amapá" value="ap" />
                <Picker.Item label="Amazonas" value="am" />
                <Picker.Item label="Bahia" value="ba" />
                <Picker.Item label="Ceará" value="ce" />
                <Picker.Item label="Distrito Federal" value="df" />
                <Picker.Item label="Espírito Santo" value="es" />
                <Picker.Item label="Goiás" value="go" />
                <Picker.Item label="Maranhão" value="ma" />
                <Picker.Item label="Mato Grosso" value="mt" />
                <Picker.Item label="Mato Grosso do Sul" value="ms" />
                <Picker.Item label="Minas Gerais" value="mg" />
                <Picker.Item label="Pará" value="pa" />
                <Picker.Item label="Paraíba" value="pb" />
                <Picker.Item label="Paraná" value="pr" />
                <Picker.Item label="Pernambuco" value="pe" />
                <Picker.Item label="Piauí" value="pi" />
                <Picker.Item label="Rio Grande do Norte" value="rn" />
                <Picker.Item label="Rio Grande do Sul" value="rs" />
                <Picker.Item label="Rondônia" value="ro" />
                <Picker.Item label="Roraima" value="rr" />
                <Picker.Item label="Santa Catarina" value="sc" />
                <Picker.Item label="Sergipe" value="se" />
                <Picker.Item label="Tocantins" value="to" />
              </Picker>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Cidade<Text style={styles.asterisk}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Digite a cidade"
                placeholderTextColor="#AAAAAA"
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Bairro<Text style={styles.asterisk}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o bairro"
                placeholderTextColor="#AAAAAA"
                value={neighborhood}
                onChangeText={setNeighborhood}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Rua<Text style={styles.asterisk}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Digite a rua"
                placeholderTextColor="#AAAAAA"
                value={street}
                onChangeText={setStreet}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Número<Text style={styles.asterisk}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o número"
                value={number}
                placeholderTextColor="#AAAAAA"
                onChangeText={handleNumberChange}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Complemento</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#AAAAAA"
                placeholder="Apto, bloco, etc."
                value={complement}
                onChangeText={setComplement}
              />
            </View>

            <View style={styles.buttonRow}>
              <Button title="Cancelar" color="#888" onPress={onClose} />
              <Button title="Confirmar" color="#297E33" onPress={handleConfirm} />
            </View>
          </ScrollView>
        </View>
      </View>
      <CustomAlertModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        message={modalMessage}
      />
    </Modal >
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "95%",
    maxHeight: "90%",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  inputGroup: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  label: {
    color: "#297E33",
    fontWeight: "bold",
    marginBottom: 5,
  },
  asterisk: {
    color: 'red',
    fontSize: 16,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 8,
  },
  picker: {
    height: 50,
    color: '#333',
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  loadingIndicator: {
    position: 'absolute',
    right: 15,
    top: '50%',
  },
});
