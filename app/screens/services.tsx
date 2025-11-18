import { useRouter } from 'expo-router';
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ManualDeUso() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/menu")} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Image source={require('assets/images/logo_b.png')} style={styles.logo} />
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>

        <View style={styles.logoContainer}>
          <Text style={styles.headerTitle}>Infraestrutura e Serviços Públicos</Text>
        </View>

        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Limpeza</Text>
          <Text style={styles.paragraph}>Lixo acumulado em vias, descarte irregular de entulho ou calçadas sujas.</Text>
        </View>

        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Meio ambiente</Text>
          <Text style={styles.paragraph}>Poda irregular de árvores, poluição ou desmatamento e queimadas.</Text>
        </View>

        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Transporte</Text>
          <Text style={styles.paragraph}>Atraso ou superlotação em ônibus, problemas de itinerário ou má conservação de veículos.</Text>
        </View>

        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Mobilidade</Text>
          <Text style={styles.paragraph}>Calçadas quebradas, falta de rampas de acesso ou sinalização ruim para pedestres/ciclistas.</Text>
        </View>

        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Serviços</Text>
          <Text style={styles.paragraph}>Iluminação pública apagada, falhas em semáforos ou manutenção em geral.</Text>
        </View>

        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Água</Text>
          <Text style={styles.paragraph}>Vazamento na rede de distribuição, falta de abastecimento ou problemas de qualidade.</Text>
        </View>

        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Energia elétrica</Text>
          <Text style={styles.paragraph}>Queda de energia, fios soltos ou risco em postes e na rede elétrica.</Text>
        </View>

        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Saneamento básico</Text>
          <Text style={styles.paragraph}>Problemas com esgoto a céu aberto, drenagem ou coleta de lixo.</Text>
        </View>

        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Pertubação do sossego</Text>
          <Text style={styles.paragraph}>Barulho excessivo, som alto em horários inadequados ou eventos sem autorização.</Text>
        </View>

        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Segurança</Text>
          <Text style={styles.paragraph}>Falta de policiamento, áreas perigosas ou necessidade de monitoramento.</Text>
        </View>

        <View style={styles.sections}>
          <Text style={styles.sectionTitle}>Animais e Zoonoses</Text>
          <Text style={styles.paragraph}>Animais de rua soltos, maus-tratos ou foco de doenças e pragas.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingBottom: 12,
    zIndex: 10,
    elevation: 0,
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
    fontSize: 30,
    fontWeight: "bold",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: -10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    borderStyle: 'solid',
  },

  logo: {
    width: 180,
    height: 60,
    resizeMode: 'contain',
  },

  headerTitle: {
    color: "#000000",
    fontSize: 22,
    fontWeight: "bold",
  },

  scrollArea: {
    marginTop: 120,
    paddingTop: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  sectionTitle: {
    color: "#007b4b",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 6,
  },

  paragraph: {
    fontSize: 15,
    color: "#333",
    marginBottom: 10,
    lineHeight: 22,
  },

  bold: {
    fontWeight: "bold",
    color: "#0057a3",
  },

  italic: {
    fontStyle: "italic",
  },

  list: {
    marginLeft: 10,
  },

  orderedList: {
    marginLeft: 10,
  },

  item: {
    fontSize: 15,
    marginBottom: 6,
    lineHeight: 22,
  },

  subList: {
    marginLeft: 20,
    marginVertical: 4,
  },

  subItem: {
    fontSize: 14,
    lineHeight: 22,
  },
  sections: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    borderStyle: 'solid',
    marginVertical: 5,
  }
});
