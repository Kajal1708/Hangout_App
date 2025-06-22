import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { Card, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../constants';

export default function ConnectionsScreen() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const parsed = JSON.parse(storedUser);
      const res = await axios.get(`${BASE_URL}/connections/${parsed._id}`);
      setConnections(res.data);
      setLoading(false);
    };
    fetchConnections();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 100 }} />;

  return (
    <FlatList
      data={connections}
      keyExtractor={item => item._id}
      renderItem={({ item }) => (
        <Card style={{ margin: 10 }}>
          <Card.Title title={item.name} subtitle={item.email} />
        </Card>
      )}
    />
  );
}
