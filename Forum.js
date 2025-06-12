import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const Forum = ({ route }) => {
  const { nickname, userType } = route.params;
  const [tweets, setTweets] = useState([]);
  const [newTweetText, setNewTweetText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentingTweetId, setCommentingTweetId] = useState("");
  const [showCommentsForTweetId, setShowCommentsForTweetId] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={styles.headerLeftContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.goBackButton}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.goBackButtonText}></Text>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    axios
      .get("http://10.30.10.210/compproject/get_all_questions.php")
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          const data = response.data.map((item) => ({
            ...item,
            id: item.question_id,
            comments: [],
          }));
          console.log("Fetched data:", data);
          setTweets(data);
        } else {
          console.error("Error: Invalid data format");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleToggleComments = (tweetId) => {
    setShowCommentsForTweetId((prevId) => (prevId === tweetId ? "" : tweetId));
  };

  const handleAddButtonPress = () => {
    navigation.navigate("SearchAndAdd");
  };

  const handleAddTweet = () => {
    if (newTweetText.trim() !== "") {
      axios
        .post("http://10.30.10.210/compproject/entquestion.php", {
          nickname,
          question_text: newTweetText.trim(),
          userType,
        })
        .then((response) => {
          console.log("Question submitted:", response.data);
          const newTweet = {
            id: Date.now().toString(),
            question_text: newTweetText.trim(),
            image: null,
            comments: [],
            nickname,
            userType,
          };
          setTweets([newTweet, ...tweets]);
          setNewTweetText("");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleComment = (questionId) => {
    setShowCommentsForTweetId((prevId) =>
      prevId === questionId ? "" : questionId
    );
    setCommentingTweetId((prevId) => (prevId === questionId ? "" : questionId));
    setCommentText("");
  };

  const handleAddComment = () => {
    if (commentText.trim() !== "") {
      axios
        .post("http://10.30.10.210/compproject/add_comments.php", {
          question_id: commentingTweetId,
          nickname,
          comment_text: commentText.trim(),
          userType,
        })
        .then((response) => {
          console.log("Comment added:", response.data);
          const updatedTweets = tweets.map((tweet) =>
            tweet.id === commentingTweetId
              ? {
                  ...tweet,
                  comments: [
                    ...tweet.comments,
                    { nickname, comment_text: commentText.trim(), userType },
                  ],
                }
              : tweet
          );
          setTweets(updatedTweets);
          setCommentText("");
          setCommentingTweetId("");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const fetchComments = (questionId) => {
    axios
      .post("http://10.30.10.210/compproject/get_all_comments.php", {
        question_id: questionId,
      })
      .then((response) => {
        console.log("Comments fetched:", response.data);
        const updatedTweets = tweets.map((tweet) =>
          tweet.id === questionId
            ? { ...tweet, comments: response.data }
            : tweet
        );
        setTweets(updatedTweets);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.backgroundImage}>
        <FlatList
          data={tweets}
          renderItem={({ item }) => {
            if (!item) {
              return null;
            }

            return (
              <View style={styles.tweetContainer}>
                <View style={styles.avatarContainer}>
                  {item.userType === "expert" ? (
                    <Image
                      source={require("./assets/expert.png")}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <Image
                      source={require("./assets/enthusiast.png")}
                      style={styles.avatarImage}
                    />
                  )}
                </View>
                <View style={styles.tweetContent}>
                  <Text style={styles.nickname}>
                    {item.nickname || "Unknown"}{" "}
                    {item.userType === "expert" && (
                      <AntDesign name="checkcircle" size={16} color="green" />
                    )}
                  </Text>

                  <Text style={styles.tweetText}>{item.question_text}</Text>

                  {item.image && (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.tweetImage}
                    />
                  )}
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        handleComment(item.id);
                        fetchComments(item.id);
                      }}
                      style={styles.actionButton}
                    >
                      <Ionicons
                        name="chatbubble-outline"
                        size={20}
                        color="#657786"
                      />
                      <Text style={styles.actionButtonText}>add</Text>
                    </TouchableOpacity>
                  </View>
                  {item.id === showCommentsForTweetId && (
                    <View style={styles.commentContainer}>
                      <TextInput
                        style={styles.commentInput}
                        placeholder="Add a comment..."
                        value={commentText}
                        onChangeText={(text) => setCommentText(text)}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          handleAddComment();
                        }}
                        style={styles.addButton}
                      >
                        <Text style={styles.addButtonText}>Add</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {item.id === showCommentsForTweetId &&
                    Array.isArray(item.comments) &&
                    item.comments.map((comment, index) => (
                      <View key={index} style={styles.commentBox}>
                        <View style={styles.avatarContainer}>
                          {comment.userType === "expert" ? (
                            <Image
                              source={require("./assets/expert.png")}
                              style={styles.avatarImage}
                            />
                          ) : (
                            <Image
                              source={require("./assets/enthusiast.png")}
                              style={styles.avatarImage}
                            />
                          )}
                        </View>
                        <Text style={[styles.commentText, { color: "black" }]}>
                          {comment.nickname || "Unknown"}:{" "}
                          {comment.userType === "expert" ? (
                            <AntDesign
                              name="checkcircle"
                              size={16}
                              color="green"
                              style={{ marginLeft: 5 }}
                            />
                          ) : null}{" "}
                          {comment.comment_text}
                        </Text>
                      </View>
                    ))}
                </View>
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.tweetList}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="What's on your mind?"
            value={newTweetText}
            onChangeText={(text) => setNewTweetText(text)}
          />
          <TouchableOpacity onPress={handleAddTweet} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  avatarContainer: {
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  tweetContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
    paddingBottom: 8,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  tweetContent: {
    flex: 1,
  },
  nickname: {
    fontWeight: "bold",
    fontSize: 16,
  },
  tweetText: {
    marginTop: 4,
    fontSize: 14,
    color: "#333",
  },
  tweetImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionButtonText: {
    marginLeft: 4,
    color: "#657786",
  },
  commentContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 16,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    color: "white",
  },
  commentBox: {
    backgroundColor: "#f5f8fa",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  commentText: {
    color: "#333",
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e1e8ed",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 16,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  tweetList: {
    paddingBottom: 80,
  },
});

export default Forum;
