'use strict';
var estudiantes = [];
var profesorEnv = {};
var estudianteEnv = {};
var estudianteActual = {};
var encuesta = {};
var fil, col, profesor, estudiante;
var socket;
var profesor;
var enviar, inputEnviar;
var preguntasEncu = [];
var respuestasEncu = [];
var cantRespuesta = [];
$(document).ready(function () {
    socket = io.connect('http://' + document.domain + ':' + location.port);
    $(".m-open").modalF();
    socket.on('nuevoEstudiante', function (nombre) {
        mensaje("El estudiante " + nombre + " inicio sesión");
    });
    let chat = $(".chat");
    socket.on('getMensajes', function (mensajes) {
        if (mensajes[mensajes.length - 1].usuario == estudianteActual.nombre) {
            chat.append(`
                <div class="message">
                    <span class="usuarioNombre">
                        <div class="foto"></div>
                        Yo
                    </span>
                    <span class="texto">
                        ${mensajes[mensajes.length - 1].mensaje}
                    </span>
                </div>
            `)
        } else {
            chat.append(`
                <div class="message">
                    <span class="usuarioNombre">
                        <div class="foto"></div>
                        ${mensajes[mensajes.length - 1].usuario}
                    </span>
                    <span class="texto">
                        ${mensajes[mensajes.length - 1].mensaje}
                    </span>
                </div>
            `)
        }
        scrollAutomatico();
    });
    $('#iniciar').on('submit', function (e) {
        e.preventDefault();
        profesor = $("#profesor").val();
        fil = $("#fil").val();
        col = $("#col").val();
        profesorEnv.nombre = profesor;
        profesorEnv.fila = fil;
        profesorEnv.columna = col;
        profesorEnv.id = socket.id;
        profesorEnv.tipo = "profesor";
        socket.emit('iniciarChat', profesorEnv);
        location.href = "/chat";
    });
    $('#iniciarSesion').on('submit', function (e) {
        e.preventDefault();
        estudiante = $("#estudiante").val();
        fil = $("#fil").val();
        col = $("#col").val();
        estudianteEnv.nombre = estudiante;
        estudianteEnv.fila = fil;
        estudianteEnv.columna = col;
        estudianteEnv.id = socket.id;
        estudianteEnv.tipo = "estudiante";
        socket.emit('getProfesor');
        socket.on('getProfesor', function (data) {
            profesor = data[data.length - 1]
            if (fil >= profesor.fila || col >= profesor.columna) {
                mensaje("Filas o columnas no permitidas");
            } else {
                socket.emit('getEstudiantes');
                socket.on('getEstudiantes', function (data) {
                    estudiantes = data;
                    if (estudiantes.length > 0) {
                        let seguir = true;
                        for (let e of estudiantes) {
                            if (e.nombre == estudianteEnv.nombre || (e.fila == estudianteEnv.fila && e.columna == estudianteEnv.columna)) {
                                seguir = false;
                                break;
                            }
                        }
                        if (seguir) {
                            socket.emit('iniciarSesionEst', estudianteEnv);
                            getEstudiantes();
                            location.href = "/chat";
                        } else {
                            mensaje("El estudiante ya existe o la posición esta ocupada");
                        }
                    } else {
                        socket.emit('iniciarSesionEst', estudianteEnv);
                        location.href = "/chat";
                    }
                });
            }
        });
    });
    $("#encuesta").on('click', function (e) {
        e.preventDefault();
        if (estudianteActual.tipo == "profesor") {
            socket.emit('verEncuesta');
            socket.on('verEncuesta', function (data) {
                if (data) {
                    $(".m-body")[0].innerHTML = "";
                    $(".m-body").append(`
                        <h1>Ya hay una encuesta creada</h1>
                        <canvas id="myChart" width="400" height="400"></canvas>
                    `);
                    var ctx = document.getElementById("myChart").getContext('2d');
                    socket.emit('getRespuestas');
                    socket.on('getRespuestas', function (data) {
                        for (let respuesta of data) {
                            respuestasEncu.push(data.respuesta);
                        }
                        let r = 0;
                        for (pregunta of preguntasEncu) {
                            for (respuesta of respuestasEncu) {
                                if (respuesta == pregunta) r++;
                            }
                            cantRespuesta.push(r);
                            r = 0;
                        }
                        console.log(data, respuestasEncu, preguntasEncu, cantRespuesta);
                        var myChart = new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: preguntasEncu,
                                datasets: [{
                                    label: '# de respuestas',
                                    data: cantRespuesta,
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                    ],
                                    borderColor: [
                                        'rgba(255,99,132,1)',
                                        'rgba(54, 162, 235, 1)',
                                    ],
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true
                                        }
                                    }]
                                }
                            }
                        });
                    });
                } else {
                    $(".m-body").append(`
                        <input id="pregunta" type="text" placeholder="Pregunta"><br>
                        <div id="respuestas"></div><br>
                        <input type="button" id="agregarRespuesta" value="Agregar Respuesta">
                        <input class="m-close" type="button" id="guardarEncuesta" value="Crear Encuesta">
                    `)
                    $("#agregarRespuesta").on('click', function (e) {
                        e.preventDefault();
                        let respuestas = $("#respuestas");
                        respuestas.append(`
                        <input type="text" placeholder="Respuesta">
                    `)
                    })
                    $("#guardarEncuesta").on('click', function (e) {
                        e.preventDefault();
                        let respuestas = $("#respuestas")[0].children;
                        let pregunta = $("#pregunta").val();
                        let aRespuestas = [];
                        for (let respuesta of respuestas) {
                            aRespuestas.push(respuesta.value);
                        }
                        aRespuestas.push(pregunta);
                        socket.emit('nuevaEncuesta', aRespuestas);
                    })
                }
            })
        } else {
            socket.emit('verEncuesta');
            socket.on('verEncuesta', function (data) {
                if (data) {
                    socket.emit('getEncuesta');
                    socket.on('getEncuesta', function (data) {
                        $(".m-body")[0].innerHTML = "";
                        $(".m-body").append(`
                            <h1>¿${data[data.length - 1]}?</h1>
                            <form id="encuestaResponder" name="res" action="">
                            </form>

                        `)
                        for (let i = 0; i < data.length - 1; i++) {
                            preguntasEncu.push(data[i]);
                            $("#encuestaResponder").append(`
                                <input type="radio" name="respuesta" value="${data[i]}">${data[i]}<br>
                            `)
                        }
                        $("#encuestaResponder").append(`
                            <br>
                            <button id="resEncuesta" type="submit" class="btn red">Responder</button>
                        `)
                    })
                    $(".m-body").on('click', "#resEncuesta", function (e) {
                        e.preventDefault();
                        // let respuestaForm = verRespuesta(document.res.respuesta);
                        let enviar = {};
                        enviar.respuesta = verRespuesta(document.res.respuesta);
                        enviar.usuario = estudianteActual.nombre;
                        socket.emit('respuesta', enviar);
                    })
                } else {
                    $(".m-body")[0].innerHTML = "";
                    $(".m-body").append(`
                            <h3>No hay encuesta</h3>                            
                    `)
                }
            })
        }
    })
});

