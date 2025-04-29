import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./Pages/AuthForm";
import Dashboard from "./Pages/Dashboard";
import Incomplete from "./Pages/Incomplete";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/incomplete" element={<Incomplete />} />
      </Routes>
    </Router>
  );
}

export default App;
