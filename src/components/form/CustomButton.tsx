import { Button, type ButtonProps } from '@mui/material';
import cls from './CustomButton.module.scss';

type CustomButtonProps = ButtonProps & {
  full?: boolean;
};

const CustomButton = ({ className, full, variant = 'contained', ...props }: CustomButtonProps) => (
  <Button
    className={[cls.button, full ? cls['button--full'] : '', className ?? ''].join(' ').trim()}
    variant={variant}
    {...props}
  />
);

export default CustomButton;
