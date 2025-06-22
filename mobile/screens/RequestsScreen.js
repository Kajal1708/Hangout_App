// FILE: mobile/screens/RequestsScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Card, Button, Text, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../constants';

export default function RequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRequests() {
      try {
        const stored = await AsyncStorage.getItem('user');
        const user = JSON.parse(stored);
        setCurrentUser(user);

        const res = await axios.get(`${BASE_URL}/requests/${user._id}`);
        setRequests(res.data);
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch requests');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRequests();
  }, []);

  const handleAccept = async (fromId) => {
    try {
      await axios.post(`${BASE_URL}/accept-request`, {
        from: fromId,
        to: currentUser._id,
      });
      setRequests(prev => prev.filter(r => r._id !== fromId));
    } catch (err) {
      Alert.alert('Error', 'Failed to accept request');
      console.error(err);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 100 }} />;

  if (!requests.length) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>No incoming requests.</Text>
    </View>
  );

  return (
    <FlatList
      data={requests}
      keyExtractor={item => item._id}
      renderItem={({ item }) => (
        <Card style={{ margin: 10 }}>
          <Card.Title title={item.name} subtitle={item.email} />
          <Card.Actions>
            <Button onPress={() => handleAccept(item._id)}>Accept</Button>
          </Card.Actions>
        </Card>
      )}
    />
  );
}
