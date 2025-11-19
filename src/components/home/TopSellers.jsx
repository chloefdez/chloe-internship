import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTopSellers } from "../../lib/api";
import AuthorImage from "../../images/author_thumbnail.jpg";

const TopSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

useEffect(() => {
  const c = new AbortController();
  let alive = true;

  (async () => {
    try {
      setLoading(true);
      setErr(null);

      const data = await fetchTopSellers(c.signal);

      // Debug once so we can see the exact keys coming back
      if (Array.isArray(data)) {
        console.log("[TopSellers] sample", data.slice(0, 3));
      }

      const normalized = (Array.isArray(data) ? data : []).map((x) => {
        // Only use ids that are meant to identify the author in the authors endpoint
        const authorId =
          x.authorId ?? // ← most common
          x.profileId ?? 
          x.userId ??
          x.uid ?? 
          null;

        return {
          id: authorId ? String(authorId) : null,
          name: String(x.authorName ?? x.name ?? "Unknown"),
          avatar: x.authorImage || x.avatar || x.image || AuthorImage,
          priceEth:
            x.priceEth != null
              ? Number(x.priceEth)
              : x.price != null
              ? Number(x.price)
              : Number(x.eth ?? 0),
        };
      });

      if (!alive) return;
      setSellers(normalized.slice(0, 12));
    } catch (e) {
      if (e?.name !== "AbortError") setErr("Could not load top sellers.");
    } finally {
      if (alive) setLoading(false);
    }
  })();

  return () => {
    alive = false;
    c.abort();
  };
}, []);


  return (
    <section id="section-popular" className="pb-5">
      <div
        className="container"
        data-aos="fade-up"
        data-aos-delay="0"
        data-aos-duration="900"
        data-aos-easing="ease-out-cubic"
        data-aos-offset="120"
      >
        {" "}
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          <div className="col-md-12">
            <ol
              className={`author_list ${loading ? "loading" : ""}`}
              aria-busy={loading ? "true" : "false"}
              aria-live="polite"
            >
              {loading &&
                Array.from({ length: 12 }).map((_, i) => (
                  <li key={i}>
                    <div className="ts-skel">
                      <span className="ts-num">{i + 1}.</span>
                      <div className="ts-avatar-wrap">
                        <div className="sk ts-avatar" />
                        <i
                          className="fa fa-check ts-badge"
                          aria-hidden="true"
                        ></i>
                      </div>
                      <div className="ts-text">
                        <div className="sk ts-line ts-w-28" />
                        <div className="sk ts-line ts-w-16" />
                      </div>
                    </div>
                  </li>
                ))}

              {!loading && err && (
                <li
                  className="text-center text-danger"
                  style={{ listStyle: "none" }}
                >
                  {err}
                </li>
              )}

              {!loading &&
                !err &&
                sellers.map((s, idx) => {
                  const hasId = Boolean(s.id);
                  const to = hasId
                    ? `/author/${encodeURIComponent(s.id)}`
                    : "#";

                  return (
                    <li key={s.id ?? `noid-${idx}`}>
                      <div className="author_list_pp">
                        <Link
                          to={to}
                          state={hasId ? { seller: s } : undefined}
                          onClick={(e) => {
                            if (!hasId) e.preventDefault();
                          }}
                          title={hasId ? s.name : "No author id available"}
                        >
                          <img
                            className="lazy pp-author"
                            src={s.avatar || AuthorImage}
                            alt={s.name}
                            onError={(e) => (e.currentTarget.src = AuthorImage)}
                          />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>

                      <div className="author_list_info">
                        <Link
                          to={to}
                          state={hasId ? { seller: s } : undefined}
                          onClick={(e) => {
                            if (!hasId) e.preventDefault();
                          }}
                        >
                          {s.name}
                        </Link>
                        <span>
                          {Number.isFinite(s.priceEth)
                            ? `${s.priceEth} ETH`
                            : "—"}
                        </span>
                      </div>
                    </li>
                  );
                })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;