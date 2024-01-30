//IMPORT
import React, { useEffect, useState } from "react";
import axios from "axios";
import { mostrarAlerta } from "../functions.js";
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
import ReactPaginate from "react-paginate";
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Link } from "react-router-dom"; 
////////////////////////////////////////////////////////////////////

//CUERPO COMPONENTE
const MascotasComponent = () => 
{
  const url = "http://localhost:8000/mascotas";
  const [mascotas, setMascotas] = useState([]);
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [raza, setRaza] = useState(""); 
  const [foto, setFoto] = useState("");  
  const [detalle1, setDetalle1] = useState("");
  const [detalle2, setDetalle2] = useState("");
  const [operacion, setOperacion] = useState("");
  const [titulo, setTitulo] = useState(""); 
  const [pageNumber, setPageNumber] = useState(0); 
  const mascotasPerPage = 3;

  useEffect(() => 
  {
    getMascotas();
  }, []);

  ///////////////////////////////////////////////////////////////////
//REALIZA SOLICITUD GET PARA LISTAR LOS DATOS DE MASCOTAS
  const getMascotas = async () => 
  {
    const respuesta = await axios.get(`${url}/buscar`);
    console.log(respuesta.data);
    setMascotas(respuesta.data);
  };

  ////////////////////////////////////////////////////////////////////
//ABRE EL MODAL DE MASCOTAS
  const openModal =(opcion, id, nombre, edad, raza, foto, detalle1, detalle2)=>
  {
    setId('');
    setNombre('');
    setEdad('');
    setRaza('');
    setFoto('');
    setDetalle1('');
    setDetalle2('');
    setOperacion(opcion);
    if(opcion === 1)
    {
        setTitulo("Registrar Mascota");
    }
    else if(opcion===2)
    {
        setTitulo("Editar Mascota");
        setId(id);
        setNombre(nombre);
        setEdad(edad);
        setRaza(raza);
        setFoto(foto);
        setDetalle1(detalle1);
        setDetalle2(detalle2);
    }
  };

  ////////////////////////////////////////////////////////////////////
//VALIDAR INFORMACION PARA CREAR Y ACTUALIZAR DATOS DE MASCOTA
  const validar = ()=>
  {
    let parametros;
    let metodo;
    if(nombre.trim()==='')
    {
        console.log("Debe escribir un Nombre");
        mostrarAlerta("Debe escribir un Nombre");
    }
    else if(edad.trim()==='')
    {
        console.log("Debe escribir una Edad");
        mostrarAlerta("Debe escribir una Edad");
    }
    else
    {
        if(operacion===1)
        {
          parametros=
          {
             urlExt: `${url}/crear`,
             nombre: nombre.trim(),
             edad: edad.trim(),
             raza: raza.trim(),
             foto: foto.trim(),
             detalle1: detalle1.trim(),
             detalle1: detalle1.trim()
          };
          metodo="POST";
        }
        else
        {
            parametros=
            {
                urlExt: `${url}/actualizar/${id}`,
                nombre: nombre.trim(),
                edad: edad.trim(),
                raza: raza.trim(),
                foto: foto.trim(),
                detalle1: detalle1.trim(),
                detalle2: detalle2.trim()
            };
            metodo="PUT";
        }
        enviarSolicitud(metodo, parametros);
    }
  };

  ////////////////////////////////////////////////////////////////////
//SOLICITUDES HTTP
  const enviarSolicitud = async (metodo, parametros)=>
  {
    await axios({method: metodo, url: parametros.urlExt, data: parametros })
    .then((respuesta)=>
    {
        let tipo= respuesta.data.tipo;
        let mensaje = respuesta.data.mensaje;
        mostrarAlerta(mensaje,tipo);
        if(tipo ==="success")
        {
            document.getElementById("btnCerrarModal").click();
            getMascotas();
        }
    })
    .catch
    ((error)=>{
        mostrarAlerta(`Error en la solicitud`,error)
    });
  };

  ////////////////////////////////////////////////////////////////////
//ELIMINAR MASCOTA
  const eliminarMascota=(id,nombre)=>
  {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        title: `Estas seguro de eliminar la mascota ${nombre} ?`,
        icon: 'question',
        text: 'Se eliminará Definitivamente',
        showCancelButton: true, 
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result)=>{
        if(result.isConfirmed){
            setId(id);
            enviarSolicitud("DELETE",{urlExt: `${url}/eliminar/${id}`,id:id})
        }
        else{
            mostrarAlerta("No se elimino la mascota","info");
        }
    })
  }

  ////////////////////////////////////////////////////////////////////
