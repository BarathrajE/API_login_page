import { useNavigate } from "react-router-dom";

const Incomplete = () => {
    const navigate = useNavigate();

  return (
    <>
    <div>Incomplete</div>
       <button onClick={() => navigate("/Exam-result")}>Exam</button>
   
    </>
  )
}

export default Incomplete




