import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

export default function GitHubReposScreen() {
  const [repos, setRepos] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [ownerId, setOwnerId] = useState('');
  const [repoId, setRepoId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadRepos();
  }, []);

  const loadRepos = async () => {
    try {
      const savedRepos = await AsyncStorage.getItem('@github_repos');
      if (savedRepos) {
        setRepos(JSON.parse(savedRepos));
      }
    } catch (err) {
      console.error('Erro ao carregar repositórios:', err);
    }
  };

  const saveRepos = async (reposToSave: any[]) => {
    try {
      await AsyncStorage.setItem('@github_repos', JSON.stringify(reposToSave));
    } catch (err) {
      console.error('Erro ao salvar repositórios:', err);
    }
  };

  const handleAddRepo = async () => {
    if (!ownerId || !repoId) {
      setError('Preencha ambos os campos');
      return;
    }

    try {
      const response = await axios.get(`https://api.github.com/repos/${ownerId}/${repoId}`);
      const newRepo = response.data;
      
      if (!repos.some(repo => repo.id === newRepo.id)) {
        const updatedRepos = [...repos, newRepo];
        setRepos(updatedRepos);
        saveRepos(updatedRepos);
        setOwnerId('');
        setRepoId('');
        setError('');
        setModalVisible(false);
      } else {
        setError('Repositório já adicionado');
      }
    } catch (err) {
      setError('Repositório não encontrado');
      console.error(err);
    }
  };

  const handleClearRepos = () => {
    Alert.alert(
      'Limpar repositórios',
      'Tem certeza que deseja remover todos os repositórios salvos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: () => {
            setRepos([]);
            AsyncStorage.removeItem('@github_repos');
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={handleClearRepos}>
          <Text style={styles.headerButton}>-</Text>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>Repositórios GitHub</ThemedText>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.headerButton}>+</Text>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.list}>
        {repos.length > 0 ? (
          repos.map(repo => (
            <ThemedView key={repo.id} style={styles.repoItem}>
              <ThemedText type="subtitle">{repo.name}</ThemedText>
              <ThemedText>{repo.description || 'Sem descrição'}</ThemedText>
              <ThemedText>⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}</ThemedText>
              <ThemedText>👤 {repo.owner.login}</ThemedText>
            </ThemedView>
          ))
        ) : (
          <ThemedText style={styles.emptyText}>Nenhum repositório adicionado</ThemedText>
        )}
      </ThemedView>

      <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
        <ThemedView style={styles.modalContent}>
          <ThemedText type="title" style={styles.modalTitle}>Adicionar Repositório</ThemedText>
          
          <TextInput
            style={styles.input}
            placeholder="Owner ID (usuário)"
            value={ownerId}
            onChangeText={setOwnerId}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Repo ID (repositório)"
            value={repoId}
            onChangeText={setRepoId}
          />
          
          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAddRepo}>
              <ThemedText style={styles.buttonText}>Adicionar</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  headerButton: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  list: {
    flex: 1,
  },
  repoItem: {
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});