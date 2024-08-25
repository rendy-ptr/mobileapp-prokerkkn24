-- CreateTable
CREATE TABLE `SchoolIdentity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaSekolah` VARCHAR(191) NOT NULL,
    `npsn` VARCHAR(191) NOT NULL,
    `namaKepalaSekolah` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `kecamatan` VARCHAR(191) NOT NULL,
    `tanggalKelulusan` VARCHAR(191) NOT NULL,
    `nomorSuratKelulusan` VARCHAR(191) NOT NULL,
    `titiMangsaIjazah` VARCHAR(191) NOT NULL,
    `alamatSekolah` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaSiswa` VARCHAR(191) NOT NULL,
    `tempatTanggalLahir` VARCHAR(191) NOT NULL,
    `kelas` VARCHAR(191) NOT NULL,
    `namaOrangtuaWali` VARCHAR(191) NOT NULL,
    `nomorIndukSiswa` VARCHAR(191) NOT NULL,
    `nisn` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
