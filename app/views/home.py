from flask import render_template, request
from flask_socketio import emit, disconnect
from app import app, socketio

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/chat')
def chat():
	return render_template('chat.html')

@app.route('/iniciarSesion')
def iniciarSesion():
	return render_template('iniEstudiante.html')

estudiantes = []
profesor = []
mensajes = []
encuesta = []
respuestas = []

#recibe
@socketio.on('connect')
def connect():
	print("usuario conectado")


@socketio.on('disconnect')
def disconnect():
	print("usuario desconectado")


@socketio.on('cerrarSesion')
def cerrarSesion(est):
	if est in estudiantes:
		estudiantes.remove(est)
	emit('desconectado',est['nombre'], broadcast=True)
	emit('getEstudiantes', estudiantes, broadcast=True)

@socketio.on('iniciarChat')
def iniciarChat(profesorRe):
	profesor.append(profesorRe)

@socketio.on('iniciarSesionEst')
def iniciarSesionEst(estudiante):
	if(profesor):
		emit('nuevoEstudiante', estudiante['nombre'], broadcast=True)
		estudiantes.append(estudiante)

@socketio.on('nuevoMensaje')
def nuevoMensaje(mensaje):
	mensajes.append(mensaje)
	#envia de una
	emit('getMensajes', mensajes, broadcast=True)

@socketio.on('nuevaEncuesta')
def nuevaEncuesta(encuestaRec):
	encuesta.append(encuestaRec)

@socketio.on('respuesta')
def respuesta(respuestaRec):
	respuestas.append(respuestaRec)

#envia
@socketio.on('getMensajes')
def getMensajes():
	emit('getMensajes', mensajes, broadcast=True)

@socketio.on('getRespuestas')
def getRespuestas():
	emit('getRespuestas', respuestas)

@socketio.on('verEncuesta')
def verEncuesta():
	if(encuesta):
		emit('verEncuesta', True)
	else:
		emit('verEncuesta', False)

@socketio.on('getEncuesta')
def getEncuesta():
	emit('getEncuesta', encuesta[len(encuesta)-1])

@socketio.on('getEncuestaPro')
def getEncuestaPro():
	if(encuesta):
		emit('getEncuestaPro', encuesta[len(encuesta)-1])

@socketio.on('escribiendo')
def escribiendo(estudiante):
	emit('escribiendo', estudiante, broadcast=True)

@socketio.on('getProfesor')
def getProfesor():
	emit('getProfesor', profesor, broadcast=True)

@socketio.on('getEstudiantes')
def getEstudiantes():
	emit('getEstudiantes', estudiantes, broadcast=True)

@socketio.on('getUltimoEstudiante')
def getUltimoEstudiante():
	if(estudiantes):
		emit('usuarioActual',estudiantes[len(estudiantes)-1])
	else:
		emit('usuarioActual',profesor[len(profesor)-1])