import axios from "axios";

async function getOrCreateUser(id) {
  try {
    const data = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users`,
      id
    );
    return data;
  } catch (error) {
    return error;
  }
}

// function getTodos(userId) {
//   const { data, error } = useSWR(
//     `${process.env.NEXT_PUBLIC_API_URL}/todos?user_id=${userId}`,
//     fetcher
//   );

//   return {
//     todos: data,
//     isLoading: !error && !data,
//     isError: error,
//   };
// }

async function postTodo(todo) {
  try {
    const data = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/todos`,
      todo
    );
    return data;
  } catch (error) {
    return error;
  }
}

async function deleteTodo(todoId) {
  try {
    const data = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/todos/${todoId}`
    );
    return data;
  } catch (error) {
    return error;
  }
}

async function patchTodo(todo) {
  try {
    const data = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/todos/${todo.id}`,
      todo
    );
    return data;
  } catch (error) {
    return error;
  }
}

// function getHabits(userId) {
//   const { data, error } = useSWR(
//     `${process.env.NEXT_PUBLIC_API_URL}/habits?user_id=${userId}`,
//     fetcher
//   );

//   return {
//     habits: data,
//     isLoading: !error && !data,
//     isError: error,
//   };
// }

async function postHabit(habit) {
  try {
    const data = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/habits`,
      habit
    );
    return data;
  } catch (error) {
    return error;
  }
}

async function patchHabit(habit) {
  try {
    const data = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/habits/${habit.id}`,
      habit
    );
    return data;
  } catch (error) {
    return error;
  }
}

async function deleteHabit(habitId) {
  try {
    const data = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/habits/${habitId}`
    );
    return data;
  } catch (error) {
    return error;
  }
}

async function postCheck(check) {
  try {
    const data = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checks`,
      check
    );
    return data;
  } catch (error) {
    return error;
  }
}

// function getGoals(userId) {
//   const { data, error } = useSWR(
//     `${process.env.NEXT_PUBLIC_API_URL}/goals?user_id=${userId}`,
//     fetcher
//   );

//   return {
//     data: data,
//     isLoading: !error && !data,
//     isError: error,
//   };
// }

async function postGoal(goal) {
  try {
    const data = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/goals`,
      goal
    );
    return data;
  } catch (error) {
    return error;
  }
}

async function patchGoal(goal) {
  try {
    const data = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/goals/${goal.id}`,
      goal
    );
    return data;
  } catch (error) {
    return error;
  }
}

async function deleteGoal(goalId) {
  try {
    const data = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/goals/${goalId}`
    );
    return data;
  } catch (error) {
    return error;
  }
}

export {
  getOrCreateUser,

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
