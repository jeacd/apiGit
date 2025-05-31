import React, { useEffect, useState } from "react"
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

import { IGit } from "@/interfaces/IGit"

export type GitModalProps = {
    visible: boolean
    onAdd: (repoName: string, ownerName: string, id?: number) => Promise<boolean>
    onCancel: () => void
    git?: IGit
}

export default function GitModal({ visible, onAdd, onCancel, git }: GitModalProps) {
    const [repoName, setRepoName] = useState('')
    const [ownerName, setOwnerName] = useState('')
    const [id, setId] = useState<number>(0)

    useEffect(() => {
        if (git) {
            setRepoName(git.repoName);
            setOwnerName(git.ownerName);
            setId(git.id);
        } else {
            setRepoName('');
            setOwnerName('');
            setId(0);
        }
    }, [git]);

    return (
        <Modal visible={visible} animationType='fade' transparent={true} onRequestClose={() => {}}>
            <View style={styles.container}>
                <View style={styles.modalContainer}>
                <Text style={styles.title}> {git ? 'Editar Repositório' : 'Adicionar Repositório'}</Text>
                    <TextInput
                        style={styles.boxInput}
                        placeholder='Nome do repositório'
                        value={repoName}
                        onChangeText={setRepoName}
                        autoFocus
                    />
                    <TextInput
                        style={styles.boxInput}
                        placeholder='Nome do proprietário'
                        value={ownerName}
                        onChangeText={setOwnerName}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonCancel} onPress={
                            () => {
                                onCancel()
                                setRepoName('')
                                setOwnerName('')
                            }}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={styles.buttonAdd}
                            onPress={async () => {
                                const success = await onAdd(repoName, ownerName, id)
                                if (success) {
                                    setRepoName('')
                                    setOwnerName('')
                                }
                            }}
                        >
                            <Text style={styles.buttonText}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    boxInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonAdd: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    buttonCancel: {
        backgroundColor: 'orange',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    }
})
