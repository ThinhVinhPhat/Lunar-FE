import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { FiUser } from 'react-icons/fi';

type FormFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  type?: string;
  icon?: React.ReactNode;
  error?: boolean;
  helperText?: string;
};

function FormField({
  label,
  name,
  value,
  onChange,
  disabled,
  type = 'text',
  icon,
  error,
  helperText,
}: FormFieldProps) {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      type={type}
      error={error}
      helperText={helperText}
      variant="outlined"
      margin="normal"
      InputProps={{
        startAdornment: icon ? (
          <InputAdornment position="start">{icon}</InputAdornment>
        ) : (
          <InputAdornment position="start"><FiUser /></InputAdornment>
        ),
      }}
    />
  );
}

export default FormField;


