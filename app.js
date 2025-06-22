import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const USER = "A"; // Logged-in user

export default function App() {
  const [data, setData] = useState({
    connections: [],
    secondDegree: [],
    pending: [],
    approved: []
  });

  const fetchData = async () => {
    const res = await axios.get(`http://localhost:3000/users/${USER}`);
    setData(res.data);
  };

  const sendRequest = async (to) => {
    await axios.post("http://localhost:3000/request", { from: USER, to });
    fetchData();
  };

  const approveRequest = async (from) => {
    await axios.post("http://localhost:3000/approve", { from, to: USER });
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>1st-Degree Connections</Text>
      <FlatList data={data.connections} keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item}</Text>
        )}
      />
      <Text style={styles.heading}>2nd-Degree Connections</Text>
      <FlatList data={data.secondDegree} keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.item}>{item}</Text>
            <Button title="Request" onPress={() => sendRequest(item)} />
          </View>
        )}
      />
      <Text style={styles.heading}>Pending Requests</Text>
      <FlatList data={data.pending} keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.item}>{item}</Text>
            <Button title="Approve" onPress={() => approveRequest(item)} />
          </View>
        )}
      />
      <Text style={styles.heading}>Approved Hangouts</Text>
      <FlatList data={data.approved} keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40 },
  heading: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  item: { fontSize: 18, padding: 5 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }
});
