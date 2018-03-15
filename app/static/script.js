'use strict';
var usuarios = [];
var matrizUsuarios;
var miUsuario = {};
var profesorEnv = {};
var fil, col, profesor;
var socket;
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
        profesorEnv.tipo = "profesor";
        // console.log(profesorEnv)
        socket.emit('iniciarChat', profesorEnv);
        location.href = "/chat";
        // armarMatriz();
    });
});
function armarMatriz() {
    var profesorNombre;
    profesorNombre = $("#profesor")[0];
    socket.emit('armarMatriz');
    socket.on('FyC', function (data) {
        let datos = data[data.length-1];
        profesorNombre.outerText = datos.nombre;
        let matrizU = $(".usuariosConectados");
        console.log(datos.fila, datos.columna)
        for (let i = 0; i < datos.fila; i++) {
            for (let j = 0; j < datos.columna; j++) {
                matrizU.append(`
                <div id=${i}${j} class="usuario">
                    <div class="usuairoContenido">
                        <div class="foto"></div>
                        <span>Nombre</span>
                    </div>
                </div>
            `);
            }
            matrizU.append('<br>');
        }
    })
    // let matrizU = $(".usuariosConectados");
    // for (let i = 0; i < fil; i++) {
    //     for (let j = 0; j < col; j++) {
    //         matrizU.append(`
    //             <div id=${i}${j} class="usuario">
    //                 <div class="usuairoContenido">
    //                     <div class="foto"></div>
    //                     <span>Nombre</span>
    //                 </div>
    //             </div>
    //         `);
    //     }
    //     matrizU.append('<br>');
    // }
}