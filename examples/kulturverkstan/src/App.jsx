import { useEffect, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { getWorkshops } from './api.js';
import BookingPage from './pages/BookingPage.jsx';
import ConfirmationPage from './pages/ConfirmationPage.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import WorkshopPage from './pages/WorkshopPage.jsx';

function App() {
  const [workshops, setWorkshops] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadCount, setReloadCount] = useState(0);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWorkshops() {
      setStatus('loading');
      setErrorMessage('');

      try {
        const data = await getWorkshops(controller.signal);
        setWorkshops(data);
        setStatus('success');
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorMessage(error.message);
          setStatus('error');
        }
      }
    }

    loadWorkshops();
    return () => controller.abort();
  }, [reloadCount]);

  function retry() {
    setReloadCount((count) => count + 1);
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <NavLink className="brand" to="/">
          Kulturverkstan
        </NavLink>
        <nav aria-label="Huvudnavigation">
          <NavLink to="/">Workshops</NavLink>
        </nav>
      </header>

      <main id="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                workshops={workshops}
                status={status}
                errorMessage={errorMessage}
                onRetry={retry}
              />
            }
          />
          <Route
            path="/workshops/:workshopId"
            element={
              <WorkshopPage
                workshops={workshops}
                status={status}
                errorMessage={errorMessage}
                onRetry={retry}
              />
            }
          />
          <Route
            path="/book/:workshopId"
            element={
              <BookingPage
                workshops={workshops}
                status={status}
                errorMessage={errorMessage}
                onRetry={retry}
                onBooked={setConfirmedBooking}
              />
            }
          />
          <Route
            path="/confirm"
            element={
              <ConfirmationPage
                booking={confirmedBooking}
                workshops={workshops}
              />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer>
        <p>Kulturverkstan är ett övningsprojekt – inga riktiga bokningar görs.</p>
      </footer>
    </div>
  );
}

export default App;
