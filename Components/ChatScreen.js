import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { sendMessage, getMessages } from './chatService'; // Import your chat service
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import SimpleToast from 'react-native-simple-toast';
import MsgComponent from './MsgComponent';
const ChatScreen = (props) => {
  const [senderId, setSenderId]=useState("")
  const [receiverId,setReceiverId]=useState("")
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [msg, setMsg] = React.useState('');
  const [disabled, setdisabled] = React.useState(false);
  const [allChat, setallChat] = React.useState([]);
  const [recData,setRecData]=useState({})
  const [myData,setMyData]=useState({})
// const {receiverId}=route.params
  
const {receiverData} = props.route.params;
  useEffect(() => {
    // Fetch the saved user data from AsyncStorage
    const fetchData = async () => {
        try {
          const userDataJSON = await AsyncStorage.getItem('selectedUser');
          const receiverData1 = JSON.parse(userDataJSON);
          setRecData(receiverData1)
          console.log("receiver id",receiverData1.id)
        let rec=receiverData1.id
          // setSelectedUserData(userData);
          setReceiverId(rec)
        } catch (error) {
          console.error('Error fetching user data from AsyncStorage:', error);
        }
      };
  
      fetchData();
    
    const fetchData1 = async () => {
      try {
        const userDataJSON = await AsyncStorage.getItem('Chatusers');
        const senderData = JSON.parse(userDataJSON);
        const firstUserId = Object.keys(senderData)[0];
             const user = senderData[firstUserId];
              setMyData(user)
        // Extract the ID from the first (and likely only) key in the object
        const id = Object.keys(senderData)[0];
        
        console.log('Extracted ID:', id);
        setSenderId(id)
        // setReceiverId(id)

      } catch (error) {
        console.error('Error fetching user data from AsyncStorage:', error);
      }
    };

    fetchData1();
  }, []);

  useEffect(() => {
    // Attach the listener when the component mounts
    const unsubscribe = getMessages(senderId, receiverId, setMessages);

    // Unsubscribe when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [senderId, receiverId]);

  const handleSendMessage = () => {
    sendMessage(senderId, receiverId, message);
    setMessage('');
  };

  console.log("---->",messages)

  


  useEffect(() => {
    const onChildAdd = database()
      .ref('/messages/'+ receiverData.roomId)
      .on('child_added', snapshot => {
        // console.log('A new node has been added', snapshot.val());
        setallChat((state) => [snapshot.val(),...state]);
      });
    // Stop listening for updates when no longer required
    return () => database().ref('/messages'+ receiverData.roomId).off('child_added', onChildAdd);
  }, [receiverData.roomId]);

  const msgvalid = txt => txt && txt.replace(/\s/g, '').length;

  const sendMsg = () => {
    if (msg == '' || msgvalid(msg) == 0) {
      SimpleToast.show('Enter something....');
      return false;
    }
    setdisabled(true);
    let msgData = {
      roomId: receiverData.roomId,
      message: msg,
      from: myData?.id,
      to: receiverData.id,
      sendTime: moment().format(''),
      msgType: 'text',
    };

    const newReference = database()
      .ref('/messages/' + receiverData.roomId)
      .push();
    msgData.id = newReference.key;
    newReference.set(msgData).then(() => {
      let chatListupdate = {
        lstMsg: msg,
        sendTime: msgData.sendTime,
      };
      database()
        .ref('/chats/' + receiverData?.id + '/' + myData?.id)
        .update(chatListupdate)
        .then(() => console.log('Data updated.'));
      console.log("'/chats/' + myData?.id + '/' + data?.id",receiverData)
      database()
        .ref('/chats/' + myData?.id + '/' + receiverData?.id)
        .update(chatListupdate)
        .then(() => console.log('Data updated.'));

      setMsg('');
      setdisabled(false);
    });
  };

  const sorted=()=>{
    return allChat.sort(function(a,b){
      return new Date(b.sendTime)< new Date(a.sendTime)? -1
      :new Date(b.sendTime)> new Date(a.sendTime)? 1
      :0
    })
  }

  console.log('###########', allChat,recData)
  return (
    <View style={styles.container}>
    <FlatList
      data={sorted()}
      // keyExtractor={(item) => item.timestamp.toString()}
      keyExtractor={(item, index) => index}
      inverted
      renderItem={({ item }) => (
        <MsgComponent
        sender={item.from == myData.id}
        item={item}
      />
      )}
    />
    {/* <View>
        {messages.map((el)=>(
            <TextInput>{el.message}</TextInput>
        ))}
    </View> */}
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="Type your message"
        value={msg}
        onChangeText={(text) => setMsg(text)}
      />
      <Button title="Send" onPress={sendMsg} />
    </View>
  </View>

  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f0f0f0',
    },
    messageContainer: {
      backgroundColor: '#fff',
      padding: 10,
      marginVertical: 5,
      borderRadius: 8,
    },
    messageText: {
      fontSize: 16,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    //   marginTop: 10,
    marginBottom:40
    },
    textInput: {
      flex: 1,
      marginRight: 10,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: '#fff',
      borderRadius: 8,
      fontSize: 16,
    },
  });

export default ChatScreen;