import { Link } from "react-router-dom";
import Header from "./Header";

export default function Home() {
  // This component is a JSX conversion of the original home HTML page.
  // It omits <html>, <head>, <body> and external <link>/<meta> tags.
  // Keep meta/link tags in public/index.html or the app root.

  const handleSubmitNoop = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="hero_area">
        {/* header section starts */}
        <Header />
        {/* end header section */}

        {/* slider section */}
        <section className="slider_section position-relative">
          <ol className="carousel-indicators indicator-2">
            <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active indicator-li-1">01</li>
            <li data-target="#carouselExampleIndicators" data-slide-to="1">02</li>
            <li data-target="#carouselExampleIndicators" data-slide-to="2">03</li>
          </ol>
          <div className="container-fluid h-100">
            <div className="row">
              <div className="col-md-5 col-xl-4 offset-xl-1">
                <div className="detail-box">
                  <h1>
                    Baloncesto Team <br />
                    Donde tus Sueños Comienzan!
                  </h1>
                  <p>Se Parte de Esta Gran Familia.</p>
                  <div className="btn-box">
                    <Link to="/nosotros" className="btn-1">Nosotros</Link>
                    <Link to="/jugadores" className="btn-2">Jugadores</Link>
                  </div>
                </div>
              </div>
              <div className="col-md-7 px-0 h-100">
                <div className="img_container h-100">
                  <div id="carouselExampleIndicators" className="carousel slide carousel-fade" data-ride="carousel">
                    <ol className="carousel-indicators indicator-1">
                      <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active indicator-li-1" />
                      <li data-target="#carouselExampleIndicators" data-slide-to="1" />
                      <li data-target="#carouselExampleIndicators" data-slide-to="2" />
                    </ol>
                    <div className="carousel-inner">
                      <div className="carousel-item active">
                        <div className="img-box">
                          <img src="/images/slider-img2.jpg" alt="imagen principal." />
                        </div>
                      </div>
                      <div className="carousel-item">
                        <div className="img-box">
                          <img src="/images/slider-img2.jpg" alt="slide 2" />
                        </div>
                      </div>
                      <div className="carousel-item">
                        <div className="img-box">
                          <img src="/images/slider-img3.jpg" alt="slide 3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>


      {/*
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
      */}

      {/*
      <section className="product_section layout_padding">
        <div className="container">
          <div className="heading_container heading_center">
            <h2>Our Products</h2>
          </div>
          <div className="row">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="col-sm-6 col-lg-4" key={i}>
                <div className="box">
                  <div className="img-box">
                    <img src={`/images/p${(i % 9) + 1}.png`} alt={`product ${i + 1}`} />
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
        </div>
      </section>
      */}

      {/*
      <section className="contact_section layout_padding">
        <div className="container">
          <div className="heading_container heading_center">
            <h2>Get In Touch</h2>
          </div>
          <div className="row">
            <div className="col-md-6">
              <form onSubmit={handleSubmitNoop}>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <input type="text" className="form-control" placeholder="Your Name" />
                  </div>
                  <div className="form-group col-md-6">
                    <input type="email" className="form-control" placeholder="Email" />
                  </div>
                </div>
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="Phone Number" />
                </div>
                <div className="form-group">
                  <textarea className="form-control" placeholder="Message" rows="5" />
                </div>
                <button type="submit" className="btn btn-primary">Send</button>
              </form>
            </div>
            <div className="col-md-6">
              <div className="map_container">
                <img src="/images/contact_bg.jpg" alt="map" />
              </div>
            </div>
          </div>
        </div>
      </section>
      */}

      {/*
      <section className="client_section layout_margin-bottom">
        <div className="container">
          <div className="heading_container heading_center">
            <h2>Our Clients</h2>
          </div>
          <div className="client_container">
            <div className="client_logo"><img src="/images/client.jpg" alt="client" /></div>
            <div className="client_logo"><img src="/images/client.jpg" alt="client" /></div>
            <div className="client_logo"><img src="/images/client.jpg" alt="client" /></div>
          </div>
        </div>
      </section>
      */}

      {/*
        <section className="info_section">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <h5>About</h5>
                <p>Short about text or address goes here.</p>
              </div>
              <div className="col-md-4">
                <h5>Contact</h5>
                <p>Phone: +123456789</p>
              </div>
              <div className="col-md-4">
                <h5>Hours</h5>
                <p>Mon - Fri: 9am - 6pm</p>
              </div>
            </div>
          </div>
        </section>
      */}

      <footer className="footer_section">
        <div className="container">
          <p>© 2025 BaloncestoTeam - All Rights Reserved</p>
        </div>
      </footer>
    </>
  );
}