function verRespuesta(form) {
    for (let i = 0; i < form.length; i++)
        if (form[i].checked) return form[i].value;
}

function mensaje(mensaje) {
    let x = $("#snackbar");
    x[0].innerHTML = mensaje;
    x.addClass("show");
    setTimeout(() => {
        x.removeClass("show");
    }, 3000);
}

function getMensajes() {
    socket.emit('getMensajes');
    socket.on('getMensajes', function (mensajes) {
        console.log(mensajes)
    })
}

function scrollAutomatico() {
    $('.chat').animate({
        scrollTop: $('.chat').get(0).scrollHeight
    }, 3000);
}

function iniciar() {
    socket.emit('getUltimoEstudiante');
    socket.on('usuarioActual', function (data) {
        estudianteActual = data;
    });
    getProfesor();
    getEstudiantes();
}

function getEstudiantes() {
    socket.emit('getEstudiantes');
    socket.on('getEstudiantes', function (data) {
        estudiantes = data;
        for (let e of estudiantes) {
            let span = $(`#nombre${e.fila}${e.columna}`);
            span[0].innerHTML = e.nombre;
        }
    });
}

function armarMatriz() {
    let matrizU = $(".usuariosConectados");
    matrizU[0].innerHTML = "";
    for (let i = 0; i < profesor.fila; i++) {
        for (let j = 0; j < profesor.columna; j++) {
            matrizU.append(`
            <div class="usuario">
                <div class="usuairoContenido">
                    <div class="foto"></div>
                    <span id='nombre${i}${j}'>libre</span>
                </div>
            </div>
            `);
        }
        matrizU.append('<br>');
    }
    enviar = $("#enviar");
    inputEnviar = $("#mensaje");
    enviar.on('click', function (e) {
        e.preventDefault();
        enviarMensaje();
    })
    inputEnviar.on('keyup', function (e) {
        if (e.keyCode == 13) {
            enviarMensaje();
        }
    });
}
function enviarMensaje() {
    let mensajeEnv = $("#mensaje");
    if (mensajeEnv.val()) {
        let m = {};
        m.mensaje = mensajeEnv.val();
        m.usuario = estudianteActual.nombre;
        socket.emit('nuevoMensaje', m);
        mensajeEnv.val("");
    }
}

function getProfesor() {
    socket.emit('getProfesor');
    socket.on('getProfesor', function (data) {
        profesor = data[data.length - 1]
        $("#profesor")[0].innerHTML = profesor.nombre;
        armarMatriz();
    });
}