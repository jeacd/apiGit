import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export type GitProps = {
    repoName: string,
    repoVisibility: string
    repoCreateData: string

    ownerName: string
    ownerProfile: string
    ownerPhoto: string
}

export default function Git({repoName, repoVisibility, repoCreateData, ownerName, ownerProfile, ownerPhoto}: GitProps){
    return(
        <View style={styles.container}>
            <Text style={styles.primaryContent}>{repoName}</Text>
            <Text style={styles.secondaryContent}>
                <Text style={{fontWeight: 'bold'}}>Visibilidade do repositório: </Text>{repoVisibility}
            </Text>
            <Text style={styles.secondaryContent}>
                <Text style={{fontWeight: 'bold'}}>Criação do repositório: </Text>{repoCreateData}
            </Text>

            <Text style={styles.secondaryContent}>
                <Text style={{fontWeight: 'bold'}}>Dono do repositório: </Text>{ownerName}
            </Text>
            <Text style={styles.secondaryContent}>
                <Text style={{fontWeight: 'bold'}}>Perfil do dono: </Text>{ownerProfile}
            </Text>
            {/* <Text style={styles.secondaryContent}>
                <Text style={{fontWeight: 'bold'}}>Piloto 2: </Text>{pilot2}
            </Text> */}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    primaryContent: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryContent: {
        fontSize: 16,
        color: '#555',
    }
})