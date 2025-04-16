import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText as Text } from './ThemedText';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ id, text, completed, onToggle, onDelete }: TodoItemProps) {
  return (
    <Animated.View 
      entering={FadeIn.duration(300)} 
      exiting={FadeOut.duration(300)} 
      style={styles.container}
    >
      <TouchableOpacity 
        style={styles.checkbox} 
        onPress={() => onToggle(id)}
      >
        {completed ? (
          <Ionicons name="checkmark-circle" size={24} color="#4caf50" />
        ) : (
          <Ionicons name="ellipse-outline" size={24} color="#757575" />
        )}
      </TouchableOpacity>
      
      <View style={styles.textContainer}>
        <Text style={[
          styles.text,
          completed && styles.completedText
        ]}>
          {text}
        </Text>
      </View>
      
      <TouchableOpacity onPress={() => onDelete(id)}>
        <Ionicons name="trash-outline" size={22} color="#ff5252" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  checkbox: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9e9e9e',
  },
}); 