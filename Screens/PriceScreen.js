import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ElectricityBarChart from "../Components/BarChart";
import addHours from "date-fns/addHours";

export default function HomeScreen() {
  const electricApiData = "https://api.porssisahko.net/v1/latest-prices.json";

  const [pricesToday, setPricesToday] = useState([]);
  const [pricesTomorrow, setPricesTomorrow] = useState([]);

  // Fetch electric prices from the API

  // **** NOTE ****
  // The data is missing the 00:00-01:00 entry for today, when fetched after 14:00,
  // since the first price of today is no longer delivered at that time. This was the only API I could find
  // that I could get to work. The data is fetched from Porssisahko.net.
  // **** NOTE ****

  useEffect(() => {
    const fetchElectricPrices = async () => {
      try {
        const response = await fetch(electricApiData);
        if (!response.ok)
          throw new Error(
            "Failed to fetch electric prices: " + response.statusText
          );
        const data = await response.json();

        // Format the time for each price
        const updatedData = data.prices.map((item) => ({
          ...item,
          startDate: formatTime(item.startDate),
          endDate: formatTime(item.endDate),
        }));

        const { currentDayPrices, nextDayPrices } =
          splitPricesByDate(updatedData); // Split prices by date
        setPricesToday(currentDayPrices.reverse()); // Set prices for today
        setPricesTomorrow(nextDayPrices.reverse()); // Set prices for tomorrow, both reversed, since the API returns the prices in descending order
        /* console.log("tänään: ", currentDayPrices);
        console.log("huomenna: ", nextDayPrices); */
      } catch (error) {
        console.error("Error in fetch:", error);
      }
    };
    fetchElectricPrices();
  }, []);

  // Adds 2 hours, then appends +03:00 to the end of the string
  // since the API returns the time in UTC,
  // which is both in the past and in the wrong timezone,
  // so both need to be fixed
  const formatTime = (time) => {
    const formattedTime = addHours(new Date(time), 2).toISOString();
    return formattedTime.slice(0, -1) + "+03:00";
  };

  // Function to split the price by date, so that
  // the prices for today and tomorrow can be displayed separately
  const splitPricesByDate = (data) => {
    const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD
    const nextDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10); // Get date for the next day

    const currentDayPrices = [];
    const nextDayPrices = [];

    data.forEach((item) => {
      const itemDate = item.startDate.slice(0, 10); // Extract YYYY-MM-DD from startDate
      if (itemDate === currentDate) {
        currentDayPrices.push(item);
      } else if (itemDate === nextDate) {
        nextDayPrices.push(item);
      }
    });

    return { currentDayPrices, nextDayPrices };
  };

  return (
    <View style={styles.container}>
      <View style={styles.smallerContainer}>
      <Text>Tänään</Text>
      <ElectricityBarChart data={pricesToday} />
      </View>
      <View style={styles.smallerContainer}>
      <Text>Huomenna</Text>
      <ElectricityBarChart data={pricesTomorrow} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  smallerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
