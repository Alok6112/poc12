import {
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Auth from './Auth';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  checkApplicationNotificationPermission,
  getFcmToken,
  registerAppWithFCM,
  registerListenerWithFCM,
} from '../src/utils/fcmHelper';
import messaging from '@react-native-firebase/messaging';
import uuid from 'react-native-uuid';
import database from '@react-native-firebase/database';
GoogleSignin.configure({
  webClientId:
    '772004361029-ge5jrpa6b1a7jak9d3b3d86ucuf4lmiq.apps.googleusercontent.com',
  iosClientId:
    '772004361029-qtsi7peomi1e7jaonuj6p8ni1qpg8lkq.apps.googleusercontent.com',
});

export default RegisterScreen = ({navigation}) => {
  const [user, setUserInfo] = useState(null);
  const [tok, setTok] = useState('');
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleChange = (name, text) => {
    setInputs(prev => ({
      ...prev,
      [name]: text,
    }));
  };

  const handleRegister = async () => {
    let userObj = inputs;


    try {
      const emailCheckSnapshot = await database()
        .ref('/users')
        .orderByChild('email')
        .equalTo(inputs.email)
        .once('value');
  
      if (emailCheckSnapshot.exists()) {
        // Email is already registered in Firebase
        Alert.alert('Email is already registered', '', [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
        return;
      }
    } catch (error) {
      console.error('Error checking email in Firebase:', error);
    }

    
    try {
      const response = await fetch(
        `https://dummy-server-ipe7.onrender.com/users/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userObj),
        },
      );
      const data = await response.json();
      postFcmTokenToServer(tok);
      Alert.alert(data.message, '', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => navigation.navigate('Login')},
      ]);
    } catch (err) {
      console.log(err);
    }

    let data = {
      id: uuid.v4(),
      name: inputs.name,
      email: inputs.email,
      password: inputs.password,
    };
    database()
      .ref('/users/' + data.id)
      .set(data)
      .then(() => {
        console.log('Data set.')
      
      });
  };

  const getFcmToken1 = async () => {
    let token = null;
    console.log('hello');
    await checkApplicationNotificationPermission();
    await registerAppWithFCM();
    try {
      token = await messaging().getToken();
      console.log('getFcmToken1-->', token);
      setTok(token);
      postFcmTokenToServer(token);
      postFcmTokenToServer1(token);
    } catch (error) {
      console.log('getFcmToken Device Token error ', error);
    }
  };

  const postFcmTokenToServer = async token => {
    console.log('input', inputs);
    try {
      const response = await fetch(
        `https://dummy-server-ipe7.onrender.com/users/fcmtoken`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: inputs.email,
            name: inputs.name,
            fcmtoken: token,
          }),
        },
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        console.log('FCM token posted successfully to the server');
      } else {
        console.error('Failed to post FCM token to the server');
      }
    } catch (error) {
      console.error('Error posting FCM token to the server:', error);
    }
  };

  React.useEffect(() => {
    getFcmToken();
    getFcmToken1();
  }, []);

  React.useEffect(() => {
    const unsubscribe = registerListenerWithFCM(navigation);

    return unsubscribe;
  }, []);

  const signIn = async () => {
    try {
      console.log('success');
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo); // Update user info state
      console.log('user', user, 'navigate');
      console.log(userInfo,"hiiiiiiiiiiiiii");
      postFcmTokenToServer1(tok);
      navigation.navigate('Dashboard', userInfo.user.name);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  useEffect(() => {
    // This effect will be triggered when userInfo changes
    if (user) {
      console.log(user.name);
      postFcmTokenToServer1(tok);

      // Use the navigation object to navigate to 'Dashboard'
    }
  }, [user]);

  const postFcmTokenToServer1 = async token => {
    console.log('abc', user.user.email);



    try {
      const emailCheckSnapshot = await database()
        .ref('/users')
        .orderByChild('email')
        .equalTo(user.user.email)
        .once('value');
  
      if (emailCheckSnapshot.exists()) {
        // Email is already registered in Firebase
        Alert.alert('Email is already registered', '', [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
        return;
      }

      let data = {
        id: uuid.v4(),
        name: user.user.name,
        email:  user.user.email,
        password: user.user.password,
      };
      database()
        .ref('/users/' + data.id)
        .set(data)
        .then(() => {
          console.log('Data set.')
        
        });
    } catch (error) {
      console.error('Error checking email in Firebase:', error);
    }


    try {
      const response = await fetch(
        `https://dummy-server-ipe7.onrender.com/users/fcmtoken`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.user.email,
            name: user.user.name,
            fcmtoken: token,
          }),
        },
      );
      const data = await response.json();
      console.log('aaaa', data);
      if (response.ok) {
        console.log('FCM token posted successfully to the server');
      } else {
        console.error('Failed to post FCM token to the server');
      }
    } catch (error) {
      console.error('Error posting FCM token to the server:', error);
    }

    
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Login');
  };
  return (
    <SafeAreaView>
      <View>
        <Text></Text>
      </View>
      <View style={styles.view}>
        <Text style={styles.text}>Email Id</Text>
        <TextInput
          style={styles.input}
          name={'email'}
          value={inputs.email}
          onChangeText={text => handleChange('email', text)}></TextInput>
      </View>
      <View style={styles.view}>
        <Text style={styles.text}>Password</Text>
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          value={inputs.password}
          name={'password'}
          onChangeText={text => handleChange('password', text)}></TextInput>
      </View>
      <View style={styles.view}>
        <Text style={styles.text}>Joining Name</Text>
        <TextInput
          style={styles.input}
          name={'email'}
          value={inputs.name}
          onChangeText={text => handleChange('name', text)}></TextInput>
      </View>

      <TouchableOpacity
        onPress={handleRegister}
        activeOpacity={0.8}
        style={styles.button}>
        <Text>Register</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.heading}>Push Notification</Text>
        <GoogleSigninButton
          style={styles.googleSignInButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={signIn}
        />
      </View>

    <View style={styles.btn} >
      <Button title="Go to Login" onPress={handleNavigateToRegister} />
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    padding: 10,
  },
  view: {
    padding: 20,
  },
  text: {
    marginBottom: 4,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'skyblue',
    padding: 10,
    width: '60%',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 6,
  },
  auth: {
    paddingTop: 15,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginTop: 15,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  googleSignInButton: {
    width: 192,
    height: 48,
    marginTop: 20,
  },
  btn:{
    marginTop:50
  }
});
