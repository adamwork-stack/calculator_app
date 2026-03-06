import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CalculatorInputs } from "@/lib/types";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica" },
  title: { fontSize: 18, marginBottom: 20 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 12, marginBottom: 8, fontWeight: "bold" },
  row: { flexDirection: "row", marginBottom: 4 },
  label: { width: 160 },
  value: { flex: 1 },
  table: { marginTop: 8 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingVertical: 4 },
  tableHeader: { flexDirection: "row", borderBottomWidth: 2, borderBottomColor: "#0f766e", paddingVertical: 4, marginBottom: 4 },
  col1: { width: "25%" },
  col2: { width: "75%" },
  riskBox: { backgroundColor: "#f0fdf4", padding: 12, borderRadius: 4, marginTop: 8 },
  riskWarning: { backgroundColor: "#fef2f2", padding: 12, borderRadius: 4, marginTop: 8 },
});

export interface ReportData {
  inputs: CalculatorInputs;
  depletionAge: number | null;
  finalBalance: number;
  seriesSummary: { age: number; balance: number }[];
  scenarios: { label: string; depletionAge: number | null; finalBalance: number; extendsByYears?: number }[];
}

export function ReportDocument({ data }: { data: ReportData }) {
  const { inputs, depletionAge, finalBalance, seriesSummary, scenarios } = data;
  const riskSummary =
    depletionAge != null
      ? `Savings are projected to run out at age ${depletionAge.toFixed(1)}. Consider reducing spending, delaying retirement, or increasing returns.`
      : `Savings last through life expectancy (age ${inputs.lifeExpectancy}). Projected balance: $${finalBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}.`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Retirement Strategy Report</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your inputs</Text>
          <View style={styles.row}><Text style={styles.label}>Current age</Text><Text style={styles.value}>{inputs.currentAge}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Retirement age</Text><Text style={styles.value}>{inputs.retirementAge}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Life expectancy</Text><Text style={styles.value}>{inputs.lifeExpectancy}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Current savings</Text><Text style={styles.value}>${inputs.currentSavings.toLocaleString()}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Monthly spending</Text><Text style={styles.value}>${inputs.monthlySpending.toLocaleString()}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Expected return (%/year)</Text><Text style={styles.value}>{inputs.expectedReturnPercent}%</Text></View>
          <View style={styles.row}><Text style={styles.label}>Inflation (%/year)</Text><Text style={styles.value}>{inputs.inflationPercent}%</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Savings projection (by year)</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>Age</Text>
              <Text style={styles.col2}>Balance ($)</Text>
            </View>
            {seriesSummary.map((p) => (
              <View key={p.age} style={styles.tableRow}>
                <Text style={styles.col1}>{p.age}</Text>
                <Text style={styles.col2}>{p.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Improvement strategies</Text>
          {scenarios.map((s) => (
            <View key={s.label} style={styles.row}>
              <Text style={styles.label}>{s.label}</Text>
              <Text style={styles.value}>
                {s.depletionAge != null
                  ? `Savings until age ${s.depletionAge}${s.extendsByYears != null && s.extendsByYears > 0 ? ` (+${s.extendsByYears} yrs)` : ""}`
                  : `Last through life expectancy. Final: $${s.finalBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risk summary</Text>
          <View style={depletionAge != null ? styles.riskWarning : styles.riskBox}>
            <Text>{riskSummary}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
