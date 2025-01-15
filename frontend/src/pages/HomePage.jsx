import { useAuthStore } from '../store/useAuthStore';

const HomePage = () => {
  const { logout } = useAuthStore();

  return (
    <div className='flex gap-4'>
      HomePage
      <button className='bg-slate-200' onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default HomePage;
