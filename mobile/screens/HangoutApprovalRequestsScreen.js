import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Card, Text, Button, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../constants';

const HangoutApprovalRequestsScreen = () => {
  const [requests, setRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);

        const res = await axios.get(`${BASE_URL}/hangout-requests/${parsedUser._id}`);
        const allRequests = res.data;

        const approvalRequests = allRequests.filter(
          (req) =>
            req.via?._id?.toString() === parsedUser._id && req.status === 'pending'
        );

        // ✅ Debugging logs
        console.log('All Requests:', allRequests);
        console.log('Current User:', parsedUser._id);
        console.log('Filtered Approval Requests:', approvalRequests);

        setRequests(approvalRequests);
      } catch (err) {
        console.error('Failed to fetch approval requests', err);
        Alert.alert('Error', 'Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (fromId, toId) => {
    try {
      await axios.post(`${BASE_URL}/approve-hangout-request`, {
        from: fromId,
        to: toId,
        approver: currentUser._id
      });
      Alert.alert('Success', 'Hangout request approved!');
      setRequests((prev) => prev.filter((r) => !(r.from._id === fromId && r.to === toId)));
    } catch (err) {
      console.error('Approval failed:', err);
      Alert.alert('Error', 'Failed to approve request.');
    }
  };

  const renderItem = ({ item }) => (
    <Card style={{ margin: 10 }}>
      <Card.Title
        title={item.from.name}
        subtitle={`Requested to hangout with ${item.to?.name || 'a user'}`}
      />
      <Card.Content>
        <Text>Email: {item.from.email}</Text>
        <Text>Status: {item.status}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handleApprove(item.from._id, item.to)}>Approve</Button>
      </Card.Actions>
    </Card>
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 100 }} />;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No approval requests
          </Text>
        }
      />
    </View>
  );
};

export default HangoutApprovalRequestsScreen;
