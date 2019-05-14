function search_analyze()
{
  var search_bar = document.getElementById("search_bar")
  search_bar = search_bar.value

  //-- Crear objeto para hacer peticiones AJAX
  m = new XMLHttpRequest();

  //-- Configurar la petición
  m.open("GET","http://localhost:8000/myquery", true); //"base de datos"

  m.onreadystatechange=function(){
    if (m.readyState==4 && m.status==200){
      var o = JSON.parse(m.responseText) // respuesta

      resultado.innerHTML = "";
      for (i=0; i < o.productos.length; i++) {
        if (search_bar == "Yam") {
          resultado.innerHTML += o.productos[i];
          if (i<o.productos.length-1) {
            resultado.innerHTML += ', ';
          }
        }
      }
    }
  }

  //-- Enviar la petición!
  m.send();
}
