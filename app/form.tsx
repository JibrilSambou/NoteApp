import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Form() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('Normal');

  useEffect(() => {
    const loadNote = async () => {
      if (id) {
        try {
          const storedNotes = await AsyncStorage.getItem('notes');
          const notes = storedNotes ? JSON.parse(storedNotes) : [];
          const note = notes.find((n) => n.id === id);
          if (note) {
            setTitle(note.title);
            setContent(note.content);
            setPriority(note.priority);
          }
        } catch (error) {
          console.error('Failed to load note:', error);
        }
      }
    };

    loadNote();
  }, [id]);

  const saveNote = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      const notes = storedNotes ? JSON.parse(storedNotes) : [];

      if (id) {
        // Update existing note
        const noteIndex = notes.findIndex((n) => n.id === id);
        if (noteIndex > -1) {
          notes[noteIndex] = { id, title, content, priority, date: new Date().toISOString() };
        }
      } else {
        // Create new note
        const newNote = { id: Date.now().toString(), title, content, priority, date: new Date().toISOString() };
        notes.push(newNote);
      }

      await AsyncStorage.setItem('notes', JSON.stringify(notes));
      router.push('/');
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Title</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />
      <Text>Content</Text>
      <TextInput value={content} onChangeText={setContent} style={styles.input} multiline />
      <Text>Priority</Text>
      <TextInput value={priority} onChangeText={setPriority} style={styles.input} />
      <Button title="Save" onPress={saveNote} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
});
