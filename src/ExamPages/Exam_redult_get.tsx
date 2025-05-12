import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";


type ExamResult = {
  paper_name?: string;
  total_questions: number;
  passing_marks: number;
  is_passed: boolean;
};

const apiUrl = import.meta.env.VITE_API_URL;

const ExamResultGet = () => {
  const [examResults, setExamResults] = useState<ExamResult[]>([]);

  // const [Startexam, setStartexam] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamData = async () => {
      const id = localStorage.getItem("posp_id");
      try {
        const response = await axios.get(
          `${apiUrl}/posp/exam_results?posp_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        setExamResults(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching exam results:", error);
      }
    };
    fetchExamData();
  }, []);
  return (
    <div className="container mt-5">
      <h1>Exam Results</h1>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Paper Name</th>
            <th>Total Questions</th>
            <th>Passing Marks</th>
            <th>Pass Status</th>
            <th>Exam</th>
          </tr>
        </thead>
        <tbody>
          {examResults.map((item, id) => (
            <tr key={id}>
              <td>{item.paper_name}</td>
              <td>{item.total_questions}</td>
              <td>{item.passing_marks}</td>
              <td className={item.is_passed ? "bg-success" : "bg-warning"}>
                {item.is_passed ? "Success" : "Pending"}
              </td>
              <td>
                <button onClick={() => navigate("/Life Insurance Exam")}>
                  Start Exam
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <table className="table table-bordered">
        <thead>
          <tr>
            <th>Paper Name</th>
            <th>Total Questions</th>
            <th>Passing Marks</th>
            <th>Pass Status</th>
            <th>Exam</th>
          </tr>
        </thead>
        <tbody>
          {examResults.map((item , id) => (
            <tr key={id}>
              <td>{item.paper_name || "General Insurance Exam"}</td>
              <td>{item.total_questions}</td>
              <td>{item.passing_marks}</td>
              <td className={item.is_passed ? "bg-success" : "bg-warning"}>
                {item.is_passed ? "Success" : "Pending"}
              </td>
              <td>
                <button>Start Exam</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default ExamResultGet;
