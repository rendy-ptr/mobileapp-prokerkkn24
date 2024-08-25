const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

// Create or update school identity
app.post('/school-identity', async (req, res) => {
  try {
    const {
      namaSekolah,
      npsn,
      namaKepalaSekolah,
      nip,
      kecamatan,
      tanggalKelulusan,
      nomorSuratKelulusan,
      titiMangsaIjazah,
      alamatSekolah,
    } = req.body;

    const schoolIdentity = await prisma.schoolIdentity.upsert({
      where: { id: 1 },
      update: {
        namaSekolah,
        npsn,
        namaKepalaSekolah,
        nip,
        kecamatan,
        tanggalKelulusan,
        nomorSuratKelulusan,
        titiMangsaIjazah,
        alamatSekolah,
      },
      create: {
        namaSekolah,
        npsn,
        namaKepalaSekolah,
        nip,
        kecamatan,
        tanggalKelulusan,
        nomorSuratKelulusan,
        titiMangsaIjazah,
        alamatSekolah,
      },
    });

    res.json(schoolIdentity);
  } catch (error) {
    res.status(500).json({ error: 'Error saving data' });
  }
});

// Get school identity
app.get('/school-identity', async (req, res) => {
  try {
    const schoolIdentity = await prisma.schoolIdentity.findUnique({
      where: { id: 1 },
    });
    res.json(schoolIdentity);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.post('/student', async (req, res) => {
  try {
    const { namaSiswa, tempatTanggalLahir, kelas, namaOrangtuaWali, nomorIndukSiswa, nisn } = req.body;
    const student = await prisma.student.create({
      data: {
        namaSiswa,
        tempatTanggalLahir,
        kelas,
        namaOrangtuaWali,
        nomorIndukSiswa,
        nisn,
      },
    });

    res.status(200).json(student);
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Error saving data' });
  }
});

// Get all students
app.get('/students', async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.get('/export/:id', async (req, res) => {
  try {
    const studentId = parseInt(req.params.id, 10);
    console.log(`Mengambil data untuk ID siswa: ${studentId}`);

    const schoolIdentity = await prisma.schoolIdentity.findUnique({ where: { id: 1 } });
    const student = await prisma.student.findUnique({ where: { id: studentId } });

    if (!schoolIdentity || !student) {
      console.error('Identitas sekolah atau siswa tidak ditemukan');
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }

    const templatePath = path.join(__dirname, 'assets', 'Book1.xlsx');
    console.log(`Memuat template dari: ${templatePath}`);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`File template tidak ditemukan di ${templatePath}`);
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);
    const worksheet = workbook.getWorksheet(1);

    // Fungsi untuk menulis data dengan mempertahankan format dari template
    const writeCell = (cellAddress, value) => {
      const cell = worksheet.getCell(cellAddress);
      // Ambil format asli dari sel
      const originalStyle = { ...cell.style };

      // Setel nilai sel tanpa mengubah format
      cell.value = value;
      cell.style = originalStyle;
    };

    // Tulis data ke worksheet dengan mempertahankan format
    writeCell('C2', 'PEMERINTAH KABUPATEN KARAWANG');
    writeCell('C3', 'DINAS PENDIDIKAN PEMUDA DAN OLAHRAGA');
    writeCell('C4', schoolIdentity.namaSekolah);
    writeCell('C5', `Alamat : ${schoolIdentity.alamatSekolah}`);
    writeCell('D10', `Nomor : ${schoolIdentity.nomorSuratKelulusan}`);
    writeCell('H48', schoolIdentity.namaKepalaSekolah);
    writeCell('H49', schoolIdentity.nip);

    writeCell('G19', student.namaSiswa);
    writeCell('G20', student.tempatTanggalLahir);
    writeCell('G21', student.namaOrangtuaWali);
    writeCell('G22', student.kelas);
    writeCell('G23', student.nomorIndukSiswa);
    writeCell('G24', student.nisn);

    // Mengatur margin dan area cetak jika diperlukan
    worksheet.pageSetup.margins = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      header: 0,
      footer: 0
    };

    worksheet.pageSetup.horizontalCentered = false;
    worksheet.pageSetup.verticalCentered = false;

    worksheet.pageSetup.printArea = 'A1:M56';

    // Simpan dan kirim file
    const fileName = `Surat_Keterangan_Kelakuan_Baik_${student.namaSiswa}.xlsx`;
    const filePath = path.join(__dirname, 'temp', fileName);

    if (!fs.existsSync(path.join(__dirname, 'temp'))) {
      fs.mkdirSync(path.join(__dirname, 'temp'));
    }

    await workbook.xlsx.writeFile(filePath);

    console.log('Mengirim file ke klien');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Kesalahan saat mengirim file:', err);
        res.status(500).send('Kesalahan saat mengirim file');
      }
      fs.unlinkSync(filePath);
    });

  } catch (error) {
    console.error('Kesalahan saat mengekspor data:', error);
    res.status(500).json({ error: 'Kesalahan saat mengekspor data' });
  }
});

// Delete student by id
app.delete('/student/:id', async (req, res) => {
  try {
    const studentId = parseInt(req.params.id, 10);

    // Delete the student
    const deletedStudent = await prisma.student.delete({
      where: { id: studentId },
    });

    res.json({ message: 'Student deleted successfully', student: deletedStudent });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Error deleting student' });
  }
});




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
