import React from "react";

const LandingIntro = () => {
  return (
    <section id="section-intro" className="no-top no-bottom">
      <div className="container">
        <div className="row">
          {/* CARD 1 */}
          <div className="col-lg-4 col-md-6 mb-sm-30">
            <div className="feature-box f-boxed style-3">
              {/* Icon */}
              <i
                className="bg-color-2 i-boxed icon_wallet"
                data-aos="fade-up"
                data-aos-delay="0"
              ></i>

              <div className="text">
                {/* Title */}
                <h4 data-aos="fade-up" data-aos-delay="50">
                  Set up your wallet
                </h4>

                {/* Text */}
                <p data-aos="fade-up" data-aos-delay="150">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem.
                </p>
              </div>

              <i className="wm icon_wallet"></i>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="col-lg-4 col-md-6 mb-sm-30">
            <div className="feature-box f-boxed style-3">
              <i
                className="bg-color-2 i-boxed icon_cloud-upload_alt"
                data-aos="fade-up"
                data-aos-delay="0"
              ></i>

              <div className="text">
                <h4 data-aos="fade-up" data-aos-delay="50">
                  Add your NFT's
                </h4>

                <p data-aos="fade-up" data-aos-delay="150">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem.
                </p>
              </div>

              <i className="wm icon_cloud-upload_alt"></i>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="col-lg-4 col-md-6 mb-sm-30">
            <div className="feature-box f-boxed style-3">
              <i
                className="bg-color-2 i-boxed icon_tags_alt"
                data-aos="fade-up"
                data-aos-delay="0"
              ></i>

              <div className="text">
                <h4 data-aos="fade-up" data-aos-delay="50">
                  Sell your NFT's
                </h4>

                <p data-aos="fade-up" data-aos-delay="150">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem.
                </p>
              </div>

              <i className="wm icon_tags_alt"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingIntro;