import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';

const InputScreen = ({ navigation, apiUrl }) => {
  const [namaSiswa, setNamaSiswa] = useState('');
  const [tempatTanggalLahir, setTempatTanggalLahir] = useState('');
  const [namaOrangtuaWali, setNamaOrangtuaWali] = useState('');
  const [kelas, setKelas] = useState('');
  const [nomorIndukSiswa, setNomorIndukSiswa] = useState('');
  const [nisn, setNisn] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${apiUrl}/student`, {
        namaSiswa,
        tempatTanggalLahir,
        namaOrangtuaWali,
        kelas,
        nomorIndukSiswa,
        nisn,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Data saved successfully');

        // Reset all form fields
        setNamaSiswa('');
        setTempatTanggalLahir('');
        setNamaOrangtuaWali('');
        setNomorIndukSiswa('');
        setNisn('');

        navigation.navigate('Home'); // Navigate to HomeScreen after successful submission
      } else {
        Alert.alert('Error', 'Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save data');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nama Siswa</Text>
      <TextInput
        style={styles.input}
        value={namaSiswa}
        onChangeText={setNamaSiswa}
        placeholder="Masukkan nama siswa"
      />
      <Text style={styles.label}>Tempat, Tanggal Lahir</Text>
      <TextInput
        style={styles.input}
        value={tempatTanggalLahir}
        onChangeText={setTempatTanggalLahir}
        placeholder="Masukkan tempat tanggal lahir"
      />
      <Text style={styles.label}>Nama Orangtua/Wali</Text>
      <TextInput
        style={styles.input}
        value={namaOrangtuaWali}
        onChangeText={setNamaOrangtuaWali}
        placeholder="Masukkan nama orangtua/wali"
      />
      <Text style={styles.label}>Kelas</Text>
      <TextInput
        style={styles.input}
        value={kelas}
        onChangeText={setKelas}
        placeholder="Masukkan Kelas"
      />
      <Text style={styles.label}>Nomor Induk Siswa</Text>
      <TextInput
        style={styles.input}
        value={nomorIndukSiswa}
        onChangeText={setNomorIndukSiswa}
        placeholder="Masukkan nomor induk siswa"
        keyboardType="numeric"
      />
      <Text style={styles.label}>NISN</Text>
      <TextInput
        style={styles.input}
        value={nisn}
        onChangeText={setNisn}
        placeholder="Masukkan NISN"
        keyboardType="numeric"
      />
      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
});

export default InputScreen;
