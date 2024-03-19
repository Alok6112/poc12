import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
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
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  checkApplicationNotificationPermission,
  registerAppWithFCM,
} from '../src/utils/fcmHelper';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';

GoogleSignin.configure({
  webClientId:
    '772004361029-ge5jrpa6b1a7jak9d3b3d86ucuf4lmiq.apps.googleusercontent.com',
  iosClientId:
    '772004361029-qtsi7peomi1e7jaonuj6p8ni1qpg8lkq.apps.googleusercontent.com',
});
const LoginScreen = ({navigation}) => {
  const [user, setUserInfo] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleEmailChange = text => {
    setEmail(text);
  };
  const handlePasswordChange = text => {
    setPassword(text);
  };
  const handleNameChange = text => {
    setName(text);
  };

  const StoreData = async () => {
    const userObject = {
      email,
      password,
      name,
    };
    console.log(userObject);
    try {
      await AsyncStorage.setItem('profile', JSON.stringify(userObject));
      await AsyncStorage.setItem('flag', JSON.stringify(true));
    } catch (error) {
      console.log(error);
    }
  };

  const pattern = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

  const handleLogin = async () => {
    const result = email.match(pattern);

    // console.log(result, 'checking pattern');

    if (!email || !password || !name) {
      Alert.alert('Input field are required!');
    } else if (!email.match(pattern)) {
      Alert.alert('Please provide valid email address!');
    } else {
      let userObj = {email, password, name};

      try {
        const response = await fetch(
          `https://dummy-server-ipe7.onrender.com/users/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userObj),
          },
        );
        const data = await response.json();
        Alert.alert(data.message, '', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => navigation.navigate('Dashboard', data.user.name),
          },
        ]);
      } catch (err) {
        console.log(err);
      }

      database()
        .ref('users')
        .orderByChild("email")
        .equalTo(email)
        .once('value')
        .then(snapshot => {
          if (snapshot.exists()) {
            let userData = (snapshot.val());
            console.log(userData, "userdata");
            
            // Use an async IIFE to handle async operations
            (async () => {
              try {
                
                await AsyncStorage.setItem("Chatusers", JSON.stringify(userData)); // Ensure userData is a string
                const data = await AsyncStorage.getItem("Chatusers");
                console.log(JSON.parse(data), "userdata1"); // Parse the string back to an object
                console.log("snap");
              } catch (error) {
                console.error("AsyncStorage error: ", error);
              }
            })();
          } else {
            console.log("No data available");
          }
        })

      // if(email ==="Dummy@mail.com" && password==="dummy"){
      //     Alert.alert('Login Successful!','',[{text: 'OK', onPress: () => {navigation.navigate('Dashboard',{name})}},])
      //     StoreData()
      // }else{
      //     Alert.alert('Wrong Credentials!')
      // }
    }
  };

  const signIn = async () => {
    try {
      console.log('success');
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo); // Update user info state
      console.log(userInfo, 'navigate');
      console.log(userInfo.user.name);
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

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView>
      <View style={styles.view}>
        <Text style={styles.text}>Email Id</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={handleEmailChange}></TextInput>
      </View>
      <View style={styles.view}>
        <Text style={styles.text}>Password</Text>
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          value={password}
          onChangeText={handlePasswordChange}></TextInput>
      </View>
      <View style={styles.view}>
        <Text style={styles.text}>Joining Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={handleNameChange}></TextInput>
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        activeOpacity={0.8}
        style={styles.button}>
        <Text>Login</Text>
      </TouchableOpacity>

      {/* <View style={styles.container}>
        <Text style={styles.heading}>Push Notification</Text>
        <GoogleSigninButton
          style={styles.googleSignInButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={signIn}
        />
      </View> */}

      <View style={styles.btn}>
      <Button title="Go to Register" onPress={handleNavigateToRegister} />
    </View>

    </SafeAreaView>
  );
};

export default LoginScreen;

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
