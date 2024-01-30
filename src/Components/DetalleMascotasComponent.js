//IMPORT
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios"; 
import { Link } from "react-router-dom"; 
import './styles.css'; 

// CUERPO DEL COMPONENTE
const DetalleMascotasComponent = () => 
{
  const { id } = useParams();
  const url = "http://localhost:8000/mascotas";
  const [mascotas, setMascotas] = useState([null]); 

  useEffect(() => {
    getMascotaById(id);
  }, [id]);

  ///////////////////////////////////////////////////////////////////
  //INFORMACION DE MASCOTAS
  const getMascotaById = async (id) => {
    try {
      const respuesta = await axios.get(`${url}/buscar/${id}`);
      console.log(respuesta.data);
      setMascotas(respuesta.data);
    } catch (error) {
      console.error("Error al obtener la mascota:", error);
    }
  };

  ///////////////////////////////////////////////////////////////////
  // INTERFAZ DEL COMPONENTE
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
      <br />
      {mascotas && (
        <div className="container">
          <br />
          <div>
            <h2>{mascotas.nombre} ({mascotas.raza})</h2>
            <p style={{ textAlign: 'justify' }}>{mascotas.descripcion2}</p>
          </div>
          <div className="d-flex justify-content-between mt-3">
            <Link to={`/`} className="btn btn-dark ms-auto">
              <i className="fas fa-reply"></i> Regresar
            </Link>
          </div>
          <br />
        </div>
      )}
    </div>
  );
};

//EXPORT
export default DetalleMascotasComponent;