import { SetStateAction, useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native'

import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

import Git from '@/components/gitCard/Git'
import GitModal from '@/components/modals/GitModal'
import { IGit } from '@/interfaces/IGit'

import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

export default function GitHubReposScreen() {
    const [gits, setGits] = useState<IGit[]>([])
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [selectedGit, setSelectedGit] = useState<IGit | undefined>(undefined)
    

    useEffect(() => {
        async function loadRepos() {
            try {
                const data = await AsyncStorage.getItem('@GitApiApp:gits')
                const gitsData = data != null ? JSON.parse(data) : []
                setGits(gitsData)
            } catch (e) {
            }
        }
        loadRepos()
    }, [])

    const getRepo = async (ownerName: string, repoName: string) => {
        const response = await axios.get(`https://api.github.com/repos/${ownerName}/${repoName}`)
        return response.data
    }

    const onAdd = async (repoName: string, ownerName: string, id?: number): Promise<boolean> => {
        try {
            const repoData = await getRepo(ownerName, repoName)
    
            if (!id || id <= 0) {
                const newGit: IGit = {
                    id: Math.floor(Math.random() * 100000),
                    repoName: repoData.name,
                    repoVisibility: repoData.visibility || (repoData.private ? 'private' : 'public'),
                    repoCreateDate: repoData.created_at,
                    ownerName: repoData.owner.login,
                    ownerProfile: repoData.owner.html_url,
                    ownerPhoto: repoData.owner.avatar_url
                }
                const updatedGits = [...gits, newGit]
                setGits(updatedGits)
                AsyncStorage.setItem('@GitApiApp:gits', JSON.stringify(updatedGits))
            } else {
                gits.forEach(git => {
                    if(git.id == id){
                        git.repoName = repoData.name,
                        git.repoVisibility = repoData.visibility || (repoData.private ? 'private' : 'public'),
                        git.repoCreateDate = repoData.created_at,
                        git.ownerName = repoData.owner.login,
                        git.ownerProfile = repoData.owner.html_url,
                        git.ownerPhoto = repoData.owner.avatar_url
                    }
                })
                AsyncStorage.setItem('@GitApiApp:gits', JSON.stringify(gits))
            }
            setModalVisible(false)
            return true
        } catch (error: any) {
            alert('Repositório não encontrado. Verifique o nome do repositório e do proprietário.')
            return false
        }
    }

    const onDelete = (id: number) => {
        const newGits = gits.filter(git => git.id !== id)
        setGits(newGits)
        AsyncStorage.setItem('@GitApiApp:gits', JSON.stringify(newGits));
        setModalVisible(false)
    }

    const onReset = () => {
        Alert.alert(
            'Limpar repositórios',
            'Tem certeza que deseja remover todos os repositórios salvos?',
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Limpar',
                style: 'destructive',
                onPress: () => {
                    const emptyList: SetStateAction<IGit[]> = []
                    setGits(emptyList)
                    AsyncStorage.setItem('@GitApiApp:gits', JSON.stringify(emptyList))
                },
              },
            ]
        )
    }

    const openModal = () => {
        setSelectedGit(undefined)
        setModalVisible(true)
    }
    const openEditModal = (selectedGit: IGit) => {
        setSelectedGit(selectedGit)
        setModalVisible(true)
    }
    const closeModal = () => {
        setSelectedGit(undefined)
        setModalVisible(false)
    }

    return (
        <ParallaxScrollView headerBackgroundColor={{ light: '#ECECEC', dark: '#202020' }}>
            <ThemedView style={styles.headerContainer}>
                <TouchableOpacity onPress={() => onReset()}>
                    <Text style={styles.headerButton}>-</Text>
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>Repositórios GitHub</ThemedText>
                <TouchableOpacity onPress={() => openModal()}>
                    <Text style={styles.headerButton}>+</Text>
                </TouchableOpacity>
            </ThemedView>

            <ThemedView>
                {gits.length > 0 ? (
                    gits.map(git => (
                        <TouchableOpacity key={git.id} onPress={() => openEditModal(git)}>
                            <Git 
                                repoName={git.repoName} 
                                repoVisibility={git.repoVisibility} 
                                repoCreateDate={git.repoCreateDate} 
                                ownerName={git.ownerName}
                                ownerProfile={git.ownerProfile}
                                ownerPhoto={git.ownerPhoto}
                                id={git.id} 
                                onDelete={onDelete}
                            />
                        </TouchableOpacity>
                    ))
                ) : (
                    <ThemedText style={styles.emptyList}>Nenhum repositório adicionado</ThemedText>
                    )
                }
            </ThemedView>

            <GitModal 
                visible={modalVisible} 
                onCancel={closeModal} 
                onAdd={onAdd} 
                git={selectedGit}
            />
        </ParallaxScrollView>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerButton: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#007BFF',
    },
    emptyList: {
        textAlign: 'center',
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        paddingTop: 12
    }
})
