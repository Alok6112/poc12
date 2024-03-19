import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from './DashboardScreen';
import Splash from './Splash';
import { Text } from 'react-native';

import CameraScreenPage from './CameraScreen';
import ScoreCardScreen from './ScoreCardScreen';
import RegisterScreen from './RegisterScreen';
import { Products } from './Products';
import ChatScreen from './ChatScreen';
import AllUser from './AllUser';

const Stack = createNativeStackNavigator()

const NavigationApp = ()=>{
    
   return (
    <NavigationContainer >
    <Stack.Navigator initialRouteName='Splash' >
        <Stack.Screen
        name= 'Splash'
        component={Splash}
        options={{title:'',headerShown:false}}
        ></Stack.Screen>
        <Stack.Screen
        name= 'Register'
        component={RegisterScreen}
        options={{ title: 'Register',headerLeft: () => <Text></Text> }}
        >
            
        </Stack.Screen>
        <Stack.Screen
        name= 'Login'
        component={LoginScreen}
        options={{ title: 'Login',}}
        >
        </Stack.Screen>
        <Stack.Screen
        name= 'Dashboard'
        component={DashboardScreen}
        options={{ title: 'Dashboard',headerLeft: () => <Text></Text>}}
        >
        </Stack.Screen>
        <Stack.Screen
        name= 'Camera'
        component={CameraScreenPage}
        options={{ title: ''}}
        >
        </Stack.Screen>
        <Stack.Screen 
        name="Scores" component={ScoreCardScreen} />
        <Stack.Screen
        name= 'Products'
        component={Products}
       
        >
        </Stack.Screen>
   <Stack.Screen name="Chat" component={ChatScreen} />
   <Stack.Screen name="AllUser" component={AllUser} />

    </Stack.Navigator>

</NavigationContainer>
   )
}

export default NavigationApp;
     

