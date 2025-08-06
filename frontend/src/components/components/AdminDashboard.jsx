import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <h1>Panel de Administración</h1>
            <p>Bienvenido al panel de administración. Aquí podrás gestionar usuarios, jugadores y contenido.</p>

            <div className="admin-sections">
                <div className="admin-card">
                    <h3>Gestión de Usuarios</h3>
                    <p>Administrar cuentas de usuario y permisos</p>
                </div>

                <div className="admin-card">
                    <h3>Gestión de Jugadores</h3>
                    <p>Agregar, editar y eliminar perfiles de jugadores</p>
                </div>

                <div className="admin-card">
                    <h3>Gestión de Galería</h3>
                    <p>Administrar imágenes y contenido multimedia</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;