export default function Jugadores() {
  const handleSubmitNoop = (e) => e.preventDefault();

  return (
    <>
      <div className="hero_area">
        {/* header section starts */}
        <header className="header_section">
          <div className="container-fluid">
            <nav className="navbar navbar-expand-lg custom_nav-container ">
              <a className="navbar-brand" href="/">
                <span>Sportpar</span>
              </a>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
              </button>

              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <div className="d-flex ml-auto flex-column flex-lg-row align-items-center">
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/about">About</a>
                    </li>
                    <li className="nav-item active">
                      <a className="nav-link" href="/products">Products</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/contact">Contact us</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">Login</a>
                    </li>
                  </ul>
                  <div className="quote_btn-container">
                    <a href="#" className="cart_link">
                      <i className="fa fa-cart-arrow-down" aria-hidden="true" />
                      <span className="cart_number">0</span>
                    </a>
                    <form className="form-inline" onSubmit={handleSubmitNoop}>
                      <button className="btn nav_search-btn" type="submit"><i className="fa fa-search" aria-hidden="true" /></button>
                    </form>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </header>
        {/* end header section */}
      </div>

      {/* product section */}
      <section className="product_section layout_padding">
        <div className="container">
          <div className="heading_container heading_center">
            <h2>Our Products</h2>
          </div>
          <div className="row">
            {Array.from({ length: 9 }).map((_, idx) => (
              <div className="col-sm-6 col-lg-4" key={idx}>
                <div className="box">
                  <div className="img-box">
                    <img src={`/images/p${idx + 1}.png`} alt={`product ${idx + 1}`} />
                  </div>
                  <div className="detail-box">
                    <div className="text">
                      <a href="#" className="p_name">Sport Product</a>
                      <h5><span>$</span> 300</h5>
                    </div>
                    <div className="like">
                      <h6>Rating</h6>
                      <div className="star_container">
                        <i className="fa fa-star" aria-hidden="true" />
                        <i className="fa fa-star" aria-hidden="true" />
                        <i className="fa fa-star" aria-hidden="true" />
                        <i className="fa fa-star" aria-hidden="true" />
                        <i className="fa fa-star" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="btn-box"><a href="#">View All</a></div>
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
                <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or</p>
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