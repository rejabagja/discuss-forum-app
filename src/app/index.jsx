import AppRoutes from '@routes';
import LayoutApp from '@layouts/App';
import AuthProvider from '@components/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <LayoutApp>
        <AppRoutes />
      </LayoutApp>
    </AuthProvider>
  );
}

export default App;