//CAMBIAR PAGINA
  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };
  const pageCount = Math.ceil(mascotas.length / mascotasPerPage);
  const offset = pageNumber * mascotasPerPage;

  ////////////////////////////////////////////////////////////////////
//INTERFAZ DEL COMPONENTE
  return (
    <div className="App">

      {/* Mostrar LOGO */}
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
            <Link to={`/`} className="btn btn-danger ms-2">
              <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
            </Link>
        </div>
      <div className="container-fluid">
        {/* AÑADIR MASCOTA */}
        <div className="row mt-3">
          <div className="col-md-4 offset-md-4">
            <div className="d-grid mx-auto">
              <button
                onClick={() => openModal(1)}
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#modalMascotas">
                <i className="fa-solid fa-circle-plus"></i>Añadir
              </button>
            </div>
          </div>
        </div> 
        {/* MOSTRAR MASCOTA */}
        <div className="row mt-3">
          <div className="col-12 col-lg-8 offset-0 offset-lg-2">
            <div className="row">
              {mascotas.slice(offset, offset + mascotasPerPage).map((mascota) => (
                <div key={mascota.id} className="col-12 col-md-6 col-lg-4 mb-4">
                  <div className="card" style={{ width: '18rem' }}>
                    <img src={mascota.imagen} className="card-img-top" alt="" style={{ objectFit: 'cover', height: '250px' }}/>
                    <div className="card-body">
                      <h5 className="card-title">{mascota.nombre}</h5>
                      <p className="card-text">
                        <strong>Edad:</strong> {mascota.edad}
                        <br/>
                        <strong>Raza:</strong> {mascota.raza}
                        <br/>
                        {mascota.descripcion1}
                      </p>
                      <button
                        onClick={() => openModal(2, mascota.id, mascota.nombre, mascota.edad, mascota.raza, mascota.imagen, mascota.descripcion1, mascota.descripcion2)}
                        className="btn btn-warning"
                        data-bs-toggle="modal"
                        data-bs-target="#modalMascotas">
                        <i className="fa-solid fa-edit"></i> Editar
                      </button>
                      {' '}
                      <button
                        onClick={() => eliminarMascota(mascota.id, mascota.nombre)}
                        className="btn btn-danger">
                        <i className="fa-solid fa-trash"></i> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* CAMBIAR DE PAGINA*/}
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
        <div id="modalMascotas" className="modal fade" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <label className="h5">{titulo}</label>
              </div>
              <div className="modal-body">
                <input type="hidden" id="id"></input>
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
                    onChange={(e)=>setNombre(e.target.value)}
                  ></input>
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i className="fa-solid fa-clock"></i>
                  </span>
                  <input
                    type="text"
                    id="edad"
                    className="form-control"
                    placeholder="Edad"
                    value={edad}
                    onChange={(e)=>setEdad(e.target.value)}
                  ></input>
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                      <i className="fa-solid fa-dog"></i>
                  </span>
                  <input
                      type="text"
                      id="raza"
                      className="form-control"
                      placeholder="Raza"
                      value={raza}
                      onChange={(e) => setRaza(e.target.value)}
                  ></input>
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                      <i className="fa-solid fa-camera"></i>
                  </span>
                  <input
                      type="text"
                      id="imagen"
                      className="form-control"
                      placeholder="Link de la Imagen"
                      value={imagen}
                      onChange={(e) => setImagen(e.target.value)}
                  ></input>
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                      <i className="fa-solid fa-comment"></i>
                  </span>
                  <input
                      type="text"
                      id="descripcion1"
                      className="form-control"
                      placeholder="Descripcion Corta"
                      value={descripcion1}
                      onChange={(e) => setDescripcion1(e.target.value)}
                  ></input>
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                      <i className="fa-solid fa-info-circle"></i>
                  </span>
                  <input
                      type="text"
                      id="descripcion2"
                      className="form-control"
                      placeholder="Descripcion Larga"
                      value={descripcion2}
                      onChange={(e) => setDescripcion2(e.target.value)}
                  ></input>
                </div>
                <div className="d-grid col-6 mx-auto">
                  <button onClick={() => validar()} className="btn btn-success">
                    <i className="fa-solid fa-floppy-disk"></i>Guardar
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
    </div>
  );
};

//EXPORT
export default MascotasComponent;
