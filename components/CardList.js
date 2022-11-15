import React from "react";
import { StyleSheet, View, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity, Text, Platform, StatusBar } from "react-native";
import { Card } from "./Card";
import { useEffect, useState } from "react";
import Toast from "react-native-root-toast";

const extractRelevantData = (jsonData) => {
  const {
    data: { children, after },
  } = jsonData;
  return {
    after,
    posts: children.map(({ data: { title, thumbnail, id, url, name } }) => ({
      title,
      thumbnail,
      id,
      url,
      name,
    })),
  };
};

const keyExtractor = (item, index) => {
  return `id-${item.id}-index-${index}`;
};

const renderItem = ({ item }) => {
  return <Card {...item} />;
};

export const CardList = () => {
  const [subredditData, setSubredditData] = useState({ after: "", posts: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubreddit = async (after) => {
    setLoading(true);
    try {
      const res = await fetch(`https://www.reddit.com/r/aww.json?after=${after}`);
      const jsonData = await res.json();
      const newData = extractRelevantData(jsonData);
      setSubredditData((prevSubredditData) => {
        const newPosts = [...prevSubredditData.posts, ...newData.posts];
        return {
          after: newData.after,
          posts: newPosts,
        };
      });
    } catch (e) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const showLoadingForEntireScreen = loading && subredditData.posts.length === 0;
  const showFooterLoader = loading && subredditData.posts.length > 1;
  const showRetryButton = !loading && error && subredditData.posts.length === 0;

  const renderLoader = () => {
    if (showFooterLoader) {
      return <ActivityIndicator size={"large"} color="#ff4500" />;
    }
    return <></>;
  };

  useEffect(() => {
    fetchSubreddit();
  }, []);

  const onEndReached = () => {
    if (!loading) {
      fetchSubreddit(subredditData.after);
    }
  };

  if (showRetryButton) {
    return (
      <View style={styles.centeredContainer}>
        <TouchableOpacity onPress={() => fetchSubreddit()}>
          <Text>retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showLoadingForEntireScreen) {
    return <View style={styles.centeredContainer}>{renderLoader()}</View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Toast visible={!!error} position={50} shadow={false} animation={false} hideOnPress={true}>
        Sorry, an error occured, please try again!
      </Toast>
      <FlatList
        data={subredditData.posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderLoader}
        onEndReached={onEndReached}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
