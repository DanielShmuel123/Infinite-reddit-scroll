import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text, Linking } from "react-native";

export const Card = ({ thumbnail, title, url, name }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: thumbnail }} />
      <View style={styles.textContainer}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(url);
          }}
        >
          <Text style={styles.title}>{title}</Text>
          <Text>{name}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    borderTopWidth: 1,
    height: 150,
    borderTopColor: "#DAE0E6",
  },
  image: {
    aspectRatio: 1,
    height: "100%",
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    color: "#1C1C1C",
    fontSize: 16,
    fontWeight: "bold",
  },
});
