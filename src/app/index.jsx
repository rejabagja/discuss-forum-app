import AppRoutes from '@routes';
import LayoutApp from '@layouts/App';
import PreloadDataProvider from '@components/PreloadDataProvider';

function App() {
  return (
    <LayoutApp>
      <PreloadDataProvider>
        <AppRoutes />
      </PreloadDataProvider>
    </LayoutApp>
  );
}

export default App;
