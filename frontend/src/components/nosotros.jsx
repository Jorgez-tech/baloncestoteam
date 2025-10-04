
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

export default function Nosotros() {
  const handleSubmitNoop = (e) => e && e.preventDefault();
  const location = useLocation();

  useEffect(() => {
    // Aquí puedes resetear estado, scroll, etc. si lo necesitas
    // Por ejemplo, window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {/* end header section */}
      <header className="header_section">
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg custom_nav-container ">
            <a className="navbar-brand" href="/">
              <span>BaloncestoTeam</span>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <div className="d-flex ml-auto flex-column flex-lg-row align-items-center">
                <ul className="navbar-nav">
                  <li className="nav-item active">
                    <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/nosotros">Nosotros</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/jugadores">Jugadores</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/contacto">Contácto</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Iniciar Sesión</Link>
                  </li>
                </ul>
                <div className="quote_btn-container">
                  <a href="#" className="cart_link">
                    <i className="fa fa-cart-arrow-down" aria-hidden="true" />
                    <span className="cart_number">0</span>
                  </a>
                  <form className="form-inline" onSubmit={handleSubmitNoop}>
                    <button className="btn nav_search-btn" type="submit">
                      <i className="fa fa-search" aria-hidden="true" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>
      {/* about section */}
      <section className="about_section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 col-md-5 offset-md-1">
              <div className="detail-box">
                <h2>Nosotros</h2>
                <p>
                  En BaloncestoTeam creemos que el deporte es el punto de partida de grandes sueños y amistades. Somos una familia apasionada por el baloncesto, dedicada a formar jugadores y personas íntegras, donde cada miembro encuentra un espacio para crecer, aprender y disfrutar. ¡Únete y sé parte de esta gran familia donde tus sueños comienzan!
                </p>
                <div>
                  <a href="#">Comprar Ahora</a>
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
      <section className="info_section layout_padding2" style={{ padding: '30px 0', margin: '0' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="logo_detail">
                <div className="logo-box">
                  <a className="navbar-brand" href="/">
                    <span>BaloncestoTeam</span>
                  </a>
                </div>
                <p>
                  Somos BaloncestoTeam, un club dedicado a la formación deportiva y humana de nuestros jugadores. Fomentamos el trabajo en equipo, la disciplina y la pasión por el baloncesto. ¡Descubre todo lo que podemos lograr juntos!
                </p>
              </div>
            </div>
            <div className="col-md-4 col-lg-3 mx-auto">
              <div className="address_box">
                <h5>Dirección</h5>
                <a href="#"><i className="fa fa-map-marker" aria-hidden="true" />Calle 123, Ciudad Deportiva</a>
                <a href="#"><i className="fa fa-phone" aria-hidden="true" />(+57) 3001234567</a>
                <a href="#"><i className="fa fa-envelope" aria-hidden="true" />contacto@baloncestoteam.com</a>
              </div>
            </div>
            <div className="col-md-3">
              <div className="info_form">
                <h5>Newsletter</h5>
                <form onSubmit={handleSubmitNoop}>
                  <input type="text" placeholder="Ingresa tu correo" />
                  <button type="submit">Suscribirse</button>
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
          <p>© 2025 BaloncestoTeam - Todos los derechos reservados</p>
        </div>
      </footer>
    </>
  );
}