
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View , Image} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { RootState } from '../store';
import { addTodo, deleteTodo, updateTodo } from '../todo/toDoSlice';
interface Todo {
  id: string;
  title: string;
  priority: string;
  deadline: string;
}

const TodoScreen: React.FC = () => {
  const [todo, setTodo] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');
  const [editedTodo, setEditedTodo] = useState<Todo | null>(null);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const todoList = useSelector((state: RootState) => state.todos.todos);

  const priorityMap: { [key: string]: number } = {
    'Cao': 3,
    'Trung bình': 2,
    'Thấp': 1,
  };

  const sortTodoList = (list: Todo[]) => {
    return [...list].sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);
  };

  const isValidDate = (date: string) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = date.match(regex);

    if (!match) {return false;
    } 

    const [, day, month, year] = match;
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    const dateObj = new Date(y, m - 1, d);
    return dateObj.getDate() === d && dateObj.getMonth() + 1 === m && dateObj.getFullYear() === y;
  };


  const isDeadlineAfterToday = (date: string) => {
    const [day, month, year] = date.split('/').map((part) => parseInt(part, 10));
    const deadlineDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    return deadlineDate > today;
  };
  const handleUpdateTodo = () => {
    const updatedTodo = { ...editedTodo, title: todo, priority, deadline };

    dispatch(updateTodo(updatedTodo));
  
    setEditedTodo(null);
    setTodo('');
    setPriority('');
    setDeadline('');
	};
  const handleAddTodo = () => {
    if (todo === '' || deadline === '' || priority === '') {
        Alert.alert('Vui lòng điền đầy đủ tên task, thời hạn và mức độ ưu tiên');
        return;
    }

    if (!isValidDate(deadline)) {
        Alert.alert('Vui lòng nhập đúng định dạng ngày (DD/MM/YYYY) cho thời hạn!');
        return;
    }

    if (!isDeadlineAfterToday(deadline)) {
        Alert.alert('Vui lòng nhập thời hạn ở sau ngày hôm nay!');
        return;
    }

    const newTodo = {
      id: Date.now().toString(),
      title: todo,
      priority,
      deadline,
    };

    dispatch(addTodo(newTodo));
    setTodo('');
    setPriority('');
    setDeadline('');
  };

  const handleDeleteTodo = (id: string) => {
    dispatch(deleteTodo(id));
  };

  const handleEditTodo = (todo: Todo) => {
    setEditedTodo(todo);
    setTodo(todo.title);
    setPriority(todo.priority);
    setDeadline(todo.deadline);
  };

  const calculateDaysUntilDeadline = (deadline: string) => {
    const [day, month, year] = deadline.split('/').map((part) => parseInt(part, 10));
    const deadlineDate = new Date(year, month - 1, day); 
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); 

    return daysLeft >= 0 ? daysLeft : 0; 
  };

  const renderTodos = ({ item }: { item: Todo }) => {
    let priorityColor = '';
    switch (item.priority) {
      case 'Cao':
        priorityColor = 'green';
        break;
      case 'Trung bình':
        priorityColor = 'orange'; 
        break;
      case 'Thấp':
        priorityColor = 'red'; 
        break;
    }
    return (
      <View
      style={[
        styles.todoItem,
      ]}
    >
        <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={styles.todoTitle}>{item.title}</Text>
    <TouchableOpacity onPress={() => handleEditTodo(item)} style={styles.iconButton}>
      <Image
        source={require('../assets/images/edit.png')} 
        style={styles.icon}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleDeleteTodo(item.id)} style={styles.iconButton}>
      <Image
        source={require('../assets/images/delete.png')} 
        style={styles.icon}
      />
    </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={[styles.todoPriority, { color: priorityColor }]}>{item.priority}</Text>
        <Text style={[styles.todoDeadline, {marginRight : 1}]}>

          {calculateDaysUntilDeadline(item.deadline) > 0
            ? `Còn ${calculateDaysUntilDeadline(item.deadline)} ngày`
            : 'Đã quá hạn'}
        </Text>
        </View>
        </View>
      </View>

    );
  };
  const sortedTodoList = sortTodoList(todoList);
  return (
    <View style={styles.container}>
      <Text style={styles.header}>To-do List</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên task"
        value={todo}
        onChangeText={(text) => setTodo(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Thời hạn (DD/MM/YYYY)"
        value={deadline}
        onChangeText={(text) => setDeadline(text)}
        maxLength={10}
      />

      <DropDownPicker
        open={open}
        setOpen={setOpen}
        value={priority}
        items={[
          { label: 'Ưu tiên cao', value: 'Cao' },
          { label: 'Ưu tiên trung bình', value: 'Trung bình' },
          { label: 'Ưu tiên thấp', value: 'Thấp' },
        ]}
        setValue={setPriority}
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        dropDownContainerStyle={styles.dropdownList}
        placeholder="Mức độ ưu tiên"
        multiple={false}
      />


      <FlatList
        data={sortedTodoList}
        renderItem={renderTodos}
        keyExtractor={(item) => item.id}
        ListFooterComponent={<View style={{ height: 70 }} />}
      />
{editedTodo ? (
  <TouchableOpacity
    style={styles.createTaskButton}
    onPress={handleUpdateTodo}
  >
    <Text style={styles.createTaskButtonText}>Lưu thay đổi</Text>
    <Text style={styles.createTaskIcon}>+</Text>
  </TouchableOpacity>
) : (
  <TouchableOpacity
    style={styles.createTaskButton}
    onPress={handleAddTodo}
  >
    <Text style={styles.createTaskButtonText}>Tạo task mới</Text>
    <Text style={styles.createTaskIcon}>+</Text>
  </TouchableOpacity>
)}

    </View>
  );
};

export default TodoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#ffdd59',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  todoItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  todoPriority: {
    fontSize: 14,
    color: '#ff4757',
    marginTop: 4,
  },
  todoDeadline: {
    fontSize: 14,
    color: '#3742fa',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
  },
  dropdownList: {
    backgroundColor: '#fff',
  },
  createTaskButton: {
    position: 'absolute',
    zIndex: 10,
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FF6B81',
    borderRadius: 30,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, 
  },
  createTaskButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  createTaskIcon: {
    color: '#FFF',
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
});


