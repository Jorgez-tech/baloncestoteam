import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { apiClient } from '../api/client';
import Header from "./Header";

export default function Contacto() {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", mensaje: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.nombre || !form.email || !form.mensaje) {
      toast.error("Todos los campos obligatorios deben completarse");
      return false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      toast.error("Correo electrónico inválido");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await apiClient.post("/contact", form);

      if (response.status === 200) {
        toast.success("Mensaje enviado correctamente. ¡Gracias por contactarnos!");
        setForm({ nombre: "", email: "", telefono: "", mensaje: "" });
      }
    } catch (err) {
      console.error('Error al enviar mensaje de contacto:', err);

      if (err.response) {
        // Error del servidor (4xx, 5xx)
        toast.error(err.response.data?.msg || "Error al enviar el mensaje. Intenta nuevamente.");
      } else if (err.request) {
        // Error de red (sin respuesta del servidor)
        toast.error("Error de conexión. Verifica tu internet e intenta más tarde.");
      } else {
        // Otro tipo de error
        toast.error("Error inesperado. Intenta más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="hero_area">
        {/* header section starts */}
        <header className="header_section">
          <Header />
        </header>
        {/* contacto section */}
        <section className="contact_section">
          <div className="container">
            <div className="row">
              <div className="col-md-6 mx-auto">
                <div className="contact_form layout_padding">
                  <div className="heading_container heading_center">
                    <h2>Contáctanos</h2>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <input type="text" name="nombre" placeholder="Nombre completo*" value={form.nombre} onChange={handleChange} />
                    <div className="top_input">
                      <input type="email" name="email" placeholder="Correo electrónico*" value={form.email} onChange={handleChange} />
                      <input type="text" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
                    </div>
                    <input type="text" name="mensaje" placeholder="Mensaje*" className="message_input" value={form.mensaje} onChange={handleChange} />
                    <div className="btn-box">
                      <button type="submit" disabled={loading}>{loading ? "Enviando..." : "Enviar"}</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
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
                  ¿Tienes dudas, sugerencias o quieres unirte a nuestro club? Escríbenos y te responderemos lo antes posible. En BaloncestoTeam estamos para ayudarte y acompañarte en tu camino deportivo.
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
                <form action="#" onSubmit={(e) => e.preventDefault()}>
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