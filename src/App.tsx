import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthForm from "./Pages/AuthForm";
import {Dashboard ,Dashboardpending} from "./Pages/Dashboard";
import Incomplete from "./Pages/Incomplete";
import 'bootstrap/dist/css/bootstrap.min.css';
import Exam_redult_get from './ExamPages/Exam_redult_get';
import Life_exam from "./ExamPages/Life_exam";


function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard-pending" element={<Dashboardpending />} />
        <Route path="/incomplete" element={<Incomplete />} />
        <Route path="/Exam-result" element={<Exam_redult_get />} />
        <Route path="/Life Insurance Exam" element={<Life_exam />} />
      </Routes>
    </BrowserRouter>
    </>
   
  );
}

export default App;
