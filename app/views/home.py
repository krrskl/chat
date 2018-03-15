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

#Metodos del socket
usuarios = []
usuario = []
profesor = []

#recibe
@socketio.on('connect')
def connect():
	print('usuario Conectado')

@socketio.on('iniciarChat')
def iniciarChat(profesorRe):
	profesor.append(profesorRe)

@socketio.on('iniciarSesionEst')
def iniciarSesionEst(usuario):
	if(profesor):
		usuarios.append(usuario)

#envia

@socketio.on('respuesta')
def respuesta():
	if(profesor):
		emit('respuesta', True, broadcast=True)
	else:
		emit('respuesta', False, broadcast=True)

@socketio.on('armarMatriz')
def armarMatriz():
	emit('FyC', profesor, broadcast=True)

@socketio.on('getEstudiantes')
def getEstudiantes():
	emit('usuario', usuarios, broadcast=True)

# @socketio.on('addUsuario')
# def addUsuario(usuario):
# 	usuarios.append(usuario)
# 	emit('usuarios', usuarios, broadcast=True)

# @socketio.on('updateUsuario')
# def updateUsuario(user):
# 	for i, u in enumerate(usuarios, start=0):
# 		if u["id"] == user["id"]:
# 			usuarios[i] = user
# 			break
# 	emit('usuarios', usuarios, broadcast=True)

# @socketio.on('drawPoint')
# def drawPoint(p):
# 	points.append(p)
# 	emit('points', points, broadcast=True)