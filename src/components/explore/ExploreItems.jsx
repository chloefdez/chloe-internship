import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchExploreItems } from "../../lib/api";
import Countdown from "../common/Countdown";

export default function ExploreItems() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [sort, setSort] = useState("default"); 
  const [visibleCount, setVisibleCount] = useState(8); 

  useEffect(() => {
    const c = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await fetchExploreItems(c.signal); 
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e?.message || "Failed to load items");
      } finally {
        setLoading(false);
      }
    })();
    return () => c.abort();
  }, []);

  const sorted = useMemo(() => {
    const list = [...items];
    switch (sort) {
      case "price-asc":
        list.sort(
          (a, b) => (a?.price ?? a?.eth ?? 0) - (b?.price ?? b?.eth ?? 0)
        );
        break;
      case "price-desc":
        list.sort(
          (a, b) => (b?.price ?? b?.eth ?? 0) - (a?.price ?? a?.eth ?? 0)
        );
        break;
      case "likes-desc":
        list.sort((a, b) => (b?.likes ?? 0) - (a?.likes ?? 0));
        break;
      case "ending-soon": {
        const end = (x) =>
          Date.parse(
            x?.ending ?? x?.expiry ?? x?.expiryDate ?? x?.endingAt ?? 0
          ) || Number.MAX_SAFE_INTEGER;
        list.sort((a, b) => end(a) - end(b));
        break;
      }
      default:
        break;
    }
    return list;
  }, [items, sort]);

  const visible = useMemo(
    () => sorted.slice(0, Math.min(visibleCount, sorted.length)),
    [sorted, visibleCount]
  );

  const loadMore = () => setVisibleCount((n) => n + 4);

  if (loading) {
    return (
      <>
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={`sk-${i}`}>
            <div className="nft__item">
              <div className="author_list_pp">
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#eee",
                  }}
                />
              </div>
              <div className="nft__item_wrap">
                <div style={{ height: 260, background: "#f2f2f2" }} />
              </div>
              <div className="nft__item_info">
                <div
                  style={{
                    height: 18,
                    background: "#eee",
                    width: "70%",
                    marginBottom: 8,
                  }}
                />
                <div style={{ height: 14, background: "#eee", width: 80 }} />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (err) {
    return (
      <div className="col-md-12" style={{ color: "#e74c3c" }}>
        {err}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="col-md-12" style={{ opacity: 0.7 }}>
        No items found.
      </div>
    );
  }

  return (
    <>
      <div className="col-md-12" style={{ marginBottom: 20 }}>
        <select
          className="form-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ maxWidth: 200 }}
        >
          <option value="default">Default</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="likes-desc">Most liked</option>
          <option value="ending-soon">Ending soon</option>
        </select>
      </div>

      {visible.map((it, i) => {
        const id = String(it?.nftId ?? it?.id ?? i);
        const img = it?.nftImage || it?.image;
        const title = it?.title || it?.name || "Untitled";
        const price = it?.price ?? it?.eth ?? "—";
        const likes = it?.likes ?? 0;
        const authorId = it?.authorId ?? it?.author?.id ?? "";
        const authorAvatar = it?.authorImage || it?.author?.avatar;
        const endAt =
          it?.ending ?? it?.expiry ?? it?.expiryDate ?? it?.endingAt ?? null;

        return (
          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={id}>
            <div className="nft__item">
              {endAt ? <Countdown end={endAt} /> : null}

              <div
                className="author_list_pp"
                onClick={() => navigate(`/author/${authorId}`)}
              >
                <Link
                  to={`/author/${authorId}`}
                  onClick={(e) => e.preventDefault()}
                >
                  {authorAvatar ? (
                    <img className="lazy" src={authorAvatar} alt={title} />
                  ) : (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "#eee",
                      }}
                    />
                  )}
                  <i className="fa fa-check" />
                </Link>
              </div>

              <div
                className="nft__item_wrap"
                onClick={() => navigate(`/item-details/${id}`)}
              >
                <Link
                  to={`/item-details/${id}`}
                  onClick={(e) => e.preventDefault()}
                >
                  {img ? (
                    <img src={img} className="lazy img-fluid" alt={title} />
                  ) : (
                    <div style={{ height: 260, background: "#f2f2f2" }} />
                  )}
                </Link>
              </div>

              <div className="nft__item_info">
                <Link
                  to={`/item-details/${id}`}
                  onClick={(e) => e.preventDefault()}
                >
                  <h4>{title}</h4>
                </Link>
                <div className="nft__item_price">{price} ETH</div>
                <div className="nft__item_like">
                  <i className="fa fa-heart" />
                  <span>{likes}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {visibleCount < sorted.length && (
        <div
          className="col-md-12"
          style={{ textAlign: "center", marginTop: 24 }}
        >
          <button className="btn-main" onClick={loadMore}>
            Load more
          </button>
        </div>
      )}
    </>
  );
}