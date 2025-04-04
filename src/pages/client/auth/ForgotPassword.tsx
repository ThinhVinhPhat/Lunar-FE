import { useAuthAction } from "../../../hooks/useAuthAction";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"email" | "code" | "newPassword">("email");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { handleForgotPassword, handleUpdatePassword } = useAuthAction(); 
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      const fullCode = [...newCode.slice(0, 5), value].join("");
      if (fullCode.length === 6) {
        setIsCodeVerified(true);
        setMessage({
          type: "success",
          text: "Code verified successfully! You can now set your new password.",
        });
      } else {
        setIsCodeVerified(false);
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const response = await handleForgotPassword(email);

    setTimeout(() => {
      if (response) {
        setMessage({
          type: "success",
          text: "Verification code has been sent to your email.",
        });
        setStep("code");
      }
      setIsSubmitting(false);
    }, 2000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCodeVerified) {
      setMessage({
        type: "error",
        text: "Please verify your code first!",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }
    if (
      newPassword &&
      verificationCode.length === 6 &&
      isCodeVerified &&
      email
    ) {
      const response = await handleUpdatePassword(
        email,
        verificationCode.join(""),
        newPassword
      );
      if (response) {
        setMessage({
          type: "success",
          text: "Password has been successfully reset!",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: "Failed to reset password!",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {step === "email" ? "Forgot Password?" : "Reset Password"}
          </h2>
          <p className="text-gray-600">
            {step === "email"
              ? "Enter your email address and we'll send you instructions to reset your password."
              : "Enter the verification code sent to your email and set your new password."}
          </p>
        </div>

        {message && (
          <div
            className={`rounded-md p-4 ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {step === "email" ? (
          <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846] focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#C8A846] hover:bg-[#b69339] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A846] transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  "Verify Email"
                )}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Reset Password
              </h2>
              <p className="text-gray-600">
                Enter the verification code sent to your email and set your new
                password.
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <div className="flex gap-2 justify-center mb-4">
                    {verificationCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleCodeChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`w-12 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 
                          ${
                            isCodeVerified &&
                            verificationCode.join("").length === 6
                              ? "border-green-500 bg-green-50"
                              : "border-gray-300"
                          } 
                          focus:ring-[#C8A846] focus:border-[#C8A846]`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`appearance-none relative block w-full px-3 py-3 border border-gray-300 
                        placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#C8A846] 
                        focus:border-[#C8A846] focus:z-10 sm:text-sm
                        ${!isCodeVerified && "opacity-50 cursor-not-allowed"}`}
                      placeholder="Enter new password"
                      disabled={!isCodeVerified}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`appearance-none relative block w-full px-3 py-3 border border-gray-300 
                        placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#C8A846] 
                        focus:border-[#C8A846] focus:z-10 sm:text-sm
                        ${!isCodeVerified && "opacity-50 cursor-not-allowed"}`}
                      placeholder="Confirm new password"
                      disabled={!isCodeVerified}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={!isCodeVerified}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
                      text-sm font-medium rounded-md text-white bg-[#C8A846] hover:bg-[#b69339] 
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A846] 
                      transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            </form>
          </>
        )}

        <div className="flex items-center justify-between text-sm">
          <Link
            to="/login"
            className="font-medium text-[#C8A846] hover:text-[#b69339] transition-colors duration-300"
          >
            Back to Login
          </Link>
          <Link
            to="/register"
            className="font-medium text-[#C8A846] hover:text-[#b69339] transition-colors duration-300"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Your security is important to us</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
