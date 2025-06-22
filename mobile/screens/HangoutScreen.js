import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../constants';

export default function HangoutScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHangouts = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const parsed = JSON.parse(storedUser);
      const res = await axios.get(`${BASE_URL}/hangout-requests/${parsed._id}`);
      setRequests(res.data);
      setLoading(false);
    };
    fetchHangouts();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 100 }} />;

  return (
    <FlatList
      data={requests}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <Card style={{ margin: 10 }}>
          <Card.Content>
            <Text>From: {item.from?.name}</Text>
            <Text>Via: {item.via?.name}</Text>
            <Text>Status: {item.status}</Text>
          </Card.Content>
        </Card>
      )}
    />
  );
}
