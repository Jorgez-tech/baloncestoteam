
import Header from "./Header";
import { useEffect, useState } from "react";
import { fetchPlayers } from "../api/players";

export default function Jugadores() {
  const [jugadores, setJugadores] = useState([]);
  const handleSubmitNoop = (e) => e.preventDefault();

  useEffect(() => {
    async function getPlayers() {
      const data = await fetchPlayers();
      setJugadores(data);
    }
    getPlayers();
  }, []);

  return (
    <>
      <div className="hero_area">
        {/* header section starts */}
        <Header />
        {/* Jugadores section */}
        <section className="jugadores_section layout_padding">
          <div className="container">
            <div className="row">
              {jugadores.map((jugador, idx) => (
                <div className="col-sm-6 col-lg-4" key={idx}>
                  <div className="box">
                    <div className="img-box" style={{ width: '100%', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <img
                        src={jugador.avatar || '/images/default-avatar.svg'}
                        alt={jugador.name}
                        style={{ width: 'auto', height: '100%', objectFit: 'contain', objectPosition: 'top' }}
                      />
                    </div>
                    <div className="detail-box">
                      <div className="text">
                        <span className="p_name">{jugador.name}</span>
                        <div style={{ fontSize: '0.9em', color: '#888' }}>{jugador.position}</div>
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
      </div>
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
                <h5>Suscríbete</h5>
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