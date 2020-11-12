/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from "react";
import { View, StatusBar, ScrollView } from "react-native";

import PullDown from "react-native-pulldown";

const App: () => React$Node = () => {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <View style={{flex: 1}}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <PullDown
        refreshing={refreshing}
        onRefresh={() => {
          console.log('onRefresh');
          setRefreshing(true)
          setTimeout(() => setRefreshing(false), 2000);
        }}
      >
        <ScrollView>
          {[...new Array(10)].map((m, index) => (
            <View
              key={index}
              style={{
                height: 100,
                backgroundColor: `rgba(0,0,0,${(10 - index) / 10})`,
              }}
            ></View>
          ))}
        </ScrollView>
      </PullDown>
    </View>
  );
};

export default App;
