//Caja de texto de ruta del archivo
var ruta = document.getElementById("nombre_archivo");
//Botón que carga carga el archivo dado por ruta
var botonCarga = document.getElementById("cargar_archivo")
//Botón que analizará el código fuente
var botonReconocedor = document.getElementById("Reconocedor");
//Área de texto que mostrará el Mensaje del Reconocimiento 
var salidaSimbolo = document.getElementById("Mensaje")
//Área de texto que mostrará la líena de error 
var salidaError = document.getElementById("lineaError");

botonCarga.addEventListener("click", abrirArchivo);
botonReconocedor.addEventListener("click", main);

firstClick = false;
var cadenaFuente;
var index = 0; //indice dentro de la cadena fuente
var tok = new Object();
tok.nombre = "";
tok.tipo = "";

//PR de TIPO DE DATO 
var tipoDato = ['char', 'double', 'float', 'int', 'long', 'short', 'unsigned'];

//Todas las PR
var PR = ['auto','break','case','char','const','continue','default','do','double','else','enum','extern','float','for',
        'goto','if','int','long','register','return','short','signed','static','import','in','pass','cout', 'cin',
        'main','false','true','sizeof','struct','switch','typedef','unsigned','void','scanf','printf', 'gets',
        'while','function','typedef','union','signed','catch','class','delete','inline','namespace','new','private',
        'protected','public','register','template','this','throw','try','typeid','typename','using'];


//Función que carga y muestra en pantalla el archivo fuente
function validarExt() {
    var archivoInput = document.getElementById("archivo_input");
    var archivoRuta = archivoInput.value;
    var extPermitidas = /(.txt)$/i;

    if (!extPermitidas.exec(archivoRuta)) {
        alert("Asegurate de haber seleccionado un archivo txt");
        archivoInput.value = '';
        return false;
    } else {
        if (archivoInput.files && archivoInput.files[0]) {
            var visor = new FileReader();
            visor.onload = function (e) {
                document.getElementById("salida_cadena").innerHTML =
                    '<embed src="' + e.target.result + '"width="500" height="500" font-size: "100%">';
            };
            visor.readAsDataURL(archivoInput.files[0]);
        }
    }
}

const file = new XMLHttpRequest();

//Función que abre el archivo fuente, obtiene la cadena de caracteres y lo almacena en una variable
function abrirArchivo() {
    file.open('GET', ruta.value, true);
    file.send();
    file.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            cadenaFuente = this.responseText;
            alert("¡El archivo se abrió con éxito!");
        }
    }
}

function main() {
    if (!firstClick) {
        scanner();
        candidata();
        if (tok.nombre == "$") {
            salidaSimbolo.innerHTML = "    SE RECONOCIÓ EL LENGUAJE";
        } else {
            salidaSimbolo.innerHTML = "    NO SE RECONOCIÓ EL LENGUAJE";
        }
        firstClick = true;
    }
}

function ERROR() {
    tok.nombre = -1;
};

function candidata() {
    inicio();
}

function inicio() {
    declaracion();   // termina en en "$"
    siguiente();
    console.log(tok.nombre);
}

function G() {
    if (tok.tipo == "ID") {
        asignacion();
    } else if (tok.nombre == "cout") {
        output();
    } else if (tok.nombre == "if") {
        sentenciaIF();
    } else if (tok.nombre == "cin") {
        input();
    } else if (tok.nombre == "int" || tok.nombre == "float" || tok.nombre == "double") {
        declaracion();
    } else {
        ERROR();
    }
}

function siguiente() {
    if (tok.tipo == "ID" || tok.nombre == "cout" || tok.nombre == "cin" || tok.nombre == "if" || tok.nombre == "int" || tok.nombre == "float" || tok.nombre == "double") {
        G();
        siguiente();
    } else if (tok.nombre == "$") {
        //lambda
    } else {
        ERROR();
    }
}

function declaracion() {
    tipo();
    listaVar();
    if (tok.nombre == ";") {
        scanner();
    } else {
        ERROR();
    }
}

function tipo() {
    if (tok.nombre == "int") {
        scanner();
    } else if (tok.nombre == "float") {
        scanner();
    } else if (tok.nombre == "double") {
        scanner();
    } else {
        ERROR();
    }
}

function listaVar() {
    if (tok.tipo == "ID") {
        scanner();
        resto();
        X();
    } else {
        ERROR();
    }
}

function X() {
    if (tok.nombre == ",") {
        scanner();
        listaVar();
    } else if (tok.nombre == ";") {
        //lambda
    } else {
        ERROR();
    }
}

function resto() {
    if (tok.nombre == "=") {
        scanner();
        if (tok.tipo == "NUM") {
            scanner();
        } else {
            ERROR();
        }
    } else if (tok.nombre == ",") {
        //lambda
    } else {
        ERROR();
    }
}

