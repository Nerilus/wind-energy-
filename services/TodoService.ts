import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const TODOS_STORAGE_KEY = '@todos';

export const TodoService = {
  /**
   * Récupérer toutes les tâches
   */
  async getTodos(): Promise<Todo[]> {
    try {
      const todosJson = await AsyncStorage.getItem(TODOS_STORAGE_KEY);
      return todosJson ? JSON.parse(todosJson) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      return [];
    }
  },

  /**
   * Sauvegarder toutes les tâches
   */
  async saveTodos(todos: Todo[]): Promise<void> {
    try {
      await AsyncStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des tâches:', error);
    }
  },

  /**
   * Ajouter une tâche
   */
  async addTodo(text: string): Promise<Todo> {
    const todos = await this.getTodos();
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
    };
    
    await this.saveTodos([...todos, newTodo]);
    return newTodo;
  },

  /**
   * Mettre à jour une tâche
   */
  async updateTodo(updatedTodo: Todo): Promise<void> {
    const todos = await this.getTodos();
    const updatedTodos = todos.map(todo => 
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    
    await this.saveTodos(updatedTodos);
  },

  /**
   * Supprimer une tâche
   */
  async deleteTodo(id: string): Promise<void> {
    const todos = await this.getTodos();
    const filteredTodos = todos.filter(todo => todo.id !== id);
    
    await this.saveTodos(filteredTodos);
  },

  /**
   * Basculer l'état d'une tâche (terminée/non terminée)
   */
  async toggleTodo(id: string): Promise<void> {
    const todos = await this.getTodos();
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    await this.saveTodos(updatedTodos);
  },
}; 