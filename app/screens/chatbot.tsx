import { useRouter } from 'expo-router';
import { Linking } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Keyboard,
  KeyboardEvent,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

export default function App() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [flowStep, setFlowStep] = useState<"menu" | "list" | "final" | null>("menu");
  const [selectedService, setSelectedService] = useState<"contato" | "site" | null>(null);

  const inputMarginAboveKeyboard = 50;

  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const ORGAOS = ["Enel", "Cagece", "Prefeitura"];

  const CONTATOS: Record<string, string> = {
    "enel": "Este é o número de contato da Enel:\n0800 28 00 120",
    "cagece": "Este é o número de contato da Cagece:\n0800 275 0195",
    "prefeitura": "Este é o número de contato da Prefeitura de Fortaleza:\n156",
  };

  const SITES: Record<string, string> = {
    "enel": "SITE oficial da Enel:\nhttps://www.enel.com.br/pt-ceara.html",
    "cagece": "SITE oficial da Cagece:\nhttps://www.cagece.com.br/",
    "prefeitura": "SITE oficial da Prefeitura de Fortaleza:\nhttps://www.fortaleza.ce.gov.br/",
  };

  useEffect(() => {
    const showEvent = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    const hideEvent = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

    const showSub = Keyboard.addListener(showEvent, (event: KeyboardEvent) => {
      Animated.timing(keyboardOffset, {
        toValue: event.endCoordinates.height,
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

  useEffect(() => {
    const inicial: Message = {
      id: Date.now().toString(),
      text:
        "Olá! Bem vindo ao chat de assistência virtual.\nQue tipo de serviço deseja acessar:\n\n1 - Como funciona o app?\n2 - Contato de entidades\n3 - Site oficial de entidades",
      sender: "bot",
    };
    setMessages([inicial]);
  }, []);

  const sendMessage = () => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: "user",
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    setTimeout(() => handleBotReply(trimmed), 600);
  };

  const handleBotReply = (text: string) => {

    if (flowStep === "menu") {
      if (text === "1") {
        botReply(
          "O aplicativo funciona como um canal de denúncias relacionado a problemas com infraestrutura de seu município. Basta seguir as instruções para fazer um post e aguardar por uma resposta em seu email!"
        );
        setFlowStep("final");
        return;
      }

      if (text === "2") {
        botReply("De qual órgão deseja obter o contato?\n\n" + ORGAOS.join("\n"));
        setSelectedService("contato");
        setFlowStep("list");
        return;
      }

      if (text === "3") {
        botReply("De qual órgão deseja obter o site oficial?\n\n" + ORGAOS.join("\n"));
        setSelectedService("site");
        setFlowStep("list");
        return;
      }

      botReply("Opção inválida. Escolha 1, 2 ou 3.");
      return;
    }

    if (flowStep === "list") {
      const org = ORGAOS.find(o => o.toLowerCase() === text);
      if (!org) {
        botReply("Órgão não encontrado. Tente novamente:\n" + ORGAOS.join("\n"));
        return;
      }

      if (selectedService === "contato") {
        botReply(CONTATOS[org.toLowerCase()]);
        setFlowStep("final");
        return;
      }

      if (selectedService === "site") {
        botReply(SITES[org.toLowerCase()]);
        setFlowStep("final");
        return;
      }
    }

    if (flowStep === "final") {
      botReply("Atendimento finalizado. Caso queira começar novamente, digite qualquer coisa.");
      setFlowStep("menu");
      return;
    }
  };

  const botReply = (text: string) => {
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text,
      sender: "bot",
    };
    setMessages(prev => [...prev, botMsg]);
  };

  const renderMessage = ({ item }: { item: Message }) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const parts = item.text.split(urlRegex);

  return (
    <View
      style={[
        styles.messageContainer,
        item.sender === "user" ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text style={styles.messageText}>
        {parts.map((part, index) => {
          if (urlRegex.test(part)) {
            return (
              <Text
                key={index}
                style={{ color: "#add8ff", textDecorationLine: "underline" }}
                onPress={() => Linking.openURL(part)}
              >
                {part}
              </Text>
            );
          }
          return part;
        })}
      </Text>
    </View>
  );
};

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/menu")} style={styles.backButton}>
          <Image
            source={require("../../assets/images/icone_voltar.png")}
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Assistente Virtual</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1, backgroundColor: '#fcf6e9ff' }}
      />

      <Animated.View style={[styles.inputContainer, { marginBottom: Animated.add(keyboardOffset, inputMarginAboveKeyboard) }]}>
        <TextInput
          style={styles.input}
          value={input}
          placeholder="Digite algo..."
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.button} onPress={sendMessage}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 14,
    backgroundColor: '#174791',
  },
  backButton: {
    padding: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    marginRight: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  messagesList: {
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: "#509cf4ff",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#117202ff",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#FFFFFF"
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: -30,
  },
  input: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: "#0078fe",
    marginLeft: 10,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
