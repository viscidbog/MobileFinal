import React from "react";
import { View, Text, StyleSheet, Dimensions, Alert } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import getHours from "date-fns/getHours";

const ElectricityBarChart = ({ data, title }) => {

  // Prepare data for BarChart
  const chartData = data.map((item) => ({
    value: item.price,
    label: getHours(item.endDate),
    frontColor: "#1fb9fc",
  }));

  // Alert to show a more detailed price
  const handlePress = (item, index) => {

    // Get the label for the clicked bar
    const label = chartData[index].label;

    Alert.alert(
      `Klo: ${label}`,
      `${item.value} c`,
      [
      ],
      { cancelable: true }
    );
  };

  // Find the max value for dynamic scaling, and round it up to the nearest integer
  const maxValue = Math.ceil(Math.max(...data.map((item) => item.price)));

  // If there is not data, show a message
  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.title}>Huomisen tietoja ei vielä saatavilla. Kokeile uudestaan klo 14 jälkeen.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <BarChart
        onPress={(item, index) => handlePress(item, index)}
        data={chartData}
        height={220}
        width={Dimensions.get("window").width * 1}
        barWidth={9}
        yAxisThickness={1}
        xAxisThickness={1}
        yAxisTextStyle={styles.yAxisText}
        yAxisLabelSuffix="c"
        maxValue={maxValue}
        noOfSections={5} // Adjust sections on Y-axis
        xAxisLabelTextStyle={styles.xAxisText}
        spacing={6} // Space between bars
        hideRules={false} // Show grid lines
        showScrollIndicator={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: "left",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  yAxisText: {
    color: "#555",
    fontSize: 10,
  },
  xAxisText: {
    color: "#555",
    fontSize: 10,
  },
});

export default ElectricityBarChart;
