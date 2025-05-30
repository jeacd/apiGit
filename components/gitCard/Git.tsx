import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { IconSymbol } from '@/components/ui/IconSymbol'

export type GitProps = {
    repoName: string,
    repoVisibility: string
    repoCreateDate: string

    ownerName: string
    ownerProfile: string
    ownerPhoto: string

    id: number
    onDelete: (id: number) => void
}

export default function Git({repoName, repoVisibility, repoCreateDate, ownerName, ownerProfile, ownerPhoto, id, onDelete}: GitProps){
    return (
        <View style={styles.container}>
            <Image source={{ uri: ownerPhoto }} style={styles.image} />

            <View style={styles.infoContainer}>
                <Text style={styles.primaryContent}>{repoName}</Text>

                <Text style={styles.secondaryContent}>
                    <Text style={{ fontWeight: 'bold' }}>Visibilidade do repositório: </Text>{repoVisibility}
                </Text>

                <Text style={styles.secondaryContent}>
                    <Text style={{ fontWeight: 'bold' }}>Criação do repositório: </Text>{repoCreateDate}
                </Text>

                <Text style={styles.secondaryContent}>
                    <Text style={{ fontWeight: 'bold' }}>Dono do repositório: </Text>{ownerName}
                </Text>
                
                <Text style={styles.secondaryContent}>
                    <Text style={{ fontWeight: 'bold' }}>Perfil do dono: </Text>{ownerProfile}
                </Text>
            </View>

            <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(id)}>
                <IconSymbol size={30} name="trash" color={'red'} />
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 30,
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
        flexShrink: 1,
    },
    primaryContent: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryContent: {
        fontSize: 14,
        color: '#555',
    },
    deleteButton: {
        marginLeft: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
})