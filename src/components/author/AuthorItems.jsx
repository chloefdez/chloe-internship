import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftFallback from "../../images/nftImage.jpg";
import { fetchAuthorItems } from "../../lib/api";

const SkeletonCard = () => (
  <div className="nft__item">
    <div className="author_list_pp">
      <span>
        <div className="sk sk-avatar" />
      </span>
    </div>

    <div className="nft__item_wrap">
      <div className="sk sk-img" />
    </div>

    <div className="nft__item_info">
      <div className="sk sk-title" />
      <div className="sk sk-sub" />
    </div>
  </div>
);

export default function AuthorItems({
  authorId,
  items = [],
  author,
  loading = false,
}) {
  const avatarSrc = author?.avatar || AuthorImage;

  const [remote, setRemote] = useState([]);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [remoteErr, setRemoteErr] = useState(null);

  useEffect(() => {
    if (!authorId) return;

    if (Array.isArray(items) && items.length > 0) {
      setRemote([]);
      setRemoteErr(null);
      setRemoteLoading(false);
      return;
    }

    const c = new AbortController();
    (async () => {
      try {
        setRemoteLoading(true);
        setRemoteErr(null);
        const d = await fetchAuthorItems(authorId, c.signal);
        setRemote(Array.isArray(d) ? d : []);
      } catch (e) {
        if (e?.name !== "AbortError") setRemoteErr("Failed to load items.");
      } finally {
        setRemoteLoading(false);
      }
    })();

    return () => c.abort();
  }, [authorId, items]);

    const fix = (u) => {
      if (!u) return null;
      if (typeof u !== "string") return null;
      if (u.startsWith("http://") || u.startsWith("https://")) return u;
      return null;
    };

  const source = Array.isArray(items) && items.length > 0 ? items : remote;

  const safeItems = useMemo(
    () =>
      (Array.isArray(source) ? source : []).map((it, idx) => ({
        id: it.tokenId ?? it.nftId ?? it.id ?? it.itemId ?? it.item_id ?? null,
        img: fix(it.nftImage) || fix(it.image) || nftFallback,
        title: it.title || it.name || "Untitled",
        price: it.price ?? it.nftPrice ?? null,
        likes: it.likes ?? it.favorites ?? 0,
      })),
    [source]
  );

  const isLoading = loading || remoteLoading;

  if (isLoading) {
    return (
      <div className="author-grid newitems-look">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (remoteErr) {
    return (
      <div className="author-grid newitems-look" style={{ color: "#e74c3c" }}>
        {remoteErr}
      </div>
    );
  }

  if (!safeItems.length) {
    return (
      <div className="author-grid newitems-look" style={{ opacity: 0.75 }}>
        No items for this author yet.
      </div>
    );
  }

  return (
    <div className="author-grid newitems-look">
      {safeItems.map((it) => {
        const id = it.id;

        return (
          <div key={id} className="nft__item">
            <div className="author_list_pp">
              <Link to={`/author/${authorId || ""}`} title="Creator">
                <img
                  className="lazy"
                  src={avatarSrc}
                  alt={author?.name || "Author"}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = AuthorImage)}
                />
                <i className="fa fa-check" />
              </Link>
            </div>

            <div className="nft__item_wrap">
              <div className="nft__item_extra">
                <div className="nft__item_buttons">
                  <button>Buy Now</button>
                  <div className="nft__item_share">
                    <h4>Share</h4>
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      <i className="fa fa-facebook fa-lg" />
                    </a>
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      <i className="fa fa-twitter fa-lg" />
                    </a>
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      <i className="fa fa-envelope fa-lg" />
                    </a>
                  </div>
                </div>
              </div>

              <Link to={`/item-details/${id}`}>
                <img
                  src={it.img}
                  className="lazy nft__item_preview"
                  alt={it.title}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = nftFallback)}
                />
              </Link>
            </div>

            <div className="nft__item_info">
              <Link to={`/item-details/${id}`}>
                <h4>{it.title}</h4>
              </Link>
              <div className="nft__item_price">
                {it.price != null ? `${it.price} ETH` : ""}
              </div>
              <div className="nft__item_like">
                <i className="fa fa-heart" />
                <span>{it.likes}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}