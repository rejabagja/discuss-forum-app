import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@states/index';

const AppProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

export default AppProvider;
