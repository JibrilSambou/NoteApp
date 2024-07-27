import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Note() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('notes');
        const notes = storedNotes ? JSON.parse(storedNotes) : [];
        const note = notes.find((n) => n.id === id);
        setNote(note);
      } catch (error) {
        console.error('Failed to load note:', error);
      }
    };

    loadNote();
  }, [id]);

  const deleteNote = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      const notes = storedNotes ? JSON.parse(storedNotes) : [];
      const updatedNotes = notes.filter((n) => n.id !== id);

      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      router.push('/');
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Important':
        return 'red';
      case 'Normal':
        return 'blue';
      case 'Pense bête':
        return 'green';
      default:
        return 'black';
    }
  };

  return (
    <View style={styles.container}>
      {note ? (
        <>
          <Text style={styles.title}>{note.title}</Text>
          <Text style={styles.date}>{note.date}</Text>
          <Text style={styles.content}>{note.content}</Text>
          <Text style={[styles.priority, { color: getPriorityColor(note.priority) }]}>
            {note.priority}
          </Text>
          <Button title="Edit" onPress={() => router.push(`/form?id=${id}`)} />
          <Button title="Delete" onPress={deleteNote} />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  content: {
    fontSize: 18,
    marginBottom: 16,
  },
  priority: {
    fontSize: 16,
    marginBottom: 16,
  },
});
