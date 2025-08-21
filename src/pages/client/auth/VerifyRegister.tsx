import { AuthProps, isAlreadyLoginAuth } from "@/components/wrapper/withAuth";
import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CodeForm from "@/components/ui/CodeForm";
import { useVerifyRegister } from "@/lib/hooks/queryClient/mutator/auth/auth.mutator";

const VerifyRegister: React.FC<AuthProps> = () => {
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
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const navigate = useNavigate();
  const email = useParams();
  const { mutateAsync: verifyRegister, isPending: isPendingVerifyRegister } =
    useVerifyRegister();

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
          text: "Code verified successfully!",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCodeVerified) {
      setMessage({
        type: "error",
        text: "Please enter a valid code!",
      });
      return;
    }

    await verifyRegister({
      email: email.email as string,
      code: verificationCode.join(""),
    });

      setMessage({
        type: "success",
        text: "Registration verified successfully!",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Registration
          </h2>
          <p className="text-gray-600">
            Enter the verification code sent to your email to complete your
            registration.
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

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <CodeForm
            verificationCode={verificationCode}
            inputRefs={inputRefs}
            handleCodeChange={handleCodeChange}
            handleKeyDown={handleKeyDown}
            isCodeVerified={isCodeVerified}
          />

          <div>
            <button
              type="submit"
              disabled={!isCodeVerified}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
                text-sm font-medium rounded-md text-white bg-[#C8A846] hover:bg-[#b69339] 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A846] 
                transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isPendingVerifyRegister ? "Verifying..." : "Verify Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const VerifyRegisterWrapper = isAlreadyLoginAuth(VerifyRegister);
export default VerifyRegisterWrapper;
