import { Form, Formik } from 'formik';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { CustomButton, CustomInput } from '../../components/form';
import { authService } from '../../services/authService';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setToken } from '../../store/slices/loginSlice';
import { PATH } from '../../routes/path';
import cls from './AuthForms.module.scss';

type LocationState = {
  from?: {
    pathname?: string;
  };
};

const schema = Yup.object({
  email: Yup.string().email('Use a valid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const state = location.state as LocationState | null;

  return (
    <section className={cls['auth-card']}>
      <div className={cls['auth-card__header']}>
        <h2 className={cls['auth-card__title']}>Welcome back</h2>
        <p className={cls['auth-card__copy']}>Sign in to open the live restaurant console.</p>
      </div>
      <Formik
        initialValues={{ email: 'manager@restaurant.com', password: 'secret123' }}
        validationSchema={schema}
        onSubmit={async (values, helpers) => {
          try {
            const response = await authService.login(values);
            dispatch(setToken(response));
            enqueueSnackbar('Logged in successfully', { variant: 'success' });
            navigate(state?.from?.pathname ?? PATH.DASHBOARD, { replace: true });
          } catch {
            enqueueSnackbar('Unable to login', { variant: 'error' });
          } finally {
            helpers.setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className={cls['auth-card__form']}>
            <CustomInput label="Email" name="email" type="email" />
            <CustomInput label="Password" name="password" type="password" />
            <CustomButton full disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </CustomButton>
          </Form>
        )}
      </Formik>
      <p className={cls['auth-card__footer']}>
        New team member?{' '}
        <Link className={cls['auth-card__link']} to={PATH.REGISTER}>
          Create account
        </Link>
      </p>
    </section>
  );
};

export default Login;
