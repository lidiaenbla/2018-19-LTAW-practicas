var http = require('http');
var url = require('url');
var fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const PORT = 8000


console.log("Arrancando servidor en puerto " + PORT + "...\n")

// Configurar y lanzar el servidor
http.createServer((req, res) => {

  if(req.url.indexOf("favicon.ico") > 0){return;} //para que no nos influya la petición del favicon
  // Parsear la URL
  var q = url.parse(req.url, true)
  //console.log("Recurso solicitado (URL): " + req.url)
  //console.log("URL parseada: ")
  //console.log("   Host: " + q.host)
  //console.log("   Path Name:" + q.pathname)

  // Leer las cookies
  var cookie = req.headers.cookie;
  //console.log("Cookie: " + cookie)

  // Obtener la ruta del fichero
  var filepath = q.pathname
  console.log("FILEPATH ------>" ,filepath);

  // Petición de compra
  if (filepath.includes("cart")) {

    var content = ""
    var emptycart = true;

    if (!cookie) {
      mensaje = "<p>Accede a LOGIN para registrarte.</p>";
      content = crearHtml(mensaje, 5);
      res.statusCode = 404;
    } else {
      if (cookie.includes("cart")){
        emptycart = false;
      }
      console.log(cookie);
      switch (filepath) {

        case "/cart_tw":

            cookie = crearCookie(cookie, emptycart, 'Pluma_tw 50%');
            res.setHeader('Set-Cookie', cookie)
            res.statusCode = 200;
            mensaje = "<li><h6>pluma TWSBI</h6></li>";
            content = crearHtml(mensaje, 4);
            console.log("GET 200 OK resource: " + "cart_tw");
            break;

        case "/cart_tom":

            cookie = crearCookie(cookie, emptycart, 'Pluma_tom 50%');
            res.setHeader('Set-Cookie', cookie)
            res.statusCode = 200;
            mensaje = "<li><h6>pluma TOMBOW</h6></li>";
            content = crearHtml(mensaje, 4);
            console.log("GET 200 OK resource: " + "cart_tom");
            break;

        case "/cart_fc":
            cookie = crearCookie(cookie, emptycart, 'Pluma_fc 50%');
            res.setHeader('Set-Cookie', cookie)
            res.statusCode = 200;
            mensaje = "<li><h6>pluma FRANKLIN COVEY</h6></li>";
            content = crearHtml(mensaje, 4);
            console.log("GET 200 OK resource: " + "cart_fc");
            break;

        case "/cart.html":
          if (emptycart) {
            content = "Aun no se han agregado productos.";
            res.statusCode = 404;
          } else {
              carrito = "<li><h6>"
                carrito += cookie.split("cart=")[1]
                //console.log("CARRITO-->", carrito);
                while (carrito.includes("&") || carrito.includes("_") || carrito.includes("%")){
                  carrito = carrito.replace("&","</h6></li><li><h6><br>");
                  carrito = carrito.replace("_"," ");
                  carrito = carrito.replace("%","€");
                }
                content = crearHtml(carrito, 1);
                res.statusCode = 200;
                console.log("GET 200 OK resource: " + "./cart.html");
          }
        break;

        case "/cart_form":
          if (req.method === 'POST') {

            req.on('data', chunk => {
              data = "<li><h6>"
              data += chunk.toString();
              //console.log("DATOS ----->", data);

              while (data.includes("&") || data.includes("_") || data.includes("=") || data.includes("+") ||
                     data.includes("%40")) {
                data = data.replace("&", "</h6></li><li><h6><br>");
                data = data.replace("_", " ");
                data = data.replace("=", ": ");
                data = data.replace("+", " ");
                data = data.replace("%40", "@");
              }
              content = crearHtml(data, 2);
              res.statusCode = 200;
            });

            req.on('end', ()=> {
              console.log("GET 200 OK resource: " + filepath);
              res.setHeader('Content-Type', 'text/html')
              res.write(content);
              res.end();
            })
            return
          }
          break;

        // Procesar formulario
        case "/cart_search_form":
          if (req.method === 'POST') {

            req.on('data', chunk => {

              data = chunk.toString();
              data = data.split("=")[1];
              console.log("DATOS BUSCAR ---->", data);
              data += search_analyze(data);
              console.log("DATAAAA ENCONTRADO------>", data);
              content = crearHtml(data, 3);
              console.log("Datos recibidos: " + data);
              res.statusCode = 200;
            });

            req.on('end', ()=> {
              console.log("POST 200 OK resource: " + filepath);
              res.setHeader('Content-Type', 'text/html');
              res.write(content);
              res.end();
            })
            return
          }
          break;
        default:
          content = "404 Not Found";
          res.statusCode = 404;
      }
    }
    res.setHeader('Content-Type', 'text/html')
    res.write(content);
    res.end();

  } else if (filepath == "/myquery") {
      content = `
      {
        "productos": ["Pluma_tw", "Pluma_fc", "Pluma_tom"]
      }
      `
      res.setHeader('Content-Type', 'application/json')
      res.write(content);
      res.end();

  } else if (filepath == "/client.js") {
    filetype = filepath.split(".")[1]
    filepath = "./" + filepath
    fs.readFile(filepath, function(err, data) {
      res.writeHead(200, {'Content-Type': "application/javascript"});
      res.write(data);
      res.end();
    });

  } else {
    switch (filepath) {
      case "/":
        filepath = "/index.html"
        break;
      // Login
      case "/login.html":
        cookie = 'user=Usuario'
        res.setHeader('Set-Cookie', cookie)
        break;
    }

    filetype = filepath.split(".")[1]
    filepath = "./" + filepath
    //console.log("Ruta del fichero: " + filepath)
    //console.log("Tipo de fichero: " + filetype + "\n")

    // Leer el fichero solicitado
    fs.readFile(filepath, function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      } else {
        console.log("GET 200 OK resource: " + filepath);
        // Generar el mensaje de respuesta
        res.writeHead(200, {'Content-Type': "text/html"});
        res.write(data);
        res.end();
      }
    });
  }

}).listen(PORT);

