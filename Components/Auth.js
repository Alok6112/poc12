import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button, // Added Button import
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '772004361029-ge5jrpa6b1a7jak9d3b3d86ucuf4lmiq.apps.googleusercontent.com',
  iosClientId:
    '772004361029-qtsi7peomi1e7jaonuj6p8ni1qpg8lkq.apps.googleusercontent.com',
});

function Auth({navigation}) {
    
  const [user, setUserInfo] = useState(null); // State to hold user info

  const signIn = async () => {
    try {
      console.log('success');
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo); // Update user info state
      console.log("user",userInfo);
      navigation.navigate('Dashboard', user.name);
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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Push Notification</Text>
      <GoogleSigninButton
        style={styles.googleSignInButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={signIn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
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
});

export default Auth;
