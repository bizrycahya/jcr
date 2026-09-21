import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, DocumentProps } from '@react-pdf/renderer';

export interface JcrDetailData {
  categoryLabel: string;
  indikator: string;
  capaian: string;
}

export interface JcrReportData {
  studentName: string;
  className: string;
  waliKelasName: string;
  bulanLabel: string;
  tahun: number;
  details: JcrDetailData[];
  catatanWali?: string | null;
  rencanaTindakLanjut?: string | null;
  namaSekolah: string;
  jenjang: string;
  logoUrl?: string | null;
  namaKepalaSekolah?: string | null;
  ttdKepsekUrl?: string | null;
  ttdWaliUrl?: string | null;
  stempelUrl?: string | null;
  kotaCetak?: string;
  tanggalCetak: string;
}

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: 'Helvetica', color: '#1a1a1a' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderBottom: '2 solid #1e3a8a', paddingBottom: 10 },
  logo: { width: 55, height: 55, marginRight: 12 },
  headerText: { flex: 1 },
  programName: { fontSize: 11, fontFamily: 'Helvetica-BoldOblique', color: '#1e3a8a' },
  schoolName: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#1e3a8a', marginTop: 2 },
  title: { fontSize: 13, fontFamily: 'Helvetica-BoldOblique', textAlign: 'center', marginBottom: 14 },
  infoRow: { flexDirection: 'row', marginBottom: 3 },
  infoLabel: { width: 140, fontSize: 10 },
  infoColon: { width: 10, fontSize: 10 },
  infoValue: { flex: 1, fontSize: 10 },
  table: { marginTop: 14, border: '1 solid #000' },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#e5e7eb', borderBottom: '1 solid #000' },
  tableRow: { flexDirection: 'row', borderBottom: '1 solid #000' },
  cellNo: { width: 28, padding: 5, borderRight: '1 solid #000', fontSize: 9, textAlign: 'center' },
  cellPilar: { width: 130, padding: 5, borderRight: '1 solid #000', fontSize: 9, fontFamily: 'Helvetica-Oblique' },
  cellIndikator: { width: 130, padding: 5, borderRight: '1 solid #000', fontSize: 9 },
  cellCapaian: { flex: 1, padding: 5, fontSize: 9 },
  headerCellText: { fontSize: 9, fontFamily: 'Helvetica-Bold', textAlign: 'center', padding: 5 },
  sectionBar: { backgroundColor: '#dbeafe', padding: 5, marginTop: 14, borderTop: '1 solid #000', borderLeft: '1 solid #000', borderRight: '1 solid #000' },
  sectionBarText: { fontSize: 10, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
  sectionBody: { border: '1 solid #000', padding: 8, minHeight: 50 },
  sectionBodyText: { fontSize: 9, lineHeight: 1.4 },
  signatureBlock: { marginTop: 28 },
  signatureDateRow: { textAlign: 'right', fontSize: 10, marginBottom: 24 },
  signatureRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  signatureCol: { width: '45%' },
  signatureLabel: { fontSize: 10, marginBottom: 2 },
  signatureImage: { width: 90, height: 50, marginVertical: 4, objectFit: 'contain' },
  signatureName: { fontSize: 10, fontFamily: 'Helvetica-Bold', textDecoration: 'underline', marginTop: 40 },
  signatureNameNoTtd: { fontSize: 10, fontFamily: 'Helvetica-Bold', textDecoration: 'underline', marginTop: 4 },
});

export function JcrPdfDocument({ data }: { data: JcrReportData }): React.ReactElement<DocumentProps> {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          {data.logoUrl ? <Image src={data.logoUrl} style={styles.logo} /> : null}
          <View style={styles.headerText}>
            <Text style={styles.programName}>PROGRAM STAY (SUPPORT TO ACHIEVE YOU)</Text>
            <Text style={styles.schoolName}>
              {data.jenjang} {data.namaSekolah.toUpperCase()} (JaNIC)
            </Text>
          </View>
        </View>

        <Text style={styles.title}>JANIC CHARACTER REPORT (JCR)</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nama Siswa</Text>
          <Text style={styles.infoColon}>:</Text>
          <Text style={styles.infoValue}>{data.studentName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Kelas</Text>
          <Text style={styles.infoColon}>:</Text>
          <Text style={styles.infoValue}>{data.className}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Guru Wali (Pendamping)</Text>
          <Text style={styles.infoColon}>:</Text>
          <Text style={styles.infoValue}>{data.waliKelasName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Periode Evaluasi</Text>
          <Text style={styles.infoColon}>:</Text>
          <Text style={styles.infoValue}>{data.bulanLabel} {data.tahun}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.cellNo, styles.headerCellText]}>No</Text>
            <Text style={[styles.cellPilar, styles.headerCellText]}>Pilar Kompetensi</Text>
            <Text style={[styles.cellIndikator, styles.headerCellText]}>Indikator Kompetensi</Text>
            <Text style={[styles.cellCapaian, styles.headerCellText]}>Capaian Kompetensi Peserta Didik</Text>
          </View>
          {data.details.map((d, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.cellNo}>{i + 1}</Text>
              <Text style={styles.cellPilar}>{d.categoryLabel}</Text>
              <Text style={styles.cellIndikator}>{d.indikator}</Text>
              <Text style={styles.cellCapaian}>{d.capaian}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionBar}>
          <Text style={styles.sectionBarText}>Catatan Pendamping</Text>
        </View>
        <View style={styles.sectionBody}>
          <Text style={styles.sectionBodyText}>{data.catatanWali || '-'}</Text>
        </View>

        <View style={styles.sectionBar}>
          <Text style={styles.sectionBarText}>Rencana Tindak Lanjut Pembinaan</Text>
        </View>
        <View style={styles.sectionBody}>
          <Text style={styles.sectionBodyText}>{data.rencanaTindakLanjut || '-'}</Text>
        </View>

        <View style={styles.signatureBlock}>
          <Text style={styles.signatureDateRow}>
            {data.kotaCetak || 'Bandar Lampung'}, {data.tanggalCetak}
          </Text>

          <View style={styles.signatureRow}>
            <View style={styles.signatureCol}>
              <Text style={styles.signatureLabel}>Mengetahui</Text>
              <Text style={styles.signatureLabel}>Kepala {data.jenjang} JaNIC</Text>
              {data.ttdKepsekUrl ? (
                <Image src={data.ttdKepsekUrl} style={styles.signatureImage} />
              ) : null}
              <Text style={data.ttdKepsekUrl ? styles.signatureName : styles.signatureNameNoTtd}>
                {data.namaKepalaSekolah || '-'}
              </Text>
            </View>

            <View style={styles.signatureCol}>
              <Text style={styles.signatureLabel}>Guru Wali / Pendamping STAY</Text>
              {data.ttdWaliUrl ? (
                <Image src={data.ttdWaliUrl} style={styles.signatureImage} />
              ) : null}
              <Text style={data.ttdWaliUrl ? styles.signatureName : styles.signatureNameNoTtd}>
                {data.waliKelasName}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}