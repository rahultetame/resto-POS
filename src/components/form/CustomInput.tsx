import { TextField, type TextFieldProps } from '@mui/material';
import { useField } from 'formik';
import cls from './CustomInput.module.scss';

type CustomInputProps = TextFieldProps & {
  name: string;
};

const CustomInput = ({ name, className, ...props }: CustomInputProps) => {
  const [field, meta] = useField(name);
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <TextField
      {...field}
      {...props}
      className={[cls.field, className ?? ''].join(' ').trim()}
      error={hasError}
      helperText={hasError ? meta.error : props.helperText}
    />
  );
};

export default CustomInput;
