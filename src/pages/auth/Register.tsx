import { Form, Formik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { CustomButton, CustomInput } from '../../components/form';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setToken } from '../../store/slices/loginSlice';
import { PATH } from '../../routes/path';
import cls from './AuthForms.module.scss';

const schema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Use a valid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <section className={cls['auth-card']}>
      <div className={cls['auth-card__header']}>
        <h2 className={cls['auth-card__title']}>Create account</h2>
        <p className={cls['auth-card__copy']}>Set up access for your restaurant team.</p>
      </div>
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={schema}
        onSubmit={(values) => {
          dispatch(
            setToken({
              token: crypto.randomUUID(),
              userDetails: {
                id: crypto.randomUUID(),
                name: values.name,
                email: values.email,
                role: 'Owner',
              },
            }),
          );
          enqueueSnackbar('Account created', { variant: 'success' });
          navigate(PATH.DASHBOARD, { replace: true });
        }}
      >
        {({ isSubmitting }) => (
          <Form className={cls['auth-card__form']}>
            <CustomInput label="Full name" name="name" />
            <CustomInput label="Email" name="email" type="email" />
            <CustomInput label="Password" name="password" type="password" />
            <CustomButton full disabled={isSubmitting} type="submit">
              Create account
            </CustomButton>
          </Form>
        )}
      </Formik>
      <p className={cls['auth-card__footer']}>
        Already registered?{' '}
        <Link className={cls['auth-card__link']} to={PATH.LOGIN}>
          Sign in
        </Link>
      </p>
    </section>
  );
};

export default Register;
