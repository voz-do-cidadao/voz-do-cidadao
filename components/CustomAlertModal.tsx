import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface CustomAlertModalProps {
    visible: boolean;
    onClose: () => void;
    message: string;
}

const CustomAlertModal: React.FC<CustomAlertModalProps> = ({
    visible,
    onClose,
    message,
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable style={styles.centeredView} onPress={onClose}>
                <Pressable style={styles.modalView} onPress={() => { }}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.modalText}>
                            {message}
                        </Text>
                    </View>
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeIcon}>×</Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    modalView: {
        backgroundColor: '#1E408A',
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '100%',
        maxHeight: '80%',
        position: 'relative',
        overflow: 'hidden',
    },
    contentContainer: {
        paddingTop: 40,
        paddingBottom: 30,
        paddingLeft: 50,
        paddingRight: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    modalText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 600,
        fontSize: 18,
        marginBottom: 8,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        color: 'black',
        fontSize: 24,
        fontWeight: 400,
        lineHeight: 28,
    }
});

export default CustomAlertModal;