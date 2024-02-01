import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { mostrarAlerta } from "../functions.js";

const LoginComponent = () => {
    const url = "http://localhost:8000/mascotas";

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

/////////////////////////////////////////////////////
//CAMPOS DEL FORMULARIO
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

/////////////////////////////////////////////////////
//MANEJO DE VALIDACION DEL FORMULARIO
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(`${url}/login`, formData);
      
          if (response.data.success) {
            navigate("/crear");
          } else {
            mostrarAlerta("Username o password incorrectas");
          }
        } catch (error) {
          mostrarAlerta("Username o password incorrectas");
          if (error.response) {
            console.log("Detalles de la respuesta del servidor:", error.response);
          }
        }
    };

/////////////////////////////////////////////////////
//INTERFAZ DE USUARIO
    return (
        <div className="App">
            <br />
            <div>
                <img
                    src="/logo.png"
                    alt="Logo o imagen de la página"
                    style={{ width: "150px", height: "150px" }}
                />
            </div>
            <div className="containerr mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-center">Login</h2>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="username">Username:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label htmlFor="password">Password:</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <br />
                                    <button type="submit" className="btn btn-success">
                                        <i className="fa-solid fa-sign-in-alt"></i> Ingresar
                                    </button>
                                    <Link to={`/`} className="btn btn-danger ms-2">
                                        <i className="fas fa-times"></i> Cancelar
                                    </Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;