import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

type InsightsCardProps = {
  totalPaid: number;
  month: string;
  upcomingCount: number;
  upcomingTotal: number;
};

const screenWidth = Dimensions.get('window').width;
const chartWidth = Math.min(screenWidth * 0.8, 768 * 0.8);

const chartConfig = {
  backgroundGradientFrom: Colors.dark.cardBackground,
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: Colors.dark.cardBackground,
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(76, 217, 100, ${opacity})`, 
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  decimalPlaces: 0, 
};

const InsightsCard: React.FC<InsightsCardProps> = ({ 
  totalPaid, 
  month, 
  upcomingCount, 
  upcomingTotal 
}) => {
  // Mock data for the chart
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [120, 150, 180, 200, 170, totalPaid || 220],
      },
    ],
  };

  // Format data values to remove decimal places
  const formattedData = {
    labels: data.labels,
    datasets: [
      {
        ...data.datasets[0],
        data: data.datasets[0].data.map(value => Math.round(value))
      }
    ]
  };

  return (
    <View style={styles.container}>
      <View style={styles.insightRow}>
        <Text style={styles.insightLabel}>You{`'`}ve paid</Text>
        <Text style={styles.insightValue}>${totalPaid.toFixed(2)}</Text>
      </View>
      
      <View style={styles.insightRow}>
        <Text style={styles.insightLabel}>in {month}</Text>
        <Text style={styles.insightMuted}>This month</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.chartContainer}>
        <BarChart
          data={formattedData}
          width={chartWidth}
          height={100} 
          yAxisLabel="$"
          yAxisSuffix=""
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          fromZero={true}
          showValuesOnTopOfBars={true}
          style={styles.chart}
        />
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.insightRow}>
        <Text style={styles.insightLabel}>{upcomingCount} upcoming payments</Text>
        <Text style={styles.insightValue}>${upcomingTotal.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const Shadows = {
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.cardBackground,
    borderRadius: BorderRadius.xl,
    padding: Spacing.sm, 
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    ...Shadows.medium,
  },
  title: {
    ...Typography.bodyLarge,
    color: Colors.dark.text,
    marginBottom: Spacing.xs,
    fontWeight: '600', 
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.xs / 2, 
  },
  insightLabel: {
    ...Typography.bodyMedium, 
    color: Colors.dark.text,
    fontWeight: '400', 
  },
  insightValue: {
    ...Typography.bodyMedium, 
    color: Colors.dark.accentGreen,
    fontWeight: '600', 
  },
  insightMuted: {
    ...Typography.bodySmall,
    color: Colors.dark.textSecondary,
    fontWeight: '400', 
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.divider,
    marginVertical: Spacing.xs, 
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: Spacing.xs,
    backgroundColor: Colors.dark.cardBackground,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.xs,
  },
  chart: {
    borderRadius: BorderRadius.lg,
  },
});

export default InsightsCard;