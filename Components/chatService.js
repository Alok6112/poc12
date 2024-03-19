// chatService.js

import database from '@react-native-firebase/database';

// Send a message
export const sendMessage = (senderId, receiverId, message) => {
    database()
      .ref(`/chats/${senderId}-${receiverId}`)
      .push({
        senderId,
        message,
        timestamp: Date.now(),
      });
  };

// Retrieve messages
export const getMessages = (senderId, receiverId, callback) => {
  const chatRef = database().ref(`/chats/${senderId}-${receiverId}`);

  // Attach a listener to receive updates when new messages arrive
  const onMessageReceived = (snapshot) => {
    const messages = [];
    snapshot.forEach((child) => {
      messages.push(child.val());
    });
    
    callback(messages);
  };

  // Attach the listener
  chatRef.on('value', onMessageReceived);

  // Return the function to unsubscribe when needed
  return () => {
    chatRef.off('value', onMessageReceived);
  };
};

