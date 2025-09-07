type CodeFormProps = {
  verificationCode: string[];
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  handleCodeChange: (index: number, value: string) => void;
  handleKeyDown: (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => void;
  isCodeVerified: boolean;
};

function CodeForm({
  verificationCode,
  inputRefs,
  handleCodeChange,
  handleKeyDown,
  isCodeVerified,
}: CodeFormProps) {
  return (
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
            onChange={(e) => handleCodeChange(index, e.target.value)}
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
  );
}

export default CodeForm;
