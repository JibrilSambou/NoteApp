import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('notes');
        const notes = storedNotes ? JSON.parse(storedNotes) : [];
        setNotes(notes);
      } catch (error) {
        console.error('Failed to load notes:', error);
      }
    };

    loadNotes();
  }, []);

  const navigateToNote = (id) => {
    router.push(`/note/${id}`);
  };

  const navigateToForm = () => {
    router.push('/form');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {notes.length === 0 ? (
          <Text>No notes available. Add some!</Text>
        ) : (
          notes.map((note) => (
            <TouchableOpacity
              key={note.id}
              style={styles.noteCard}
              onPress={() => navigateToNote(note.id)}
            >
              <Text style={styles.noteTitle}>{note.title}</Text>
              <Text>{note.date}</Text>
              <Text numberOfLines={2}>{note.content}</Text>
              <Text style={styles[note.priority.toLowerCase().replace(' ', '-')]}>{note.priority}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={navigateToForm}>
        <Text style={styles.addButtonText}>ADD</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  noteCard: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  noteTitle: {
    fontWeight: 'bold',
  },
  important: {
    color: 'red',
  },
  normal: {
    color: 'blue',
  },
  'pense-bete': {
    color: 'green',
  },
  addButton: {
    backgroundColor: '#1E90FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
