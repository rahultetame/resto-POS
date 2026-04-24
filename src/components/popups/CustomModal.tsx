import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Modal, type ModalProps } from '@mui/material';
import cls from './CustomModal.module.scss';

type CustomModalProps = Omit<ModalProps, 'children'> & {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

const CustomModal = ({ title, children, onClose, ...props }: CustomModalProps) => (
  <Modal {...props} onClose={onClose}>
    <div className={cls.modal}>
      <div className={cls.modal__header}>
        <h2 className={cls.modal__title}>{title}</h2>
        <IconButton aria-label="Close modal" onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
      {children}
    </div>
  </Modal>
);

export default CustomModal;
