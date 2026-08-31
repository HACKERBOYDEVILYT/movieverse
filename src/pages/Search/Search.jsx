import { useSearchParams } from "react-router-dom";

export default function Search() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  return (
    <section className="page-placeholder">
      <div>
        <span className="eyebrow">SEARCH</span>
        <h1>{query ? `Results for "${query}"` : "Search"}</h1>
        <p>Search results will appear here.</p>
      </div>
    </section>
  );
}
