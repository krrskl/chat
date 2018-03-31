class Estudiante():
    def __init__(self,nombre,fila,columna):
        self.nombre = nombre
        self.fila = fila
        self.columna = columna

    def getNombre(self):
        return self.nombre

    def getFila(self):
        return self.fila
    
    def getColumna(self):
        return self.columna