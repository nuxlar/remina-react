import "./App.css";
import Dashboard from "./components/Dashboard";
import { Container } from "react-bootstrap";

function App() {
  return (
    <Container className="App" fluid>
      <Dashboard />
    </Container>
  );
}

export default App;
