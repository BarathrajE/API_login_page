import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

interface Login {
  mobile_no: string;
  otp: string;
}

interface Sign {
  full_name: string;
  mobile_no: string;
  email: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

function AuthForm() {
  //States

  const [isLogin, setIsLogin] = useState(true);

  const [Data, setData] = useState<Login>({ mobile_no: "", otp: "" });
  const [isSingup, setisSingup] = useState<Sign>({
    full_name: "",
    mobile_no: "",
    email: "",
  });
  const [otpVerification, setOtpVerification] = useState({
    email_otp: "",
    mobile_otp: "",
  });
  const [otpStatus, setOtpStatus] = useState({ mobile_no: "", otp: "" });
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const [showinput, setshowInput] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // OnChange Event

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleChangeOtp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOtpStatus((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeOtpverifi = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtpVerification((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleChangeSign = (e: React.ChangeEvent<HTMLInputElement>) => {
    setisSingup((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  //Timer Functionality
  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setTimeout(() => {
        setCounter((prev) => prev - 1);
      }, 1000);
    } else if (counter === 0) {
      setIsResendDisabled(false);
    }
    console.log(timer);
  }, [counter]);

  //API Call
  const handleSendOtp = async () => {
    try {
      const mobileNumber = isLogin ? Data.mobile_no : isSingup.mobile_no;
      const response = await axios.post(`${apiUrl}/posp/send_otp`, {
        mobile_no: mobileNumber,
      });
      console.log("OTP sent successfully! Response:", response.data);
      setshowInput(true);

      // Start timer
      setIsResendDisabled(true);
      setCounter(5); // 30 seconds
    } catch (err) {
      console.error("Failed to send OTP:", err);
    }
  };

  const navigate = useNavigate();
  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const response = await axios.post(
          `${apiUrl}/posp/login`,
          {
            mobile_no: Data.mobile_no,
            otp: otpStatus.otp,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        // Store token in cookies
        Cookies.set("token", response.data.accesstoken, { expires: 7 });

        // Store posp_id and accesstoken in localStorage
        localStorage.setItem("posp_id", response.data.posp_id);
        localStorage.setItem("data", JSON.stringify(response.data));

        // Clear input fields
        setData({ mobile_no: "", otp: "" });
        setOtpStatus({ mobile_no: "", otp: "" });
        if (
          response.data.is_training_completed &&
          response.data.is_profile_completed &&
          response.data.is_exam_completed &&
          response.data.is_agreement_signed
        ) {
          navigate(
            response.data.is_approved ? "/dashboard" : "/dashboard-pending"
          );
        } else {
          navigate("/incomplete");
        }
      } else {
        const response = await axios.post(`${apiUrl}/posp/register `, {
          full_name: isSingup.full_name,
          mobile_no: isSingup.mobile_no,
          email: isSingup.email,
        });
        console.log(response);
        if (response.data) setIsSignupSuccess(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(`${apiUrl}/posp/verify_otps`, {
        email_otp: otpVerification.email_otp,
        email: isSingup.email,
        mobile_no: isSingup.mobile_no,
        mobile_otp: otpVerification.mobile_otp,
      });
      console.log("OTP Verified:", response);
      Cookies.set("token", response.data.access_token, { expires: 7 });
      localStorage.setItem("posp_id", response.data.posp_id);
    } catch (error) {
      console.error("OTP Verification Failed:", error);
    }
  };
  //return Values
  return (
    <div className="container my-5">
      <div className="d-flex justify-content-center mb-4">
        <button
          className={`btn btn-lg px-4 fw-bold ${
            isLogin ? "btn-primary" : "btn-outline-primary"
          } me-2`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`btn btn-lg px-4 fw-bold ${
            !isLogin ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
      </div>

      <div
        className="card shadow-lg p-5 rounded-4 border-0 mx-auto"
        style={{ maxWidth: "500px" }}
      >
        {isLogin ? (
          <>
            <h2 className="text-center mb-4 text-primary">Login</h2>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingMobile"
                placeholder="Mobile Number"
                name="mobile_no"
                value={Data.mobile_no}
                onChange={handleChange}
              />
              <label htmlFor="floatingMobile">Mobile Number</label>
            </div>
            {showinput && (
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingOTP"
                  placeholder="OTP"
                  name="otp"
                  value={otpStatus.otp || ""}
                  onChange={handleChangeOtp}
                />
                <label htmlFor="floatingOTP">OTP</label>
              </div>
            )}
            {showinput ? (
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-outline-warning px-4"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
                <button
                  className="btn btn-link text-decoration-none"
                  onClick={handleSendOtp}
                  disabled={isResendDisabled}
                >
                  {isResendDisabled
                    ? `Resend OTP in ${counter}s`
                    : "Resend OTP"}
                </button>
              </div>
            ) : (
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-outline-warning px-4"
                  onClick={handleSendOtp}
                >
                  Send OTP
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {isSignupSuccess ? (
              <>
                <h2 className="text-center mb-4 text-success">Verify OTP</h2>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="emailOTP"
                    placeholder="Email OTP"
                    name="email_otp"
                    value={otpVerification.email_otp}
                    onChange={handleChangeOtpverifi}
                  />
                  <label htmlFor="emailOTP">Email OTP</label>
                </div>
                <div className="form-floating mb-4">
                  <input
                    type="text"
                    className="form-control"
                    id="mobileOTP"
                    placeholder="Mobile OTP"
                    name="mobile_otp"
                    value={otpVerification.mobile_otp}
                    onChange={handleChangeOtpverifi}
                  />
                  <label htmlFor="mobileOTP">Mobile OTP</label>
                </div>
                <div className="text-center">
                  <button
                    className="btn btn-success px-5"
                    onClick={handleVerifyOtp}
                  >
                    Verify
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-center mb-4 text-primary">Sign Up</h2>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingName"
                    placeholder="Full Name"
                    name="full_name"
                    value={isSingup.full_name}
                    onChange={handleChangeSign}
                  />
                  <label htmlFor="floatingName">Full Name</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingEmail"
                    placeholder="Email"
                    name="email"
                    value={isSingup.email}
                    onChange={handleChangeSign}
                  />
                  <label htmlFor="floatingEmail">Email Address</label>
                </div>
                <div className="form-floating mb-4">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingMobile2"
                    placeholder="Mobile Number"
                    name="mobile_no"
                    value={isSingup.mobile_no}
                    onChange={handleChangeSign}
                  />
                  <label htmlFor="floatingMobile2">Mobile Number</label>
                </div>
                <div className="text-center">
                  <button
                    className="btn btn-primary px-5"
                    onClick={handleSubmit}
                  >
                    Sign Up
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AuthForm;
