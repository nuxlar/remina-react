import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Dashboard from "./components/dashboard";
import HabitPage from "./components/habits/HabitPage";
import GoalPage from "./components/goals/GoalPage";
import TodoPage from "./components/todos/TodoPage";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Router>
          <div>
            <nav>
              <ul>
                <li>
                  <Link to="/">Dashboard</Link>
                </li>
                <li>
                  <Link to="/todos">Todos</Link>
                </li>
                <li>
                  <Link to="/habits">Habits</Link>
                </li>
                <li>
                  <Link to="/goals">Goals</Link>
                </li>
              </ul>
            </nav>

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
      </header>
    </div>
  );
}

export default App;
