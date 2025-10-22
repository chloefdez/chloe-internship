// src/components/author/AuthorItems.jsx
import React from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftFallback from "../../images/nftImage.jpg";

// Skeleton that matches NewItems skeleton blocks
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

  const safeItems = (Array.isArray(items) ? items : []).map((it, idx) => ({
    id: it.id ?? it.itemId ?? it.nftId ?? idx,
    img: it.nftImage || it.image || nftFallback,
    title: it.title || it.name || "Untitled",
    price: it.price ?? it.nftPrice ?? null,
    likes: it.likes ?? it.favorites ?? 0,
  }));

  if (loading) {
    return (
      <div className="author-grid newitems-look">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="author-grid newitems-look">
      {safeItems.map((it, index) => {
        const id = it.id ?? index;

        return (
          <div key={id} className="nft__item">
            {/* avatar chip identical to NewItems */}
            <div className="author_list_pp">
              <Link to={`/author/${authorId || ""}`} title={`Creator`}>
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

            {/* hover extras kept for parity (uses your existing CSS) */}
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