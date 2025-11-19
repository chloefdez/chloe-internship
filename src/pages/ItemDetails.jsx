import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import EthImage from "../images/ethereum.svg";
import AuthorImage from "../images/author_thumbnail.jpg";
import nftImage from "../images/nftImage.jpg";
import { fetchItemDetails } from "../lib/api";

function SkeletonItemDetails() {
  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              {/* LEFT — image skeleton */}
              <div className="col-md-6 text-center">
                <div
                  className="sk sk-img"
                  style={{
                    width: "100%",
                    height: 500,
                    borderRadius: 12,
                    marginBottom: "30px",
                  }}
                />
              </div>

              {/* RIGHT — text skeletons */}
              <div className="col-md-6">
                <div className="item_info">
                  {/* title */}
                  <div
                    className="sk sk-title"
                    style={{ width: 260, height: 32, marginBottom: 20 }}
                  />

                  {/* counts */}
                  <div
                    style={{
                      display: "flex",
                      gap: 20,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      className="sk sk-sub"
                      style={{ width: 80, height: 20 }}
                    />
                    <div
                      className="sk sk-sub"
                      style={{ width: 80, height: 20 }}
                    />
                  </div>

                  {/* description */}
                  <div
                    className="sk sk-title"
                    style={{ width: "80%", height: 18, marginBottom: 10 }}
                  />
                  <div
                    className="sk sk-title"
                    style={{ width: "70%", height: 18, marginBottom: 30 }}
                  />

                  {/* Owner */}
                  <h6>Owner</h6>
                  <div
                    className="item_author"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      marginBottom: 25,
                    }}
                  >
                    <div
                      className="sk sk-avatar"
                      style={{ width: 50, height: 50 }}
                    />
                    <div
                      className="sk sk-sub"
                      style={{ width: 120, height: 18 }}
                    />
                  </div>

                  {/* Creator */}
                  <h6>Creator</h6>
                  <div
                    className="item_author"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      marginBottom: 30,
                    }}
                  >
                    <div
                      className="sk sk-avatar"
                      style={{ width: 50, height: 50 }}
                    />
                    <div
                      className="sk sk-sub"
                      style={{ width: 120, height: 18 }}
                    />
                  </div>

                  {/* Price */}
                  <h6>Price</h6>
                  <div
                    className="nft-item-price"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      className="sk sk-sub"
                      style={{ width: 100, height: 24 }}
                    />
                  </div>
                </div>
              </div>
              {/* /RIGHT */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


export default function ItemDetails() {
  const { id: nftId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // scroll to top when id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [nftId]);

  useEffect(() => {
    if (!nftId) return;
    const c = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const d = await fetchItemDetails(nftId, c.signal);
        console.log("✨ ITEM DETAILS RESPONSE:", d);
        setData(d || null);
      } catch (e) {
        if (e?.name !== "AbortError") setErr("Failed to load item.");
      } finally {
        setLoading(false);
      }
    })();

    return () => c.abort();
  }, [nftId]);

  const view = useMemo(() => {
    if (!data) return null;

    const asObj = (val) =>
      typeof val === "string" ? { name: val } : val || {};

    const owner = asObj(data.owner ?? data.currentOwner ?? data.ownerInfo);
    const creator = asObj(data.creator ?? data.author ?? data.creatorInfo);

    const fix = (u) => {
      if (!u) return null;
      if (typeof u !== "string") return null;
      if (u.startsWith("http://") || u.startsWith("https://")) return u;
      return null;
    };

    return {
      title: data.title ?? data.name ?? `#${nftId}`,
      tag:
        data.tag ?? data.itemTag ?? data.category ?? data.collectionTag ?? null,

      desc: data.description ?? data.desc ?? "",
      img: fix(data.nftImage) || fix(data.image) || fix(data.img) || nftImage,
      views: data.views ?? data.watchers ?? 0,
      likes: data.likes ?? data.favs ?? 0,
      price: data.price ?? data.priceEth ?? data.listPrice ?? null,

      owner: {
        id: owner.id ?? owner.authorId ?? data.ownerId ?? data.ownerID ?? "",
        name:
          owner.name ?? owner.username ?? data.ownerName ?? data.owner ?? "—",
        avatar:
          owner.avatar ??
          owner.image ??
          data.ownerAvatar ??
          data.ownerImage ??
          AuthorImage,
      },
      creator: {
        id:
          creator.id ??
          creator.authorId ??
          data.creatorId ??
          data.creatorID ??
          "",
        name:
          creator.name ??
          creator.username ??
          data.creatorName ??
          data.creator ??
          "—",
        avatar:
          creator.avatar ??
          creator.image ??
          data.creatorAvatar ??
          data.creatorImage ??
          AuthorImage,
      },
    };
  }, [data, nftId]);

  if (loading || !view) {
    return <SkeletonItemDetails />;    
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top" />
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                <img
                  src={view?.img || nftImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={view?.title || ""}
                  onError={(e) => (e.currentTarget.src = nftImage)}
                />
              </div>

              <div className="col-md-6">
                <div className="item_info">
                  {/* Title + inline tag */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <h2 style={{ margin: 0 }}>
                      {loading ? "Loading…" : view?.title}
                    </h2>

                    {!loading && view?.tag ? (
                      <span
                        className="item_inline_tag"
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          borderRadius: 999,
                          fontSize: 14,
                          lineHeight: 1,
                          background: "#f3f3f6",
                          color: "#52525b",
                        }}
                      >
                        {String(view.tag).startsWith("#")
                          ? view.tag
                          : `#${view.tag}`}
                      </span>
                    ) : null}
                  </div>

                  {/* counts under the title */}
                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye" />
                      {loading ? "…" : view?.views ?? 0}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart" />
                      {loading ? "…" : view?.likes ?? 0}
                    </div>
                  </div>

                  <p>{loading ? "" : view?.desc}</p>

                  {/* Owner */}
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${view?.owner?.id || ""}`}>
                            <img
                              className="lazy"
                              src={view?.owner?.avatar || AuthorImage}
                              alt={view?.owner?.name || "Owner"}
                              onError={(e) =>
                                (e.currentTarget.src = AuthorImage)
                              }
                            />
                            <i className="fa fa-check" />
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${view?.owner?.id || ""}`}>
                            {view?.owner?.name || "—"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Creator + Price */}
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${view?.creator?.id || ""}`}>
                            <img
                              className="lazy"
                              src={view?.creator?.avatar || AuthorImage}
                              alt={view?.creator?.name || "Creator"}
                              onError={(e) =>
                                (e.currentTarget.src = AuthorImage)
                              }
                            />
                            <i className="fa fa-check" />
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${view?.creator?.id || ""}`}>
                            {view?.creator?.name || "—"}
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="spacer-40" />

                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="ETH" />
                      <span>{loading ? "" : view?.price ?? ""}</span>
                    </div>

                    {!loading && err ? (
                      <div style={{ color: "#e74c3c", marginTop: 12 }}>
                        {err}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}