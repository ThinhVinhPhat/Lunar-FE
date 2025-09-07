import React from 'react';
import { TextField, Box } from '@mui/material';

type CodeFormProps = {
  verificationCode: string[];
  inputRefs: React.MutableRefObject<HTMLInputElement[]>;
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
    <Box>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Verification Code
      </label>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
        {verificationCode.map((digit, index) => (
          <TextField
            key={index}
            inputRef={(el: HTMLInputElement) => (inputRefs.current[index] = el)}
            type="text"
            inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
            value={digit}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e as React.KeyboardEvent<HTMLInputElement>)}
            sx={{
              width: 50,
              height: 50,
              
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: isCodeVerified && verificationCode.join('').length === 6 ? 'green' : 'gray',
                },
                '&:hover fieldset': {
                  borderColor: isCodeVerified && verificationCode.join('').length === 6 ? 'green' : 'gray',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#C8A846', // Focus color
                },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default CodeForm;


