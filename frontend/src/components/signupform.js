import React, { useState } from 'react';

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        if (response.ok) {
            alert('Formulario enviado!');
            setEmail('');
            setPassword('');
        } else {
            alert('Error al enviar el formulario');
        }
    };

    return (
        <section id="inscripcion">
            <h2>Formulario de Inscripción</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label htmlFor="password">Contraseña:</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Enviar</button>
            </form>
        </section>
    );
};

export default SignupForm;