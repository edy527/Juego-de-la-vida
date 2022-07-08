/* juego de la vida conway */

var canvas;
var ctx;
var fps = 30;

var canvasX = 500;
var canvasY = 500;

var tileX, tileY;


// Variables relacionadas con el juego
var tablero;
var filas = 100
var columnas = 100;

var blanco = '#FFFFFF';
var negro = '#000000';


var objeto = [0,0,0,0,0]


function creaArray2D(f,c){
    var obj = new Array(f);
    for(var i = 0; i < c; i++){
        obj[i] = new Array(c);
    }
    return obj;

}

var Agente = function(x, y, estado){    
    this.x = x;
    this.y = y;
    this.estado = estado; //vivo = 1, muerto = 2
    this.estadoProx = this.estado; // estado que tendrá el siguiente ciclo

    this.vecinos = []  // guardamos un listado de los vecinos

    //Metodo que añade los vecinos del objeto
    this.addVecinos = function(){
        var xVecino;
        var yVecino;
        for(i = -1; i < 2; i++){
            for(j = -1; j < 2; j++){

                xVecino = (this.x + j + columnas) % columnas;
                yVecino = (this.y + i + filas) % filas;

                if(i!= 0 || j != 0){
                    this.vecinos.push(tablero[yVecino] [xVecino]);
                }

                
            }
        }
    }

    this.dibuja = function(){
        var color
        if(this.estado == 1){
            color = blanco;
            
        }
        else{
            color = negro
        }
        ctx.fillStyle = color;
        ctx.fillRect( this.x * tileX, this.y * tileY, tileX, tileY )
    }

    //Programamos las leyes de Conway

    this.nuevoCiclo = function(){
        var suma = 0;

        //calculamos la cantidad de vecinos vivos
        for(i = 0; i < this.vecinos.length; i++){
            suma += this.vecinos[i].estado;
        }
        // Aplicamos las normas de Conway
        this.estadoProx = this.estado;

        //MUERTE: si tiene menos de 2 vecinos vivos, o más de 3 vivos
        if(suma < 2 || suma > 3){
            this.estadoProx = 0;
        }
        //VIDA/REPRODICCION tiene exactamente 3 vecinos vivos   
        if(suma == 3 ){
            this.estadoProx = 1;
        }
    }

    this.mutacion = function(){
        this.estado = this.estadoProx;
    }

}




function inicializaTablero(obj){
    var estado;
    for(y = 0; y < filas; y++){
        for(x = 0; x < columnas; x++){
            estado = Math.floor(Math.random() * 2);
            obj[y][x] = new Agente(x, y, estado);
        }
    }

    for(y = 0; y < filas; y++){
        for(x = 0; x < columnas; x++){
            obj[y][x].addVecinos();
        }
    }
}


function inicializa() {
    canvas = document.getElementById('pantalla');
    ctx = canvas.getContext('2d');

    canvas.width = canvasX;
    canvas.height = canvasY;

    // calculamoms tamaño tiles

    tileX = Math.floor(canvasX / filas);
    tileY = Math.floor(canvasY / columnas);

    //creamos el tablero
    tablero = creaArray2D(filas,columnas);

    inicializaTablero(tablero);

    //ejecutamos el bucle principal
    setInterval(function(){
        principal()
    }, 1000/fps); 
    
}

function dibujaTablero(obj){

    //DIBUJA LOS AGENTES
    for(y = 0; y < filas; y++){
        for(x = 0; x < columnas; x++){
            obj[y][x].dibuja();
        }
    }

    //CALCULA EL SIGUIENTE CICLO
    for(y = 0; y < filas; y++){
        for(x = 0; x < columnas; x++){
            obj[y][x].nuevoCiclo();
        }
    }
    //APLICA LA MUTACION
    for(y = 0; y < filas; y++){
        for(x = 0; x < columnas; x++){
            obj[y][x].mutacion();
        }
    }
}

function borraCanvas(){
    canvas.width = canvas.width;
    canvas.height = canvas.height;
}

function principal(){
    borraCanvas();
    dibujaTablero(tablero);
}
