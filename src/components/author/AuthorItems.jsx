import React from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftFallback from "../../images/nftImage.jpg";

const SkeletonCard = () => (
  <div className="nft-card skel">
    <div className="nft-author">
      <div className="nft-chip">
        <div className="nft-author-avatar sk" />
        <span className="nft-verified sk" />
      </div>
    </div>
    <div className="nft-media skel-shimmer" />
    <div className="nft-info">
      <div className="skel-line w-70 skel-shimmer" />
      <div className="skel-line w-40 skel-shimmer" />
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

  // Normalize each NFT
  const safeItems = (Array.isArray(items) ? items : []).map((it, idx) => ({
    id: it.id ?? it.itemId ?? it.nftId ?? idx,
    img: it.nftImage || it.image || nftFallback,
    title: it.title || it.name || "Untitled",
    price: it.price ?? it.nftPrice ?? null,
    likes: it.likes ?? it.favorites ?? 0,
  }));

  if (loading) {
    return (
      <div className="nft-grid author-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="nft-grid">
      {safeItems.map((it, index) => (
        <div className="nft-card" key={it.id ?? index}>
          {/* Author chip (avatar + verified inside) */}
          <div className="nft-author">
            <Link
              to={`/author/${authorId}`}
              state={{ seller: author }}
              className="nft-chip"
            >
              <img
                className="nft-author-avatar"
                src={avatarSrc}
                alt={author?.name || "Author"}
                onError={(e) => (e.currentTarget.src = AuthorImage)}
              />
              <span className="nft-verified">
                <i className="fa fa-check" aria-hidden="true" />
              </span>
            </Link>
          </div>

          {/* Media */}
          <Link to="#" aria-label={it.title}>
            <div className="nft-media">
              <img
                src={it.img}
                alt={it.title}
                onError={(e) => (e.currentTarget.src = nftFallback)}
              />
            </div>
          </Link>

          {/* Info */}
          <div className="nft-info">
            <Link to="#">
              <h4 className="nft-title">{it.title}</h4>
            </Link>
            <div className="nft-meta">
              <div className="nft-price">
                {it.price != null ? `${it.price} ETH` : "-"}
              </div>
              <div className="nft-likes">
                <i className="fa fa-heart" aria-hidden="true" />{" "}
                <span>{it.likes}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}