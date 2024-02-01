//IMPORT
import React, { useEffect, useState } from "react";
import axios from "axios"; 
import { Link } from "react-router-dom"; 
import { mostrarAlerta } from "../functions.js"; 
import ReactPaginate from "react-paginate"; 
import './styles.css'; 

// CUERPO DEL COMPONENTE
const AdoptarMascotasComponent = () => {

  const url = "http://localhost:8000/mascotas";
  const [mascotas, setMascotas] = useState([]);
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [titulo, setTitulo] = useState("");


  const [busqueda, setBusqueda] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const mascotasPerPage = 3;

  useEffect(() => {
    getMascotas(); 
  }, []);

  ///////////////////////////////////////////////////////////////////
//FUNCION PARA PROPORCIONAR EL ESTADO DE BUSQUEDA
  const getMascotas = async () => {
    try {
      const respuesta = await axios.get(`${url}/buscar?termino=${busqueda}`);
      setMascotas(respuesta.data);
    } catch (error) {
      console.error("Error al obtener las mascotas:", error);
    }
  };
  
  ///////////////////////////////////////////////////////////////////
//CAMBIAR PAGINA
  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

    //REALIZA LA OPERACION PARA OBTENER EL NUMERO DE PAGINAS
    const pageCount = Math.ceil(mascotas.length / mascotasPerPage);
    const offset = pageNumber * mascotasPerPage;

  ///////////////////////////////////////////////////////////////////
//MODAL PARA EL PROCESO DE ADOPTAR UNA MASCOTA
  const openModal = (mascotaId) => {
    setTitulo("Datos Adopción Mascota");
    setId(mascotaId);
    setNombre('');
    setTelefono('');
  };

  ///////////////////////////////////////////////////////////////////
//VALIDA LA INFORMACION DE SOLICITUD DE ADOPTAR MASCOTAS
  const validar = () => {
    let parametros;
    let metodo;
    if (nombre.trim() === '') {
      mostrarAlerta("Debe escribir un Nombre");
    }
    else if (String(telefono).trim() === '') {
      mostrarAlerta("Debe escribir un teléfono");
    } else {
      parametros = {
        urlExt: `${url}/adopcion/crear`,
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        id_mascota: id,
      };
      metodo = "POST";
      enviarSolicitud(metodo, parametros);
    }
  };

  ///////////////////////////////////////////////////////////////////  
//SOLICITUD DE ADOPCION AL SERVIDOR
  const enviarSolicitud = async (metodo, parametros) => {
    try {
      const respuesta = await axios({ method: metodo, url: parametros.urlExt, data: parametros });
      let tipo = respuesta.data.tipo;
      let mensaje = respuesta.data.mensaje;
      mostrarAlerta(mensaje, tipo);
      if (tipo === "success") {
        document.getElementById("btnCerrarModal").click();
        getMascotas();
      }
    } catch (error) {
      mostrarAlerta(`Error en la solicitud`, error);
    }
  };

  ///////////////////////////////////////////////////////////////////
  // INTERFAZ DEL COMPONENTE
  return (
    <div className="App">
        <br/>
        <div class="d-flex align-items-center justify-content-between">
            <img src="/logo.png" alt="Logo o imagen de la página" style={{ width: '145px', height: '145px' }} />

            <form class="d-flex" role="search" style={{ flex: '1' }}>
                <input
                    class="form-control me-2"
                    type="search"
                    placeholder="Buscar por nombre o raza"
                    aria-label="Search"
                    style={{ width: '100%' }}
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <button class="btn btn-success" type="button" onClick={getMascotas}>
                    Buscar
                </button>
            </form>
            <Link to="/login">
                <img src="/login.png" alt="Login de la página" style={{ width: '80px', height: '80px', marginLeft: '20px', cursor: 'pointer' }} />
            </Link>
        </div>
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-12 col-lg-8 offset-0 offset-lg-2">
            <div className="row">
              {mascotas.slice(offset, offset + mascotasPerPage).map((mascota) => (
                <div key={mascota.id} className="col-12 col-md-6 col-lg-4 mb-4">
                  <div className="card" style={{ width: '18rem' }}>
                    <img
                      src={mascota.imagen}
                      className="card-img-top"
                      alt=""
                      style={{ objectFit: 'cover', height: '220px' }}
                    />                  
                    <div className="card-body">
                      <h5 className="card-title">{mascota.nombre}</h5>
                      <p className="card-text">
                        <strong>Edad:</strong> {mascota.edad}
                        <br />
                        <strong>Raza:</strong> {mascota.raza}
                        <br />
                        {mascota.descripcion1}
                      </p>
                      <Link to={`/detalles/${mascota.id}`} className="btn btn-primary">
                        <i className="fas fa-info-circle"></i> Detalles
                      </Link>
                      {' '}
                      <button
                        onClick={() => openModal(mascota.id)}
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#modalAdopcion"
                      >
                        <i className="fas fa-paw"></i> Adoptar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="row mt-3">
              <div className="col-12 text-center">
                <ReactPaginate
                  previousLabel={"Anterior"}
                  nextLabel={"Siguiente"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  onPageChange={handlePageChange}
                  containerClassName={"custom-pagination"}
                  pageClassName={"custom-pagination-item"}
                  activeClassName={"custom-pagination-item--selected"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="modalAdopcion" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">Por favor ingrese sus datos</label>
            </div>
            <div className="modal-body">
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-dog"></i>
                </span>
                <input
                  type="text"
                  id="id_mascota"
                  className="form-control"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  readOnly
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-user"></i>
                </span>
                <input
                  type="text"
                  id="nombre"
                  className="form-control"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                ></input>
              </div> 
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-phone"></i>
                </span>
                <input
                  type="number"
                  id="telefono"
                  className="form-control"
                  placeholder="Telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                ></input>
              </div>
              <div className="d-grid col-6 mx-auto">
                <button onClick={() => validar()} className="btn btn-success">
                  <i className="fa-solid fa-floppy-disk"></i> Enviar
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                id="btnCerrarModal"
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ); 
};

//EXPORT
export default AdoptarMascotasComponent;
