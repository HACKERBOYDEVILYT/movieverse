import { useParams } from "react-router-dom";

export default function Watch() {
  const { id } = useParams();

  return (
    <section className="page-placeholder">
      <div>
        <span className="eyebrow">WATCH</span>
        <h1>Video Player</h1>
        <p>Player ID: {id}</p>
      </div>
    </section>
  );
}
