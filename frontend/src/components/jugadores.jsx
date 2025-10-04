import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

export default function Jugadores() {
  const handleSubmitNoop = (e) => e.preventDefault();
  const location = useLocation();
  useEffect(() => {
    // Aquí puedes resetear estado, scroll, etc. si lo necesitas
    // Por ejemplo, window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <div className="hero_area">
        {/* header section starts */}
        <header className="header_section">
          <div className="container-fluid">
            <nav className="navbar navbar-expand-lg custom_nav-container ">
              <a className="navbar-brand" href="/">
                <span>BaloncestoTeam</span>
              </a>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
              </button>

              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <div className="d-flex ml-auto flex-column flex-lg-row align-items-center">
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/nosotros">Nosotros</Link>
                    </li>
                    <li className="nav-item active">
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
            <h2>Nuestros Jugadores</h2>
          </div>
          <div className="row">
            {[
              { img: '/images/hakeem.jpg', nombre: 'Hakeem Olajuwon' },
              { img: '/images/mj.jpg', nombre: 'Michael Jordan' },
              { img: '/images/dennis-rodman.jpg', nombre: 'Dennis Rodman' },
              { img: '/images/kobe.jpg', nombre: 'Kobe Bryant' },
              { img: '/images/hakeem.jpg', nombre: 'Hakeem Olajuwon' },
              { img: '/images/mj.jpg', nombre: 'Michael Jordan' },
              { img: '/images/dennis-rodman.jpg', nombre: 'Dennis Rodman' },
              { img: '/images/kobe.jpg', nombre: 'Kobe Bryant' },
              { img: '/images/hakeem.jpg', nombre: 'Hakeem Olajuwon' },
            ].map((jugador, idx) => (
              <div className="col-sm-6 col-lg-4" key={idx}>
                <div className="box">
                  <div className="img-box" style={{ width: '100%', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img src={jugador.img} alt={jugador.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div className="detail-box">
                    <div className="text">
                      <a href="#" className="p_name">{jugador.nombre}</a>
                    </div>
                    <div className="like">
                      <h6>Valoración</h6>
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
          <div className="btn-box"><a href="#">Ver Todos</a></div>
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
                    <span>BaloncestoTeam</span>
                  </a>
                </div>
                <p>
                  En BaloncestoTeam formamos jugadores con pasión, disciplina y trabajo en equipo. Descubre a los integrantes que hacen grande a nuestro club y conoce sus historias y logros en la cancha.
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