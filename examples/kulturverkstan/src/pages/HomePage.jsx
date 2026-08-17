import WorkshopList from '../components/WorkshopList.jsx';

function HomePage({ workshops, status, errorMessage, onRetry }) {
  if (status === 'loading') return <p className="notice">Laddar workshops…</p>;

  if (status === 'error') {
    return (
      <section className="notice" role="alert">
        <h1>Något gick fel</h1>
        <p>{errorMessage}</p>
        <button onClick={onRetry}>Försök igen</button>
      </section>
    );
  }

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Skapa tillsammans</p>
        <h1>Hitta din nästa workshop</h1>
        <p>Välj en aktivitet, ett tillfälle och boka din plats.</p>
      </section>
      <WorkshopList workshops={workshops} />
    </>
  );
}

export default HomePage;
