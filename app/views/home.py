from flask import render_template, request
from flask_socketio import emit, disconnect
from app import app, socketio

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/chat')
def chat():
	return render_template('chat.html')

#Metodos del socket
usuarios = []
usuario = []
profesor = []

@socketio.on('connect')
def connect():
	print('usuario Conectado')

@socketio.on('iniciarChat')
def iniciarChat(profesorRe):
	profesor.append(profesorRe)

@socketio.on('armarMatriz')
def armarMatriz():
	emit('FyC', profesor, broadcast=True)

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