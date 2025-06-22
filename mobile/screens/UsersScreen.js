import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert, SafeAreaView } from 'react-native';
import { Card, Button, Text, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../constants';

const UsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);

        const res = await axios.get(`${BASE_URL}/users/${parsedUser._id}`);
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        Alert.alert('Error', 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSendRequest = async (toId) => {
    try {
      await axios.post(`${BASE_URL}/send-request`, {
        from: currentUser._id,
        to: toId,
      });
      Alert.alert('Success', 'Connection request sent!');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to send request.');
    }
  };

  const handleSendHangoutRequest = async (toId) => {
    try {
      const connectionsRes = await axios.get(`${BASE_URL}/connections/${currentUser._id}`);
      const userConnections = connectionsRes.data.map(c => c._id);

      const targetRes = await axios.get(`${BASE_URL}/connections/${toId}`);
      const targetConnections = targetRes.data.map(c => c._id);

      const mutuals = userConnections.filter(id => targetConnections.includes(id));

      if (mutuals.length === 0) {
        Alert.alert('Error', 'No mutual connection for hangout.');
        return;
      }

      await axios.post(`${BASE_URL}/send-hangout-request`, {
        from: currentUser._id,
        to: toId,
        via: mutuals[0]
      });

      Alert.alert('Success', 'Hangout request sent!');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to send hangout request.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.replace('Login');
  };

  const renderItem = ({ item }) => (
    <Card style={{ margin: 10 }}>
      <Card.Title title={item.name} subtitle={item.email} />
      <Card.Actions>
        <Button onPress={() => handleSendRequest(item._id)}>Connect</Button>
        <Button onPress={() => handleSendHangoutRequest(item._id)}>Hangout</Button>
      </Card.Actions>
    </Card>
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 100 }} />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', margin: 10 }}>
        <Button mode="outlined" onPress={handleLogout}>Logout</Button>
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No users found</Text>}
      />
    </SafeAreaView>
  );
};

export default UsersScreen;
