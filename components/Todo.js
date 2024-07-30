import React, { useState,useRef,useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, removeTodo } from '../store copy/Actions/todoActions';
import DraggableFlatList, {
  ScaleDecorator,
  ShadowDecorator,
  OpacityDecorator,
  useOnCellActiveAnimation,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Todo = () => {
  const [todoText, setTodoText] = useState('');
  const todos = useSelector(state => state.todos.todos);
  const [data,setData]=useState([]);
  useEffect(() => {
  setData(todos);
  }, [todos])
  const dispatch = useDispatch();
  const ref = useRef(null);

  const renderItem = ({ item, index, drag, isActive }) => (
    <ScaleDecorator>
      <OpacityDecorator activeOpacity={0.5}>
        <ShadowDecorator>
          <TouchableOpacity
            onLongPress={drag}
            style={[
              styles.item,
              { backgroundColor: isActive ? '#e0e0e0' : '#fff' },
            ]}
          >
          <View style={styles.todos}>
          <Text>{index}</Text>
            <Text style={styles.text}>{item.text}</Text>
            <Button title="Remove" onPress={() => handleRemoveTodo(item.id)} />
            </View>
          </TouchableOpacity>
        </ShadowDecorator>
      </OpacityDecorator>
    </ScaleDecorator>
  );


  const handleAddTodo = () => {
    const newTodo = {
      id: Math.random().toString(),
      text: todoText
    };
    dispatch(addTodo(newTodo));
    setTodoText('');
  };

  const handleRemoveTodo = (id) => {
    dispatch(removeTodo(id));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add Todo"
        value={todoText}
        onChangeText={setTodoText}
      />
      <Button title="Add Todo" onPress={handleAddTodo} />
      <GestureHandlerRootView style={styles.container}>
      <DraggableFlatList
        ref={ref}
        data={data}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => setData(data)}
        renderItem={renderItem}
      />
    </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1
  },
  todos:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    padding:10,
    margin:10,
    backgroundColor:'#faf0e6',
    borderRadius:10
  }
});

export default Todo;
