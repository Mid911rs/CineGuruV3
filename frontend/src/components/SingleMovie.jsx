import { useFetch } from "../hooks/useFetch";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import ReactPlayer from 'react-player/youtube';
import Modal from 'react-modal';
import { DiscussionEmbed } from 'disqus-react';
import { useNavigate } from 'react-router-dom';
import { FacebookShareButton, TwitterShareButton, TelegramShareButton, WhatsappShareButton} from 'react-share';
import Facebook from 'bootstrap-icons/icons/facebook.svg';
import Twitter from 'bootstrap-icons/icons/twitter.svg';
import WhatsApp from 'bootstrap-icons/icons/whatsapp.svg';
import Telegram from 'bootstrap-icons/icons/telegram.svg';

import DefaultImage from "/NoImage.png"

const SingleMovie = () => {
    const { id } = useParams();
    const {isLoading, error, data} = useFetch(`&i=${id}`);
    const [trailerUrl, setTrailerUrl] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const {navigate} = useNavigate();

    

    let image, Title, Poster, Plot, Actors, Year, Country, Director, Released, Runtime, Type, Genre, imdbRating;

    if (data) {
        ({ Poster, Title, Plot, Actors, Year, Country, Director, Released, Runtime, Type, Genre, imdbRating } = data);
        image = Poster === "N/A" ? DefaultImage : Poster;
    }

    //Insertar video Youtubea
    useEffect(() => {
        if (Title) {
            axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${Title}+trailer&key=AIzaSyCUbf6t18N92UgKfhyoLbxc979R9F9DCjI`)
                .then(res => {
                    if (res.data.items.length > 0) {
                        setTrailerUrl(`https://www.youtube.com/watch?v=${res.data.items[0].id.videoId}`);
                    } else {
                        console.log('No se encontró el tráiler de la película');
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, [Title]);

    //Simbolo de carga

    if (isLoading) {
        return <div className="loading"></div>;
    }

    //Agregar favoritos, mensaje proviene de server.js
    const addToFavorites = () => {
        const token = localStorage.getItem('sessionToken'); // Obtener el token de sesión del almacenamiento local
        axios.get(`http://localhost:5000/addmovie/${Title}`, { 
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}` // incluir el token de sesión en la cabecera de la solicitud
          } 
        })
        .then(response => {
          console.log(response.data);
          setMessage(response.data.message);
          setShowModal(true);
          setTimeout(() => {
            setMessage('');
            setShowModal(false);
          }, 2000); // Cerrar el modal después de 3 segundos - se puede modificar para que dure menos
        })
        .catch(error => {
          console.error(error);
          if (error.response) {
            if (error.response.status === 401) {
              setMessage('Para agregar a favoritos debe iniciar sesión');
              // Antes de redirigir al usuario a la página de inicio de sesión
              localStorage.setItem('prevPath', window.location.pathname);
              // Redirige al usuario a la página de inicio de sesión después de 3 segundos
              setTimeout(() => {
                navigate('/login');
              }, 3000);
            } else if (error.response.status === 400) {
              setMessage(error.response.data.message); // Mostrar el mensaje de error que viene en la respuesta
            } else {
              setMessage('Hubo un error al añadir la película a favoritos');
            }
          } else {
            setMessage('Hubo un error al añadir la película a favoritos');
          }
          setShowModal(true);
          setTimeout(() => {
            setMessage('');
            setShowModal(false);
          }, 3000); // Cerrar el modal después de 3 segundos
        });
    }

    //Inserción de DISQUS
    const disqusConfig = {
        shortname: 'cinegurucl',   //Cuenta creada en la página de disqus, se guardará la info en sus servidores
        config: {
            identifier: id, 
            title: Title,  
        },
    };

    //Compartir en redes sociales información de la película, obtiene la URL de la página
    const shareUrl = window.location.href;


    //En return, REACT PLAYER contiene el video de Youtube, el botón que está justo debajo es el botón para cerrar video
    //tiene estilo básico (rojo con letras blancas, se puede modificar)
    //El primer MODAL corresponde al estilo de los mensajes popup que aparecen al agregar a favoritos

    return ( 
        !isLoading ?
        <div>
            <div className="single-movie">
                <img src={image} alt={Title} />
                <div className="single-info">
                <h2>{ Title }</h2>

                <button onClick={addToFavorites}className="add-fav-button">Agregar a favoritos</button>

                <button onClick={() => setModalIsOpen(true)}className="trailer-button">Reproducir tráiler</button>

                <div className="contenedor_redes">

                    <FacebookShareButton url={shareUrl} style={{ margin: '10px' }}>
                        <img src={Facebook} className="hover_facebook" alt="Facebook" style={{ width: '50px', height: '50px' }} />
                    </FacebookShareButton>

                    <TwitterShareButton url={shareUrl} style={{ margin: '10px' }}>
                        <img src={Twitter} className="hover_twitter" alt="Facebook" style={{ width: '50px', height: '50px' }} />
                    </TwitterShareButton>

                    <WhatsappShareButton url={shareUrl} style={{ margin: '10px' }}>
                        <img src={WhatsApp} className="hover_whatsapp" alt="Facebook" style={{ width: '50px', height: '50px' }} />
                    </WhatsappShareButton>
                    
                    <TelegramShareButton url={shareUrl} style={{ margin: '10px' }}>
                        <img src={Telegram} className="hover_telegram" alt="Facebook" style={{ width: '50px', height: '50px' }} />
                    </TelegramShareButton>

                </div>
                
                <p> { Plot }</p>
                <p><strong>Actores principales: </strong>{ Actors }</p>
                <p><strong>País: </strong>{ Country }</p>
                <p><strong>Director: </strong>{ Director }</p>
                <p><strong>Fecha de estreno: </strong>{ Released }</p>
                <p><strong>Duración: </strong>{ Runtime }</p>
                <p><strong>Año: </strong>{ Year }</p>
                <p><strong>Tipo: </strong>{ Type }</p>
                <p><strong>Género: </strong>{ Genre }</p>
                <p><strong>Rating imdb: </strong>{ imdbRating }</p>
                
                {showModal && 
                    <div style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '10px',
                            borderRadius: '10px'
                        }}>
                            <p>{message}</p>
                        </div>
                    </div>
                }
        
                
                </div>
            </div>
    
            <Modal 
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Tráiler"
                ariaHideApp={false}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)'
                    },
                    content: {
                        color: 'lightsteelblue',
                        height: '80%',
                        width: '60%',
                        marginLeft: '20%',
                        marginTop: '1%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative'
                    }
                }}
                >
                    
                    {trailerUrl && <ReactPlayer url={trailerUrl} playing width='100%' height='100%' />}
                    <button onClick={() => setModalIsOpen(false)}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'red',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            fontSize: '1.2em',
                            cursor: 'pointer'
                        }}
                    >
                        X
                    </button>
            </Modal>
        
            <div style={{ 
                marginTop: '20px', 
                marginLeft: 'auto', // Centra el componente horizontalmente
                marginRight: 'auto',
                width: '77%', // ancho del componente
                padding: '50px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '20px'
                
            }}>
                <DiscussionEmbed {...disqusConfig} />
            </div>
            
        </div> : null
    );
}

export default SingleMovie; 