function input() {
    if (tok.nombre == "cin") {
        scanner();
        if (tok.nombre == ">>") {
            scanner();
            if (tok.tipo == "ID") {
                scanner();
                S();
                if (tok.nombre == ";") {
                    scanner();
                } else {
                    ERROR();
                }
            } else {
                ERROR();
            }
        } else {
            ERROR();
        }
    } else {
        ERROR();
    }
}

function S() {
    if (tok.nombre == ">>") {
        scanner();
        //ERROR
        if (tok.tipo == "ID") {
            scanner();
            S();
        } else {
            ERROR();
        }
    } else if (tok.nombre == ";") {
        //lambda
    } else {
        ERROR();
    }
}

function asignacion() {
    if (tok.tipo == "ID") {
        scanner();
        //ERROR
        if (tok.nombre == "=") {
            scanner();
            expresion();
            if (tok.nombre == ";") {
                scanner();
            } else {
                ERROR();
            }
        } else {
            ERROR();
        }
    } else {
        ERROR();
    }
}

function A() {
    if (tok.nombre == "+" || tok.nombre == "-" || tok.nombre == "*" || tok.nombre == "/") {
        OP();
        operando();
        A();
    } else if (tok.nombre == ";") {
        //lambda
    } else {
        ERROR();
    }
}

function expresion() {
    operando();
    A();
}

function operando() {
    if (tok.tipo == "ID") {
        scanner();
    } else if (tok.tipo == "NUM") {
        scanner();
    } else {
        ERROR();
    }
}

function OP() {
    if (tok.nombre == "+") {
        scanner();
    } else if (tok.nombre == "-") {
        scanner();
    } else if (tok.nombre == "*") {
        scanner();
    } else if (tok.nombre == "/") {
        scanner();
    } else {
        ERROR();
    }
}

function output() {
    if (tok.nombre == "cout") {
        scanner();
        if (tok.nombre == "<<") {
            scanner();
            if (tok.tipo == "ID") {
                scanner();
                W();
                if (tok.nombre == ";") {
                    scanner();
                } else {
                    ERROR();
                }
            } else {
                ERROR();
            }
        } else {
            ERROR();
        }
    } else {
        ERROR();
    }
}

function W() {
    if (tok.nombre == "+" || tok.nombre == "-" || tok.nombre == "*" || tok.nombre == "/") {
        OP();
        operando();
        W();
    } else if (tok.nombre == ";") {
        //lambda
    } else {
        ERROR();
    }
}

function sentenciaIF() {
    if (tok.nombre == "if") {
        scanner();
        if (tok.nombre == "(") {
            scanner();
            condicion();
            if (tok.nombre == ")") {
                scanner();
                if (tok.nombre == "{") {
                    scanner();
                    operacion();
                    if (tok.nombre == "}") {
                        scanner();
                        Z();
                    } else {
                        ERROR();
                    }
                } else {
                    ERROR();
                }
            } else {
                ERROR();
            }
        } else {
            ERROR();
        }
    } else {
        ERROR();
    }
}

function Z() {
    if (tok.nombre == "else") {
        scanner();
        if (tok.nombre == "{") {
            scanner();
            operacion();
            if (tok.nombre == "}") {
                scanner();
            } else {
                ERROR();
            }
        } else {
            ERROR();
        }
    } else if (tok.nombre == "}" || tok.nombre == "$" || tok.nombre == "cout") {
        //lambda
    } else {
        ERROR();
    }
}

function condicion() {
    operando();
    comparador();
    operando();
}

function comparador() {
    if (tok.nombre == "<") {
        scanner();
    } else if (tok.nombre == ">") {
        scanner();
    } else if (tok.nombre == "==") {
        scanner();
    } else if (tok.nombre == "!=") {
        scanner();
    } else if (tok.nombre == ">=") {
        scanner();
    } else if (tok.nombre == "<=") {
        scanner();
    } else {
        ERROR();
    }
}

function continua() {
    if (tok.tipo == "ID" || tok.nombre == "cout" || tok.nombre == "cin") {
        operacion();
    } else if (tok.nombre == "if") {
        sentenciaIF();
    } else if (tok.nombre == "}") {
        //lambda
    } else {
        ERROR();
    }
}

function operacion() {
    R();
    continua();
}

function R() {
    if (tok.tipo == "ID") {
        asignacion();
    } else if (tok.nombre == "cout") {
        output();
    } else if (tok.nombre == "cin") {
        input();
    } else {
        ERROR();;
    }
}

