from app import app, socketio

if __name__ == '__main__':
    socketio.run(app, host="10.42.0.89", port=7000)