import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import store, { persistor } from './store';
import RoutesPages from './routes';
import Header from './components/Header';
import Footer from './components/Footer';
import GlobalStyle from './styles/GlobalStyles';
import { AuthProvider } from './context/AuthProvider';

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router>
          <AuthProvider>
            <Header />
            <Container className="py-2 my-2">
              <RoutesPages />
            </Container>
            <Footer />
            <GlobalStyle />
            <ToastContainer autoClose={3000} className="toast-container" />
          </AuthProvider>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
