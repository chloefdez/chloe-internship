import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import AuthorImage from "../images/author_thumbnail.jpg";
import { fetchAuthor } from "../lib/api";

export default function Author() {
  const { id: authorId } = useParams();
  const location = useLocation();
  const passedSeller = location.state?.seller || null;

  const [seller, setSeller] = useState(passedSeller || null);
  const [loading, setLoading] = useState(!passedSeller);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (passedSeller) return;

    let alive = true;
    const c = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await fetchAuthor(authorId, c.signal);
        if (!alive) return;
        setSeller(data?.author ?? data ?? null);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load author");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
      c.abort();
    };
  }, [authorId, passedSeller]);

  const view = useMemo(() => {
    if (!seller) return null;
    return {
      id: seller.id,
      name: seller.name ?? "Unknown",
      avatar: seller.avatar || AuthorImage,
      username: seller.username ?? "@creator",
      wallet:
        seller.wallet ??
        "UDHUHWudhwd78wdt7edb32uidbwyuidhg7wUHIFUHWewiqdj87dy7",
      followers: seller.followers ?? 573,
    };
  }, [seller]);

  const onCopy = async () => {
    try {
      if (view?.wallet) await navigator.clipboard.writeText(view.wallet);
    } catch {}
  };

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

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
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      <img
                        src={view?.avatar || AuthorImage}
                        alt={view?.name || "Author"}
                        onError={(e) => (e.currentTarget.src = AuthorImage)}
                      />
                      <i className="fa fa-check"></i>

                      <div className="profile_name">
                        <h4>
                          {loading ? "Loading..." : view?.name}
                          {!loading && view && (
                            <>
                              <span className="profile_username">
                                {view.username}
                              </span>
                              <span id="wallet" className="profile_wallet">
                                {view.wallet}
                              </span>
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
                        {loading ? "…" : `${view?.followers ?? 0} followers`}
                      </div>
                      <Link to="#" className="btn-main">
                        Follow
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems authorId={authorId} />
                </div>
              </div>

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