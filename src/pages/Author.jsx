import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import AuthorImage from "../images/author_thumbnail.jpg";
import { fetchAuthor } from "../lib/api";

export default function Author() {
  const { id } = useParams();
  const location = useLocation();
  const passedSeller = location.state?.seller;

  const [seller, setSeller] = useState(passedSeller || null);
  const [loading, setLoading] = useState(!passedSeller);
  const [err, setErr] = useState(null);
  const [hasFollowed, setHasFollowed] = useState(false);
  const onToggleFollow = () => setHasFollowed((f) => !f);

  useEffect(() => {
    let alive = true;
    const c = new AbortController();

    const normalize = (data, fallbackId) => {
      const authorId = String(
        data?.authorId ?? data?.id ?? data?.uid ?? fallbackId
      );

      const items =
        (Array.isArray(data?.nftCollection) && data.nftCollection) ||
        (Array.isArray(data?.items) && data.items) ||
        [];

      return {
        id: authorId,
        name: String(data?.authorName ?? data?.name ?? "Unknown"),
        avatar: data?.authorImage || data?.avatar || data?.image || AuthorImage,
        username:
          data?.tag ||
          data?.authorTag ||
          data?.username ||
          data?.handle ||
          "@creator",
        wallet:
          data?.address ||
          data?.wallet ||
          data?.walletAddress ||
          data?.account ||
          "",
        followers: data?.followers ?? 573,
        items,
      };
    };

    (async () => {
      try {
        setErr(null);

        // Use passed seller when it matches the URL id
        const passedId = passedSeller
          ? String(passedSeller.id ?? passedSeller.authorId ?? passedSeller.uid)
          : null;

        if (passedSeller && passedId === String(id)) {
          if (!alive) return;
          setSeller(normalize(passedSeller, id));
          setLoading(false);
          return;
        }

        // Otherwise fetch
        setLoading(true);
        const data = await fetchAuthor(id, c.signal);
        if (!alive) return;
        setSeller(normalize(data, id));
      } catch (e) {
        if (e?.name !== "AbortError") setErr("Could not load author.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
      c.abort();
    };
  }, [id, passedSeller]);

  // ---- memoized view model for safe optional access ----
  const view = useMemo(() => {
    if (!seller) return null;
    return {
      id: seller.id,
      name: seller.name ?? "Unknown",
      avatar: seller.avatar || AuthorImage,
      username: seller.username ?? "@creator",
      wallet: seller.wallet ?? "",
      followers: seller.followers ?? 573,
      items: Array.isArray(seller.items) ? seller.items : [],
    };
  }, [seller]);

  const displayFollowers = (view?.followers ?? 0) + (hasFollowed ? 1 : 0);

  const onCopy = async () => {
    try {
      if (view?.wallet) await navigator.clipboard.writeText(view.wallet);
    } catch {}
  };

  // ---- skeleton grid (matches NewItems card sizes) ----
  const SkeletonGrid = ({ count = 8 }) => (
    <div className="nft-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="nft-card skel" key={i}>
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
      ))}
    </div>
  );

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top" />

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ background: `url(${AuthorBanner}) top` }}
        />

        <section aria-label="section">
          <div className="container">
            <div className="row">
              {/* Header */}
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      <img
                        src={view?.avatar || AuthorImage}
                        alt={view?.name || "Author"}
                        onError={(e) => (e.currentTarget.src = AuthorImage)}
                      />
                      <i className="fa fa-check" />
                      <div className="profile_name">
                        <h4>
                          {loading ? "Loading..." : view?.name}
                          {!loading && (
                            <>
                              <span className="profile_username">
                                {view?.username?.startsWith("@")
                                  ? view.username
                                  : `@${view?.username ?? ""}`}
                              </span>
                              {view?.wallet && (
                                <span id="wallet" className="profile_wallet">
                                  {view.wallet}
                                </span>
                              )}
                              <button
                                id="btn_copy"
                                title="Copy Text"
                                onClick={onCopy}
                              >
                                Copy
                              </button>
                            </>
                          )}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="profile_follower">
                        {loading ? "…" : `${displayFollowers} followers`}
                      </div>
                      <button
                        type="button"
                        className="btn-main"
                        onClick={onToggleFollow}
                        aria-pressed={hasFollowed}
                      >
                        {hasFollowed ? "Unfollow" : "Follow"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items grid */}
              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  {loading ? (
                    <SkeletonGrid count={8} />
                  ) : (
                    <AuthorItems
                      authorId={view?.id}
                      items={view?.items || []}
                      author={view}
                    />
                  )}
                </div>
              </div>

              {/* Error */}
              {!loading && !view && (
                <div className="col-md-12" style={{ color: "#e74c3c" }}>
                  {err || "Author not found."}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}