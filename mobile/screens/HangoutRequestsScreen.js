import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Card, Button, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../constants';

export default function HangoutRequestsScreen() {
  const [reqs, setReqs] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      setUserId(user._id);
      const res = await axios.get(`${BASE_URL}/hangout-requests/${user._id}`);
      setReqs(res.data);
      setLoading(false);
    })();
  }, []);

  const approve = async (fromId, viaId) => {
    await axios.post(`${BASE_URL}/approve-hangout-request`, {
      to: userId,
      from: fromId,
      approver: viaId
    });
    Alert.alert('Hangout Approved!');
    setReqs(prev => prev.filter(r => r.from._id !== fromId || r.via._id !== viaId));
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={reqs}
        keyExtractor={(item) => item.from._id + '-' + item.via._id}
        renderItem={({ item }) => (
          <Card style={{ margin: 10 }}>
            <Card.Title 
              title={`${item.from.name} via ${item.via.name}`} 
              subtitle={`Status: ${item.status}`} 
            />
            {item.status === 'pending' && (
              <Card.Actions>
                <Button onPress={() => approve(item.from._id, item.via._id)}>Approve</Button>
              </Card.Actions>
            )}
          </Card>
        )}
      />
    </View>
  );
}
