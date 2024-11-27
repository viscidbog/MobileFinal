import {Calendar, CalendarList, Agenda, CalendarUtils, LocaleConfig} from 'react-native-calendars';

import React, {useState, Fragment, useCallback, useMemo, useRef} from 'react';
import {StyleSheet, View, ScrollView, Text, TouchableOpacity} from 'react-native';

// Get current date and put the formatted date to the initial date variable
const date = new Date();
const INITIAL_DATE = date.toISOString().split('T')[0];

// Localize the calendar to Finnish
LocaleConfig.locales['fi'] = {
    monthNames: ['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'],
    monthNamesShort: ['Tammi', 'Helmi', 'Maalis', 'Huhti', 'Touko', 'Kesä', 'Heinä', 'Elo', 'Syys', 'Loka', 'Marras', 'Joulu'],
    dayNames: ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'],
    dayNamesShort: ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'],
    today: 'Tänään'
};
LocaleConfig.defaultLocale = 'fi';

export default function CalendarScreen() {
    return(
        <View style={{ flex: 1 }}>
        <Calendar
          current={INITIAL_DATE} 
          markedDates={{
            INITIAL_DATE: { selected: true, marked: true, selectedColor: 'blue', today: true }, 
          }}
          onDayPress={(day) => { console.log('selected day', day); }} 
        />
      </View>
    )
}