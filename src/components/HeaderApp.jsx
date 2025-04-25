import { useSelector } from 'react-redux';
import LoadingBar from '@components/LoadingBar';

const HeaderApp = () => {
  const authUser = useSelector(({ authUser }) => authUser.data);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="bg-accent text-accent-content px-5 lg:px-0 shadow-lg">
        <div className="navbar max-w-4xl mx-auto justify-between">
          <h1 className="font-bold text-blue-950 text-xl xs:text-2xl underline decoration-wavy decoration-secondary transition-all duration-300">
            Discuss Forum App
          </h1>
          {authUser && (
            <div className="avatar hidden xs:block">
              <div
                className="ring-accent-darker ring-offset-base-100 w-8 rounded-full ring ring-offset-2"
                title={authUser.name}
              >
                <img src={authUser.avatar} alt={authUser.name} />
              </div>
            </div>
          )}
        </div>
      </div>

      <LoadingBar />
    </header>
  );
};

export default HeaderApp;