//Imprime la linea de error
/*function imprimeError(i){ 
    if(tok.nombre!="$"){
        do{
            scanner();
            linea = linea+" "+tok.nombre; 
        }while(tok.nombre!=";");
    }
    if(tok.nombre=="$") i++;
    salidaSimbolo.innerHTML = "\tError en la linea "+i;
    salidaError.innerHTML = linea;    
}*/

//Funcíon que realiza el Análisis Lexicográfico.
function scanner() {

    tok.nombre = "";
    tok.tipo = "";

    //Ignorar espacios en blanco
    while (cadenaFuente.charAt(index) == ' ') {
        index++;
    }

    //Ignorar saltos de línea
    while (cadenaFuente.charAt(index + 1) == '\n') {
        index = index + 2;
    }
    //Ignorar espacios en blanco después de un salto de línea
    while (cadenaFuente.charAt(index) == ' ') {
        index++;
    }
    //Ignorar comentarios de una línea
    if (cadenaFuente.charAt(index) == "/" && cadenaFuente.charAt(index + 1) == "/") {
        index = index + 2;
        while (cadenaFuente.charAt(index) != '\n') {
            index++;
        }
        index++;
        while (cadenaFuente.charAt(index) == ' ') {
            index++;
        }
    }
    //Ignorar comentarios de más de una línea
    if (cadenaFuente.charAt(index) == "/" && cadenaFuente.charAt(index + 1) == "*") {
        index = index + 2;
        while (cadenaFuente.charAt(index) != '*' && cadenaFuente.charAt(index + 1) != '/') {
            index++;
        }
        index = index + 4;
        while (cadenaFuente.charAt(index) == ' ') {
            index++;
        }
    }

    var c = cadenaFuente.charAt(index);

    if (index >= cadenaFuente.length) {
        c = "$"; //Fin de cadena
    }

    if (c >= 'a' && c <= 'z') { //Letra --> (cadena - identificador - palabra reservada)
        while ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')) { //si es letra o dígito
            tok.nombre = tok.nombre + c;
            index++;
            c = cadenaFuente.charAt(index);
        }
        var estado = false;

        //Realizar busqueda en el arreglo de 'PR' y clasificar
        PR.forEach(function (palabra) {
            if (palabra == tok.nombre)
                estado = true;
        });
        if (estado == true) {
            tok.tipo = "PR"; //Tipo 'Palabra Reservada'
        } else {
            tok.tipo = "ID"; //Tipo 'identificador'
        }
    } else if (c >= '0' && c <= '9' || c == ".") {  //Números --> (entero - real)
        while (c >= '0' && c <= '9' || c == '.') {
            tok.nombre = tok.nombre + c;
            index++;
            c = cadenaFuente.charAt(index);
        }
        tok.tipo = "NUM"; //Tipo 'Número'

    } else if (c == ',' || c == '(' || c == ')' || c == '=' || c == '*' || c == '/' || c == '-' || c == '+' ||
        c == '<' || c == '>' || c == ';' || c == '{' || c == '}' || c == '[' || c == ']' || c == '.' ||
        c == '%' || c == '^' || c == '&' || c == '|' || c == '_' || c == '!') { //Operador (agrupación - aritmético - lógico)

        tok.nombre = c;

        if ((c == '-' && cadenaFuente.charAt(index + 1) == '-') ||
            (c == '+' && cadenaFuente.charAt(index + 1) == '+') ||
            (c == '<' && cadenaFuente.charAt(index + 1) == '=') ||
            (c == '<' && cadenaFuente.charAt(index + 1) == '>') ||
            (c == '>' && cadenaFuente.charAt(index + 1) == '=') ||
            (c == '=' && cadenaFuente.charAt(index + 1) == '=') ||
            (c == '!' && cadenaFuente.charAt(index + 1) == '=') ||
            (c == '&' && cadenaFuente.charAt(index + 1) == '&') ||
            (c == '|' && cadenaFuente.charAt(index + 1) == '|') ||
            (c == '*' && cadenaFuente.charAt(index + 1) == '=') ||
            (c == '/' && cadenaFuente.charAt(index + 1) == '=') ||
            (c == '%' && cadenaFuente.charAt(index + 1) == '=') ||
            (c == '+' && cadenaFuente.charAt(index + 1) == '=') ||
            (c == '-' && cadenaFuente.charAt(index + 1) == '=') ||
            (c == '^' && cadenaFuente.charAt(index + 1) == '=') ||
            (c == '<' && cadenaFuente.charAt(index + 1) == '<') ||
            (c == '>' && cadenaFuente.charAt(index + 1) == '>')) {
            tok.nombre = tok.nombre + cadenaFuente.charAt(index + 1);
            index++;
        }
        index++;
        tok.tipo = "OP" //Tipo 'Operador'
    } else if (c == '$') { //Fin de cadena
        tok.nombre = c;
        tok.tipo = 'Fin de cadena'
    }
}