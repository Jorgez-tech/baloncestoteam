export default function Nosotros() {
  const handleSubmitNoop = (e) => e && e.preventDefault();
  return (
    <>
      {/* end header section */}
      {/* about section */}
      <section className="about_section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 col-md-5 offset-md-1">
              <div className="detail-box">
                <h2>About Us</h2>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus hic, dolore error nulla similique cum minima rem, distinctio animi architecto inventore temporibus consequuntur quibusdam modi atque est fuga dicta quae!
                </p>
                <div>
                  <a href="#">Buy Now</a>
                </div>
              </div>
            </div>
            <div className="col-lg-7 col-md-5">
              <div className="img-box">
                <img src="/images/about-img.jpg" alt="about" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* info section */}
      <section className="info_section layout_padding2">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="logo_detail">
                <div className="logo-box">
                  <a className="navbar-brand" href="/">
                    <span>Sportpar</span>
                  </a>
                </div>
                <p>
                  There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or
                </p>
              </div>
            </div>
            <div className="col-md-4 col-lg-3 mx-auto">
              <div className="address_box">
                <h5>Adderess</h5>
                <a href="#"><i className="fa fa-map-marker" aria-hidden="true" />passages of Lorem Ipsum available, but the majority have</a>
                <a href="#"><i className="fa fa-phone" aria-hidden="true" />(+71) 1234567890</a>
                <a href="#"><i className="fa fa-envelope" aria-hidden="true" />demo@gmail.com</a>
              </div>
            </div>
            <div className="col-md-3">
              <div className="info_form">
                <h5>Newsletter</h5>
                <form onSubmit={handleSubmitNoop}>
                  <input type="text" placeholder="Enter Your Email" />
                  <button type="submit">Subscribe</button>
                </form>
              </div>
              <div className="social_box">
                <a href="#"><i className="fa fa-facebook" aria-hidden="true" /></a>
                <a href="#"><i className="fa fa-twitter" aria-hidden="true" /></a>
                <a href="#"><i className="fa fa-linkedin" aria-hidden="true" /></a>
                <a href="#"><i className="fa fa-instagram" aria-hidden="true" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* footer section */}
      <footer className="footer_section">
        <div className="container-fluid">
          <p>© 2021 All Rights Reserved By <a href="https://html.design/">Free Html Templates</a></p>
        </div>
      </footer>
    </>
  );
}