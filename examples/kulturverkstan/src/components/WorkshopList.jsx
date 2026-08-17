import WorkshopCard from './WorkshopCard.jsx';

function WorkshopList({ workshops }) {
  if (workshops.length === 0) {
    return <p>Det finns inga workshops att visa just nu.</p>;
  }

  return (
    <div className="workshop-grid">
      {workshops.map((workshop) => (
        <WorkshopCard key={workshop.id} workshop={workshop} />
      ))}
    </div>
  );
}

export default WorkshopList;
