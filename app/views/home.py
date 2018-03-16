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

#recibe
@socketio.on('connect')
def connect():
	print("usuario conectado")

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
	emit('getMensajes', mensajes, broadcast=True)

#envia
@socketio.on('getMensajes')
def getMensajes():
	emit('getMensajes', mensajes, broadcast=True)

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