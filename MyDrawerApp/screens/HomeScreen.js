import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation, apiUrl }) => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [schoolData, setSchoolData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const [studentsResponse, schoolResponse] = await Promise.all([
        axios.get(`${apiUrl}/students`, {
          params: { _t: new Date().getTime() }
        }),
        axios.get(`${apiUrl}/school-identity`, {
          params: { _t: new Date().getTime() }
        })
      ]);
      setStudents(studentsResponse.data);
      setFilteredStudents(studentsResponse.data);
      setSchoolData(schoolResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [apiUrl]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      return () => {
        setStudents([]);
        setFilteredStudents([]);
        setSchoolData(null);
      };
    }, [fetchData])
  );

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    const lowercasedQuery = query.toLowerCase();
    const filtered = students.filter(student =>
      student.namaSiswa.toLowerCase().includes(lowercasedQuery) || 
      student.nisn.toString().includes(lowercasedQuery)
    );
    setFilteredStudents(filtered);
  }, [students]);

  const handlePress = useCallback((student) => {
    navigation.navigate('StudentDetail', { student, schoolData });
  }, [navigation, schoolData]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData(false);
  }, [fetchData]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={() => fetchData()}>
          <Text style={styles.refreshButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Cari berdasarkan nama atau NISN"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
      {filteredStudents.length > 0 ? (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
              <Text style={styles.itemText}>{item.namaSiswa}</Text>
              <Text style={styles.itemText}>{item.nisn}</Text>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        />
      ) : (
        <Text style={styles.noResultsText}>Tidak ada hasil yang ditemukan</Text>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  refreshButton: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 4,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 18,
  },
  noResultsText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default HomeScreen;
