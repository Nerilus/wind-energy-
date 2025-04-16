import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View as RNView, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TodoItem from '../../components/TodoItem';
import { ThemedText as Text, ThemedView as View } from '../../components/ThemedText';
import { useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { TodoService, Todo } from '../../services/TodoService';

export default function TodosScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Charger les tâches depuis AsyncStorage quand l'écran est affiché
  useFocusEffect(
    useCallback(() => {
      const loadTodos = async () => {
        setIsLoading(true);
        try {
          const savedTodos = await TodoService.getTodos();
          setTodos(savedTodos);
        } catch (error) {
          console.error('Erreur lors du chargement des tâches:', error);
        } finally {
          setIsLoading(false);
        }
      };

      loadTodos();
    }, [])
  );

  const addTodo = async () => {
    if (newTodoText.trim() === '') return;
    
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newTodo = await TodoService.addTodo(newTodoText);
      setTodos([...todos, newTodo]);
      setNewTodoText('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'une tâche:', error);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await TodoService.toggleTodo(id);
      setTodos(
        todos.map(todo => 
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error('Erreur lors du basculement d\'une tâche:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await TodoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression d\'une tâche:', error);
    }
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <TodoItem
      id={item.id}
      text={item.text}
      completed={item.completed}
      onToggle={toggleTodo}
      onDelete={deleteTodo}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196f3" />
        <Text style={styles.loadingText}>Chargement des tâches...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <Text style={styles.title}>Mes Tâches</Text>
        
        {todos.length === 0 ? (
          <RNView style={styles.emptyContainer}>
            <Ionicons name="checkmark-done-circle-outline" size={64} color="#9e9e9e" />
            <Text style={styles.emptyText}>Aucune tâche pour le moment</Text>
          </RNView>
        ) : (
          <FlatList
            data={todos}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
        
        <RNView style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ajouter une nouvelle tâche..."
            placeholderTextColor="#9e9e9e"
            value={newTodoText}
            onChangeText={setNewTodoText}
            onSubmitEditing={addTodo}
          />
          <TouchableOpacity
            style={[styles.addButton, newTodoText.trim() === '' && styles.addButtonDisabled]}
            onPress={addTodo}
            disabled={newTodoText.trim() === ''}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </RNView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#212121',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#bbdefb',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9e9e9e',
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
}); 