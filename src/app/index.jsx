import AppRoutes from '@routes';
import LayoutApp from '@layouts/App';
import PreloadDataProvider from '@components/PreloadDataProvider';

function App() {
  return (
    <PreloadDataProvider>
      <LayoutApp>
        <AppRoutes />
      </LayoutApp>
    </PreloadDataProvider>
  );
}

export default App;
