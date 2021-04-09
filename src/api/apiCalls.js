import axios from "axios";
const API_URL = "http://localhost:8000";

async function postTodo(todo, accessToken) {
  try {
    const data = await axios.post(`${API_URL}/todos`, todo);
    return data;
  } catch (error) {
    return error;
  }
}

async function deleteTodo(todoId, accessToken) {
  try {
    const data = await axios.delete(`${API_URL}/todos/${todoId}`);
    return data;
  } catch (error) {
    return error;
  }
}

async function patchTodo(todo, accessToken) {
  try {
    const data = await axios.patch(`${API_URL}/todos/${todo.id}`, todo);
    return data;
  } catch (error) {
    return error;
  }
}

async function postHabit(habit) {
  try {
    const data = await axios.post(`${API_URL}/habits`, habit);
    return data;
  } catch (error) {
    return error;
  }
}

async function patchHabit(habit) {
  try {
    const data = await axios.patch(`${API_URL}/habits/${habit.id}`, habit);
    return data;
  } catch (error) {
    return error;
  }
}

async function deleteHabit(habitId) {
  try {
    const data = await axios.delete(`${API_URL}/habits/${habitId}`);
    return data;
  } catch (error) {
    return error;
  }
}

async function postCheck(check) {
  try {
    const data = await axios.post(`${API_URL}/checks`, check);
    return data;
  } catch (error) {
    return error;
  }
}

async function postGoal(goal) {
  try {
    const data = await axios.post(`${API_URL}/goals`, goal);
    return data;
  } catch (error) {
    return error;
  }
}

async function patchGoal(goal) {
  try {
    const data = await axios.patch(`${API_URL}/goals/${goal.id}`, goal);
    return data;
  } catch (error) {
    return error;
  }
}

async function deleteGoal(goalId) {
  try {
    const data = await axios.delete(`${API_URL}/goals/${goalId}`);
    return data;
  } catch (error) {
    return error;
  }
}

export {
  postTodo,
  deleteTodo,
  patchTodo,
  postHabit,
  patchHabit,
  deleteHabit,
  postCheck,
  postGoal,
  patchGoal,
  deleteGoal,
};
