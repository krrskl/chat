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

#recibe
@socketio.on('connect')
def connect():
	print('usuario Conectado')

@socketio.on('iniciarChat')
def iniciarChat(profesorRe):
	profesor.append(profesorRe)
	print(profesor)

@socketio.on('iniciarSesionEst')
def iniciarSesionEst(estudiante):
	if(profesor):
		estudiantes.append(estudiante)

#envia
@socketio.on('getProfesor')
def getProfesor():
	emit('getProfesor', profesor, broadcast=True)

@socketio.on('getEstudiantes')
def getEstudiantes():
	emit('getEstudiantes', estudiantes, broadcast=True)