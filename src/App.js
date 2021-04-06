import NavBar from "./components/NavBar";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import HabitPage from "./components/habits/HabitPage";
import GoalPage from "./components/goals/GoalPage";
import TodoPage from "./components/todos/TodoPage";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/habits">
            <HabitPage />
          </Route>
          <Route path="/todos">
            <TodoPage />
          </Route>
          <Route path="/goals">
            <GoalPage />
          </Route>
          <Route path="/">
            <Dashboard />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
