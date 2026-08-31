import { useParams } from "react-router-dom";

export default function Details() {
  const { id } = useParams();

  return (
    <section className="page-placeholder">
      <div>
        <span className="eyebrow">DETAILS</span>
        <h1>Movie / Series Details</h1>
        <p>Content ID: {id}</p>
      </div>
    </section>
  );
}
