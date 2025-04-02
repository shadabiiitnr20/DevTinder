import { useState } from 'react';
import { useTranslation } from 'react-i18next';
//
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const { t } = useTranslation();

  return (
    <div
      className='min-h-screen flex items-center justify-center bg-gradient-to-br
		  from-red-500 to-pink-500 p-4'
    >
      <div className='w-full max-w-md'>
        <h2 className='text-center text-3xl font-extrabold text-white mb-8'>
          {isLogin ? t('loginToAccount') : t('createAccount')}
        </h2>

        <div className='bg-white shadow-xl rounded-lg p-8'>
          {isLogin ? <LoginForm /> : <SignUpForm />}

          <div className='mt-8 text-center'>
            <p className='text-sm text-gray-600'>
              {isLogin ? 'New to DevTinder?' : 'Already have an account?'}
            </p>

            <button
              onClick={() => setIsLogin((prevIsLogin) => !prevIsLogin)}
              className='mt-2 text-red-600 hover:text-red-800 font-medium transition-colors duration-300
               hover:bg-red-100 p-2 rounded-md'
            >
              {isLogin ? 'Create a new account' : 'Sign in to your account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
