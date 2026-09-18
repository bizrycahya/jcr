
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

export type JcrReportType = 'umum' | 'karier';

export interface JcrReportData {
  studentName: string;
  className?: string;
  academicYear?: string;
  semester?: string;
  reportType: JcrReportType;
  scores: Record<string, number>;
  notes?: string;
  followUp?: string;
}

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 10, fontFamily: 'Helvetica', color: '#1f2937' },
  title: { fontSize: 18, textAlign: 'center', marginBottom: 8, fontWeight: 'bold' },
  subtitle: { fontSize: 10, textAlign: 'center', marginBottom: 16 },
  section: { marginBottom: 12, border: '1 solid #b91c1c', padding: 8, borderRadius: 4 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', marginBottom: 6, color: '#7f1d1d' },
  row: { flexDirection: 'row', marginBottom: 4 },
  label: { width: '30%', fontWeight: 'bold' },
  value: { width: '70%' },
  item: { flexDirection: 'row', justifyContent: 'space-between', borderBottom: '1 solid #e5e7eb', paddingVertical: 4 },
});

const labelsUmum = [
  'Emotional & Social Competence',
  'Cognitive & Decision Making Skills',
  'Resilience & Self-Efficacy',
  'Moral & Positive Identity',
  'Bonding & Relationship Building',
];

const labelsKarier = [
  'Mengenal diri',
  'Mengenal Pilihan Pendidikan',
  'Mengenal Dunia Karir',
  'Pengambilan Keputusan Karir',
];

export function JcrPdfDocument({ data }: { data: JcrReportData }) {
  const labels = data.reportType === 'karier' ? labelsKarier : labelsUmum;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>JANIC CHARACTER REPORT</Text>
        <Text style={styles.subtitle}>Jannatun Naim International College</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identitas</Text>
          <View style={styles.row}><Text style={styles.label}>Nama Siswa</Text><Text style={styles.value}>{data.studentName}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Kelas</Text><Text style={styles.value}>{data.className || '-'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Tahun Ajaran</Text><Text style={styles.value}>{data.academicYear || '-'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Semester</Text><Text style={styles.value}>{data.semester || '-'}</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Capaian Kompetensi</Text>
          {labels.map((label) => (
            <View key={label} style={styles.item}>
              <Text>{label}</Text>
              <Text>{data.scores[label] ?? 0}/100</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Catatan</Text>
          <Text>{data.notes || '-'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tindak Lanjut</Text>
          <Text>{data.followUp || '-'}</Text>
        </View>
      </Page>
    </Document>
  );
}
