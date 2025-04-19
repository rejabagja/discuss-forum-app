import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@states/index';
import PropTypes from 'prop-types';

const AppProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node,
};

export default AppProvider;
