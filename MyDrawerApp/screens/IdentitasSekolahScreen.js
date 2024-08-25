import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const IdentitasSekolahScreen = ({ apiUrl }) => {
  const [data, setData] = useState({
    namaSekolah: '',
    npsn: '',
    namaKepalaSekolah: '',
    nip: '',
    kecamatan: '',
    tanggalKelulusan: '',
    nomorSuratKelulusan: '',
    titiMangsaIjazah: '',
    alamatSekolah: '',
  });

  const [isDataFilled, setIsDataFilled] = useState(false);

  useEffect(() => {
    fetchSchoolIdentity();
  }, []);

  const fetchSchoolIdentity = async () => {
    try {
      const response = await axios.get(`${apiUrl}/school-identity`);
      const result = response.data;

      if (result && result.namaSekolah) {
        setData(result);
        setIsDataFilled(true);
      } else {
        setIsDataFilled(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${apiUrl}/school-identity`, data);
      const result = response.data;
      setData(result);
      setIsDataFilled(true);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isDataFilled ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Identitas Sekolah</Text>
          <Text style={styles.cardContent}>Nama Sekolah: {data.namaSekolah}</Text>
          <Text style={styles.cardContent}>NPSN: {data.npsn}</Text>
          <Text style={styles.cardContent}>Nama Kepala Sekolah: {data.namaKepalaSekolah}</Text>
          <Text style={styles.cardContent}>NIP: {data.nip}</Text>
          <Text style={styles.cardContent}>Kecamatan: {data.kecamatan}</Text>
          <Text style={styles.cardContent}>Tanggal Kelulusan: {data.tanggalKelulusan}</Text>
          <Text style={styles.cardContent}>Nomor Surat Kelulusan: {data.nomorSuratKelulusan}</Text>
          <Text style={styles.cardContent}>Titi Mangsa Ijazah: {data.titiMangsaIjazah}</Text>
          <Text style={styles.cardContent}>Alamat Sekolah: {data.alamatSekolah}</Text>
        </View>
      ) : (
        <View>
          <Text style={styles.label}>Nama Sekolah</Text>
          <TextInput
            style={styles.input}
            value={data.namaSekolah}
            onChangeText={(text) => setData({ ...data, namaSekolah: text })}
            placeholder="Masukkan nama sekolah"
          />
          <Text style={styles.label}>NPSN</Text>
          <TextInput
            style={styles.input}
            value={data.npsn}
            onChangeText={(text) => setData({ ...data, npsn: text })}
            placeholder="Masukkan NPSN"
            keyboardType="numeric"
          />
          <Text style={styles.label}>Nama Kepala Sekolah</Text>
          <TextInput
            style={styles.input}
            value={data.namaKepalaSekolah}
            onChangeText={(text) => setData({ ...data, namaKepalaSekolah: text })}
            placeholder="Masukkan nama kepala sekolah"
          />
          <Text style={styles.label}>NIP</Text>
          <TextInput
            style={styles.input}
            value={data.nip}
            onChangeText={(text) => setData({ ...data, nip: text })}
            placeholder="Masukkan NIP"
            keyboardType="numeric"
          />
          <Text style={styles.label}>Kecamatan</Text>
          <TextInput
            style={styles.input}
            value={data.kecamatan}
            onChangeText={(text) => setData({ ...data, kecamatan: text })}
            placeholder="Masukkan kecamatan"
          />
          <Text style={styles.label}>Tanggal Kelulusan</Text>
          <TextInput
            style={styles.input}
            value={data.tanggalKelulusan}
            onChangeText={(text) => setData({ ...data, tanggalKelulusan: text })}
            placeholder="Masukkan tanggal kelulusan"
          />
          <Text style={styles.label}>Nomor Surat Kelulusan</Text>
          <TextInput
            style={styles.input}
            value={data.nomorSuratKelulusan}
            onChangeText={(text) => setData({ ...data, nomorSuratKelulusan: text })}
            placeholder="Masukkan nomor surat kelulusan"
          />
          <Text style={styles.label}>Titi Mangsa Ijazah</Text>
          <TextInput
            style={styles.input}
            value={data.titiMangsaIjazah}
            onChangeText={(text) => setData({ ...data, titiMangsaIjazah: text })}
            placeholder="Masukkan titi mangsa ijazah"
          />
          <Text style={styles.label}>Alamat Sekolah</Text>
          <TextInput
            style={styles.input}
            value={data.alamatSekolah}
            onChangeText={(text) => setData({ ...data, alamatSekolah: text })}
            placeholder="Masukkan alamat sekolah"
          />
          <Button title="Simpan" onPress={handleSubmit} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  label: {
    fontSize: 18,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 16,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardContent: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default IdentitasSekolahScreen;
