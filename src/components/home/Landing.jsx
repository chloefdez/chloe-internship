import React from "react";
import NFT from "../../images/nft.png";
import backgroundImage from "../../images/bg-shape-1.jpg";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <section
      id="section-hero"
      aria-label="section"
      className="no-top no-bottom vh-100"
      data-bgimage="url(images/bg-shape-1.jpg) bottom"
      style={{ background: `url(${backgroundImage}) bottom / cover` }}
    >
      <div className="v-center">
        <div className="container">
          <div className="row align-items-center">
            {/* LEFT SIDE */}
            <div className="col-md-6">
              <div className="spacer-single"></div>

              {/* Subtitle */}
              <h6 data-aos="fade-up" data-aos-delay="0">
                <span className="text-uppercase id-color-2">
                  Ultraverse Market
                </span>
              </h6>

              <div className="spacer-10"></div>

              {/* Title */}
              <h1 data-aos="fade-up" data-aos-delay="100">
                Create, sell or collect digital items.
              </h1>

              {/* Description */}
              <p className="lead" data-aos="fade-up" data-aos-delay="200">
                Unit of data stored on a digital ledger, called a blockchain,
                that certifies a digital asset to be unique and therefore not
                interchangeable
              </p>

              <div className="spacer-10"></div>

              {/* Button */}
              <Link
                className="btn-main lead"
                to="/explore"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                Explore
              </Link>

              <div className="mb-sm-30"></div>
            </div>

            {/* RIGHT SIDE IMAGE */}
            <div
              className="col-md-6 xs-hide"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <img src={NFT} className="lazy img-fluid" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;