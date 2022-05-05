import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';

import store, { persistor } from './store';
import RoutesPages from './routes';
import Header from './components/Header';
import GlobalStyle, { Container } from './styles/GlobalStyles';
import { AuthProvider } from './context/AuthProvider';

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router>
          <AuthProvider>
            <Header />
            <Container>
              <RoutesPages />
            </Container>
            <GlobalStyle />
            <ToastContainer autoClose={3000} className="toast-container" />
          </AuthProvider>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
