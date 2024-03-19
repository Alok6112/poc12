import {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {all} from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

const AllUser = () => {
  const [allUser, setallUser] = useState([]);
  const [allUserBackup, setallUserBackup] = useState([]);
  const [myData, setMyData] = useState({});
  const [senderId, setSenderId] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData1 = async () => {
      try {
        const userDataJSON = await AsyncStorage.getItem('Chatusers').then(res =>
          JSON.parse(res),
        );
        //   const senderData = JSON.parse(userDataJSON);
        const firstUserId = Object.keys(userDataJSON)[0];
        const user = userDataJSON[firstUserId];
        setMyData(user);
        // Extract the ID from the first (and likely only) key in the object
        const id = Object.keys(userDataJSON)[0];

        console.log('Extracted ID:', id);
        setSenderId(id);
        // setReceiverId(id)
      } catch (error) {
        console.error('Error fetching user data from AsyncStorage:', error);
      }
    };

    fetchData1();
  }, []);

  useEffect(() => {
    getAllUser();
  }, []);

  const getAllUser = () => {
    database()
      .ref('users/')
      .once('value')
      .then(snapshot => {
        console.log('all User data: ', Object.values(snapshot.val()));
        setallUser(
          Object.values(snapshot.val()).filter(item => item.id != senderId),
        );
        // setallUserBackup(
        //   Object.values(snapshot.val()).filter(it => it.id != userData.id),
        // );
      });
  };

  const handleUserPress = async user => {
    try {
      await AsyncStorage.setItem('selectedUser', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data to AsyncStorage:', error);
    }
    database()
      .ref('/chats/' + myData.id + '/' + user.id)
      .once('value')
      .then(snapshot => {
        console.log('User data: ', snapshot.val());

        if (snapshot.val() == null) {
          let roomId = uuid.v4();
          let myD = {
            roomId,
            id: myData.id,
            email: myData.email,
            name: myData.name,
            lstMsg: '',
          };
          database()
            .ref('/chats/' + user.id + '/' + myData.id)
            .update(myD)
            .then(() => console.log('Data updated.'));

          delete user['password'];
          user.lstMsg = '';
          user.roomId = roomId;

          database()
            .ref('/chats/' + myData.id + '/' + user.id)
            .update(user)
            .then(() => console.log('Data updated.'));
          navigation.navigate('Chat', {receiverData: user});
        } else {
          navigation.navigate('Chat', {receiverData: snapshot.val()});
        }

        //Save user data to AsyncStorage

        // Navigate to the new screen
        //navigation.navigate('Chat'); // Replace 'NewScreen' with the name of your new screen
      });
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.headerText}>All Users</TextInput>
      <View style={styles.userContainer}>
        {allUser.map((el, index) => (
          <TouchableOpacity
            style={styles.messageContainer}
            key={index}
            onPress={() => handleUserPress(el)}>
            <View style={styles.messageContainer} key={index}>
              <View style={styles.userCard}>
                <Image
                  source={{uri: 'https://placekitten.com/100/100'}} // Dummy image URL
                  style={styles.userImage}
                />
                <View style={styles.messageContent}>
                  <TextInput style={styles.userName} editable={false} >{el.name}</TextInput>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userContainer: {
    alignItems: 'center', // Center items horizontally
  },
  messageContainer: {
    width: '90%',
    marginBottom: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // Set background color for the user card
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
  },
  messageContent: {
    flex: 1, // Take remaining space in the row
  },
  userName: {
    fontSize: 16,
  },
});

export default AllUser;
