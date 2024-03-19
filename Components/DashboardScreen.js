import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {faCamera} from '@fortawesome/free-solid-svg-icons/faCamera';
import {faSquarePollHorizontal} from '@fortawesome/free-solid-svg-icons/faSquarePollHorizontal';
import {faFileArrowUp} from '@fortawesome/free-solid-svg-icons/faFileArrowUp';
import AllUser from './AllUser';

const DashboardScreen = ({navigation, route}) => {
  // const [data, setData] = useState("")

  // const getStoredData = async () => {
  //     const flag = JSON.parse(await AsyncStorage.getItem('flag'))
  //     const profile = JSON.parse(await AsyncStorage.getItem('profile'))
  //     setData(profile.name)
  //     // console.log(flag, 'flag', profile, 'profile')
  //     // console.log("heaeheaae", profile)
  // }
  // useEffect(() => {
  //     getStoredData()
  // }, [])
  console.log(route, 'line 23');
  const handleLogout = () => {
    console.log('logout');
    Alert.alert('Are you sure you want to logout?', '', [
      {
        text: 'Cancel',
        style: 'destructive',
      },
      {
        text: 'Yes',
        style: 'default',
        onPress: () => navigation.navigate('Login'),
      },
    ]);
    AsyncStorage.setItem('flag', JSON.stringify(false));
    AsyncStorage.setItem('profile', JSON.stringify({}));
  };

  const clickSelfie = () => {
    console.log('selfie clicked');
    navigation.navigate('Camera');
  };

  const getScoreCard = () => {
    navigation.navigate('Scores');
  };

  const getProducts = () => {
    navigation.navigate('Products');
  };

  const handleStartChat = () => {
    // Navigate to the ChatScreen and pass necessary parameters
    navigation.navigate('Chat', {senderId: 'user1', receiverId: 'user2'});
  };
  const handleAllUsers = () => {
    // Navigate to the ChatScreen and pass necessary parameters
    navigation.navigate('AllUser');
  };
  return (
    <SafeAreaView>
      <View style={styles.view}>
        <Text>{route.params}</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.text}>Logout</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.flex}>
          <TouchableHighlight underlayColor="transparent" onPress={clickSelfie}>
            <View style={[styles.card, {backgroundColor: 'mistyrose'}]}>
              <View style={styles.icon}>
                <FontAwesomeIcon
                  icon={faCamera}
                  size={25}
                  style={{color: 'gray'}}
                />
              </View>
              <Text>Take Selfie</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={getScoreCard}>
            <View style={[styles.card, {backgroundColor: 'lightpink'}]}>
              <View style={styles.icon}>
                <FontAwesomeIcon
                  icon={faSquarePollHorizontal}
                  size={25}
                  style={{color: 'gray'}}
                />
              </View>
              <Text>ScoreCard</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor="transparent" onPress={getProducts}>
            <View style={[styles.card, {backgroundColor: '#CBC3E3'}]}>
              <View style={styles.icon}>
                <FontAwesomeIcon
                  icon={faFileArrowUp}
                  size={25}
                  style={{color: 'gray'}}
                />
              </View>
              <Text>GetProducts</Text>
            </View>
          </TouchableHighlight>
          <View style={[styles.card1, {backgroundColor: '#CBC3E3'}]}>
          <Button title="Start Chat" onPress={handleStartChat} />
        </View>
        <View style={[styles.card1, {backgroundColor: '#CBC3E3'}]}>
        <Button title="AllUsers" onPress={handleAllUsers} />
      </View>
        </View>

       
      </ScrollView>

      
    </SafeAreaView>
  );
};
export default DashboardScreen;

const styles = StyleSheet.create({
  view: {
    height: 40,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancel: {
    color: 'red',
    backgroundColor: 'red',
  },
  flex: {
    flex: 1,
    marginTop: 20,
    gap: 25,
  },
  card: {
    padding: 15,
    width: '60%',
    alignSelf: 'center',
    height: 100,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {width: -1, height: -1},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  card1: {
    padding: 15,
    width: '60%',
    alignSelf: 'center',
    height: 100,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {width: -1, height: -1},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  icon: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
  },
  scrollview: {
    borderWidth: 2,
    borderColor: 'black',
  },
});
