import React, { useEffect, useState } from "react";
import { View,Text, TextInput, Button, TouchableOpacity, FlatList, SafeAreaView, Switch, StyleSheet, SectionList, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Products } from "./Components/Products";
import { getFcmToken, registerListenerWithFCM } from "./src/utils/fcmHelper";
import { NativeBaseConfigProvider } from 'native-base';

 const App = () =>{
    const [value,setValue]=useState("")
    const [todoArray,setTodoArray]=useState([])
    const [isAdded,setIsAdded]=useState(false)
    const [count,setCount] = useState(0)
    const [isSet,setIsSet] = useState(false)
    const [movies,setMovies] = useState([])
    const [isLoading,setIsLoading] = useState(true)
    console.log("itemem4=====",todoArray)
    // useEffect(()=>{
    //    const data=   AsyncStorage.getItem('item')
    //    console.log("datadata----",data)
    // },[])
    const onChange = (e) =>{
        setValue(e)

    }

   
    const onPressSubmit = () =>{
        // let value={item:value,id:Math.random()}
        setTodoArray([...todoArray,value])
        setValue("")
        AsyncStorage.setItem("item",JSON.stringify(todoArray))

    }
    const onSearch = () =>{
        setTodoArray([])
        todoArray.filter((el)=>{
            if(el.toLowerCase()== value.toLowerCase())
            setTodoArray([value])
        })

    }

    const toggleSwitch = ()=>{
        setIsSet(prev=>!prev)
    }

    const handleIncrement = ()=>{
        setCount(previousState=>previousState+1)
    }

    const handleDecrement = ()=>{
        setCount(previousState=>previousState-1)
    }

    const handleReset = ()=>{
        setCount(0)
    }

    const productList = [
        {name:'product1',detail:'detail1'},
        {name:'product1',detail:'detail1'},
        {name:'product1',detail:'detail1'},
        {name:'product1',detail:'detail1'}
    ]

    const getMovies = async()=>{
      try{
        const response = await fetch ('https://reactnative.dev/movies.json')
        const data = await response.json()
        console.log(data.movies,'data')
        setMovies(data.movies)
      }
      catch(error){
        console.log(error)
      }
      finally{
        setIsLoading(false)
      }
      
    }

    useEffect(()=>{
        getMovies()
    },[])

    // {console.log(movies)}

    return (

        <SafeAreaView>
           
        <View >
            <Text style={{textAlign:'center'}}>Counter</Text>
            <Text>Count: {count}</Text>
            {/* <Text>{isSet.toString()}</Text> */}
            <TouchableOpacity style={[styles.button,{backgroundColor:'red'}]} onPress={handleIncrement}>
                <Text>Increment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button,{backgroundColor:'skyblue'}]} onPress={handleDecrement}>
                <Text>Decrement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleReset}>
                <Text>Reset</Text>
            </TouchableOpacity>
        </View>
        {/* <View>
            <FlatList
            data={productList}
            renderItem={({item})=>
            <View style={{padding:4,backgroundColor:'lightgrey',margin:4}}> 
                <Text style={styles.text} >{item.name}</Text>
                <Text style={styles.text} >{item.detail}</Text>
            </View>}
            >
            </FlatList>
           
        </View> */}
        {/* <SectionList
         sections={[
            {title: 'D', data: ['Devin', 'Dan', 'Dominic']},
            {
              title: 'J',
              data: [
                'Jackson',
                'James',
                'Jillian',
                'Jimmy',
                'Joel',
                'John',
                'Julie',
              ],
            },
          ]}
          renderItem={({item})=>
          <Text>{item}</Text>
        }
        renderSectionHeader={({section})=><Text>
            {section.title}
        </Text>}
        >

        </SectionList> */}
        <View>
       {isLoading?<ActivityIndicator/>:<FlatList data={movies} renderItem={({item})=>
       <View>
       <Text>{item.title}</Text>
       <Text>{item.releaseYear}</Text>
       </View>}>
       </FlatList>
    }
       </View>
        </SafeAreaView>

    )
}
export default App


const styles = StyleSheet.create({
    button:{
        backgroundColor:'blue',
        padding:4
    },
    text:{
        textAlign:'center'
    }
})