function crearCookie(cookie, emptycart, cadena) {

  if (!emptycart) {
    cookie = cookie.split("Usuario;")[1]
    cookie += "&"
  } else {
    cookie = "cart="
  }
  cookie += cadena
  return cookie;
}


function crearHtml(datos, opcion){
  var html = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <style type="text/css">
        div {
          border: 1px solid gray;
          padding: 8px;
        }
        h6 {
          text-align: left;
          line-height: 0pt;
          text-transform: uppercase;
          letter-spacing: 10px;
          color: #424149;
          font-family: "Arial";
        }
        h1 {
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 20px;
          color: #4CAF50;
          font-family: "Arial";
        }
        p {
          text-indent: 0px;
          text-align: justify;
          letter-spacing: 3px;
          font-family: "Arial";
        }
        a {
          text-decoration: none;
          color: #b0aef1;
        }
        .button {
            background-color: #4CAF50; /* Green */
            border: none;
            color: white;
            padding: 4px 14px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            margin: 4px 2px;
            cursor: pointer;
          }
        .w3-button:hover{color:#000!important;background-color:#ccc!important}
        .w3-block{display:block;width:100%}
        .w3-black,.w3-hover-black:hover{color:#fff!important;background-color:#000!important}
      </style>
      </head>
      <body>`
      if (opcion == 1){ //CARRITO
            html +=
                    `
                          <h1>Carrito de la compra</h1>
                          <div>
                          <ul>

                      `
             html += datos;
             html +=
                        `
                          </ul>
                          </div>
                          <br>
                          <br>
                          <div>
                          <p>Rellena tus datos para realizar la compra:</p>
                          <form action="/cart_form" method="post">
                            <table>
                              <tr>
                              <p><td><h6>Nombre:</h6></td><td><input type="text" size="40" name="Nombre"/> <br /></td></p>
                              </tr>
                              <tr>
                              <p><td><h6>Apellidos:</h6></td><td><input type="text" size="40" name="Apellidos"/> <br /></td></p>
                              </tr>
                              <tr>
                              <p><td><h6>Correo electrónico:</h6></td><td><input type="text" size="40" name="Email"/> <br /></td></p>
                              </tr>
                              <tr>
                              <p><td><h6>Método de pago:</h6></td><td><input type="text" size="40" name="Metodo_pago"/> <br /></td></p>
                              </tr>
                            </table>
                            <button type="submit" class="button">Enviar</button>
                          </form>
                          </div>
                        </body>
                      </html>
                      `
          }
          else if (opcion == 2) {
            html += `
                <h1>Detalles de la compra</h1>
                <p>La compra se ha realizado con éxito</p>
                <div>
                <ul>`
                    html += datos;
                    html += `
                      </ul>
                      </div>
                      <a href="/">Volver</a>
                    </body>
                  </html>`

          }
          else if (opcion == 3) {
            html += `
                  <p>Producto a buscar: `
            html += datos;
            html +=
            `
                  </p>
                  <a href="/">Volver a la página principal</a>
                </body>
              </html>
              `

          }
          else if (opcion == 4) {
            html += `
                <h1></h1>
                <p>Producto añadido al carrito:</p>
                <div>
                <ul>`
                    html += datos;
                    html += `
                      </ul>
                      </div>
                      <a href="/">Volver</a>
                    </body>
                  </html>`
          }
          else if (opcion == 5) {
            html += `
                <h1></h1>
                <p>ERROR</p>
                <div>`
                    html += datos;
                    html += `
                      </div>
                      <a href="/">Volver</a>
                    </body>
                  </html>`
          }
      return html;
}

function search_analyze(data)
{
  console.log("CLIENTE JS -->", data)
  m = new XMLHttpRequest();
  var html = "";
  m.open("GET","http://localhost:8000/myquery", true);
  m.onreadystatechange=function(){
    if (m.readyState==4 && m.status==200){
      var o = JSON.parse(m.responseText);
      console.log("OOOOOOOOO---->",o);
      for (i=0; i < o.productos.length; i++) {

        if (data == o.productos[i].toString()) {
          html += o.productos[i];
          if (i<o.productos.length-1) {
            html += ', ';
          }
        }
        if (i=o.productos.length-1) {
          console.log("aquii");
          html += 'No se han encontrado resultados.';
        }
      }
    }
  }
  return html;
}
