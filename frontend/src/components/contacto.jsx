import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

export default function Contacto() {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", mensaje: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const validate = () => {
    if (!form.nombre || !form.email || !form.mensaje) return "Todos los campos obligatorios";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Correo electrónico inválido";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSuccess("Mensaje enviado correctamente. ¡Gracias por contactarnos!");
        setForm({ nombre: "", email: "", telefono: "", mensaje: "" });
      } else {
        setError("Error al enviar el mensaje. Intenta nuevamente.");
      }
    } catch (err) {
      setError("Error de conexión. Intenta más tarde.");
    }
    setLoading(false);
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
                    {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
                    {success && <div style={{ color: "green", marginTop: 10 }}>{success}</div>}
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
                <h5>Newsletter</h5>
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