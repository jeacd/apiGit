import TeamModal from '@/components/modals/TeamModal'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import Team from '@/components/team/Team'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { ITeam } from '@/interfaces/ITeam'
import { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'

export default function TeamsList() {
    const [teams, setTeams] = useState<ITeam[]>([])
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [selectedTeam, setSelectedTeam] = useState<ITeam | undefined>(undefined)
    

    useEffect(() => {
        async function getData() {
            try {
                const data = await AsyncStorage.getItem('@Formula1App:teams')
                const teamsData = data != null ? JSON.parse(data) : []
                setTeams(teamsData)
            } catch (e) {
            }
        }
        getData()
    }, [])

    const onAdd = (name: string, pilot1: string, pilot2: string, id?: number) => {
        if(!id || id <= 0){
            const newTeam: ITeam = {
                id: Math.floor(Math.random() * 100000),
                name,
                pilot1,
                pilot2
            }
            setTeams([...teams, newTeam])

            const updatedTeams = [...teams, newTeam];
            setTeams(updatedTeams);
            AsyncStorage.setItem('@Formula1App:teams', JSON.stringify(updatedTeams));
        }
        else{
            teams.forEach(team => {
                if(team.id == id){
                    team.name = name
                    team.pilot1 = pilot1
                    team.pilot2 = pilot2
                }
            })
            AsyncStorage.setItem('@Formula1App:teams', JSON.stringify(teams));
        }
        setModalVisible(false)
    }

    const onDelete = (id: number) => {
        const newTeams = teams.filter(team => team.id !== id)
        setTeams(newTeams)
        AsyncStorage.setItem('@Formula1App:teams', JSON.stringify(newTeams));
        setModalVisible(false)
    }

    const openModal = () => {
        setSelectedTeam(undefined)
        setModalVisible(true)
    }
    const openEditModal = (selectedTeam: ITeam) => {
        setSelectedTeam(selectedTeam)
        setModalVisible(true)
    }
    const closeModal = () => {
        setSelectedTeam(undefined)
        setModalVisible(false)
    }

    return (
        <ParallaxScrollView headerBackgroundColor={{ light: '#ECECEC', dark: '#202020' }}>
            <ThemedView style={styles.headerContainer}>
                <ThemedText>{text}</ThemedText>
                <TouchableOpacity onPress={() => openModal()}>
                    <Text style={styles.headerButton}>+</Text>
                </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.container}>
                {teams.map(team => (
                    <TouchableOpacity key={team.id} onPress={() => openEditModal(team)}>
                        <Team name={team.name} pilot1={team.pilot1} pilot2={team.pilot2} id={team.id} onDelete={onDelete} />
                    </TouchableOpacity>
                ))}
            </ThemedView>

            <TeamModal 
                visible={modalVisible} 
                onCancel={closeModal} 
                onAdd={onAdd} 
                team={selectedTeam}
            />
        </ParallaxScrollView>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        padding: 16,
        alignItems: 'flex-end',
    },
    headerButton: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#007BFF',
    },
    container: {
        padding: 16,
    },
})
