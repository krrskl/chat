'use strict';
var estudiantes = [];
var profesorEnv = {};
var estudianteEnv = {};
var estudianteActual = {};
var fil, col, profesor, estudiante;
var socket;
var profesor;
$(document).ready(function () {
    socket = io.connect('http://' + document.domain + ':' + location.port);
    $('#iniciar').on('submit', function (e) {
        e.preventDefault();
        profesor = $("#profesor").val();
        fil = $("#fil").val();
        col = $("#col").val();
        profesorEnv.nombre = profesor;
        profesorEnv.fila = fil;
        profesorEnv.columna = col;
        profesorEnv.id = socket.id;
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
        socket.emit('iniciarSesionEst', estudianteEnv);
        location.href = "/chat";
    });
});

function iniciar() {
    getProfesor();
}

function getEstudiantes() {
    socket.emit('getEstudiantes');
    socket.on('getEstudiantes', function (data) {
        estudiantes = data;
        for (let e of estudiantes) {
            if (e.id == socket.id) {
                estudianteActual = e;
                break;
            }
        }
        armarMatriz();
    });
}

function armarMatriz() {
    let matrizU = $(".usuariosConectados");
    matrizU[0].innerHTML = "";
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 7; j++) {
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
    matrizU.append(`<div class="barra-m">
        <input type="text" id="mensaje" placeholder="Mensaje...">
        <input type="button" id="enviar" value="ENVIAR">
        </div>`)
}

function getProfesor() {
    socket.emit('getProfesor');
    socket.on('getProfesor', function (data) {
        profesor = data[data.length - 1]
        $("#profesor")[0].innerHTML = profesor.nombre;
        armarMatriz();
    });
}