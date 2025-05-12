import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
interface Exam {
  paper_name: string;
}
const apiUrl = import.meta.env.VITE_API_URL;
const Life_exam = () => {
  const [Startexam, setStartexam] = useState<Exam[]>([]);

  useEffect(() => {
    const StartExam = async () => {
      try {
        const response = await axios.get(`${apiUrl}/posp/question_papers`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        setStartexam(response.data);
      } catch (error) {
        console.log("Error fetching exam results:", error);
      }
    };
    StartExam();
  }, []);

  return (
    <>
      <div>
        <h1>Life Insurance Exam</h1>
        {Startexam.map((item, id) => (
          <p key={id}>{item.paper_name}</p>
        ))}
      </div>
    </>
  );
};

export default Life_exam;
