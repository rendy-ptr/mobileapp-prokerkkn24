import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const StudentDetailScreen = ({ route, apiUrl }) => {
  const { student } = route.params;
  const navigation = useNavigation();

  const handleExport = async () => {
    try {
      const fileName = `Surat_Keterangan_Kelakuan_Baik_${student.namaSiswa}.xlsx`;
      const fileUri = FileSystem.documentDirectory + fileName;

      const downloadResumable = FileSystem.createDownloadResumable(
        `${apiUrl}/export/${student.id}`,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          console.log(`Download progress: ${progress * 100}%`);
        }
      );

      const { uri } = await downloadResumable.downloadAsync();

      if (uri) {
        Alert.alert('Success', 'File berhasil diunduh.');
        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, { UTI: '.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        } else {
          Alert.alert('Error', 'Sharing tidak tersedia di perangkat ini');
        }
      } else {
        Alert.alert('Error', 'Gagal mengunduh file.');
      }
    } catch (error) {
      console.error('Error saat mengekspor data:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat mengekspor data.');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/student/${student.id}`);
      Alert.alert('Success', 'Data siswa berhasil dihapus.');
      navigation.goBack(); // Menggunakan navigation dari hook
    } catch (error) {
      console.error('Error deleting student:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat menghapus data siswa.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nama Siswa:</Text>
      <Text style={styles.detail}>{student.namaSiswa}</Text>

      <Text style={styles.label}>Tempat Tanggal Lahir:</Text>
      <Text style={styles.detail}>{student.tempatTanggalLahir}</Text>

      <Text style={styles.label}>Nama Orangtua/Wali:</Text>
      <Text style={styles.detail}>{student.namaOrangtuaWali}</Text>

      <Text style={styles.label}>Kelas:</Text>
      <Text style={styles.detail}>{student.kelas}</Text>

      <Text style={styles.label}>Nomor Induk Siswa:</Text>
      <Text style={styles.detail}>{student.nomorIndukSiswa}</Text>

      <Text style={styles.label}>NISN:</Text>
      <Text style={styles.detail}>{student.nisn}</Text>

      <Button title="Export Surat Kelakuan Baik" onPress={handleExport} />
      <Button title="Delete Student" onPress={handleDelete} color="red" />
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
    fontWeight: 'bold',
    marginVertical: 8,
  },
  detail: {
    fontSize: 16,
    marginBottom: 16,
  },
});

export default StudentDetailScreen;
