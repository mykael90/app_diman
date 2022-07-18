import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';

import store, { persistor } from './store';
import RoutesPages from './routes';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router>
          <Header />
          <div style={{ minHeight: 'calc(100vh - 66px - 186px)' }}>
            <RoutesPages />
          </div>
          <Footer />
          <ToastContainer autoClose={3000} className="toast-container" />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
