$(document).ready(function() {
  //Variables globales
  //Valores por defecto
  var endpoint = "http://breeze2-213.collaboratory.avaya.com/services/EventingConnector/events";
  var family = "AAAMIAETIQUETAS";
  var version = "1.0";
  //Fin de Variables globales

  //Se agrega Key para que no colisione con los datos del dominio
  var localData = localDataStorage('etiquetas.data');
  //Se obtenienen Valores de LocalStorage
  var endpoint = localData.get('endpoint_v');
  //var debugmode = localData.get('debug_v');
  console.log("Se han obtenido los valores de LocalStorage");
  console.log(endpoint);
  //console.log(debugmode);
  //Fin LocalStorage
  //Comprobación de Valores guardados
  // if (debugmode == null || debugmode == 0) {
  //   console.log("Debug Logger Desactivado");
  //   $("#output").hide();
  // } else {
  //   console.log("Debug Logger Activado");
  // }
  if (endpoint == null) {
    $('input#endpoint').val("http://breeze2-213.collaboratory.avaya.com/services/EventingConnector/events");
  } else {
    $('input#endpoint').val(endpoint);
    //$("select#debugmode").val(debugmode).change();
  }
  //Fin de Comprobación
  //Listeners botones
  //Listener Boton Ajustes
  $("#ajustes-btn").click(function() {
    $('#modal-ajustes').modal('show');
  });
  //Listener Limpiar Ajustes
  $("#limpiar-btn").click(function() {
    $('#modal-ajustes').modal('hide');
    localStorage.clear();
    $('#modal-informacion').modal({
      backdrop: 'static',
      keyboard: true,
      show: true
    });
    $("#mensaje-modal").text("Se han limpiado tus Ajustes.\nEsta página se actualizará automáticamente ");
    setTimeout(function() {
      location.reload(true);
    }, 3000);
  });
  //Listeners para formularios
  ///Ajustes
  $("#ajustes-frm").submit(function() {
   event.preventDefault();
   var datos = $("#ajustes-frm").serializeArray();
   var formData = JSON.parse(JSON.stringify(jQuery('#ajustes-frm').serializeArray()))
   console.log(datos);
   var endpoint = datos["0"].value;
   // var debugmode = datos["1"].value;
   localData.set('endpoint_v', endpoint);
   // localData.set('debug_v', debugmode);

   $('#modal-ajustes').modal('hide');
   $('#modal-informacion').modal({
                       backdrop: 'static',
                       keyboard: true,
                       show: true
               });
   $("#mensaje-modal").text("Tus ajustes se han guardado. Recargando");
   setTimeout(function() {
     location.reload(true);
   }, 5000);
 });
 ///Precio
 $("#precio-frm").submit(function() {
  btype = "AAAMIAETIQUETASPRECIO"
  event.preventDefault();
  var preciofrm = $("#precio-frm").serializeArray();
  var emailval = preciofrm["0"].value;
  var smsval = preciofrm["1"].value;
  var prodval = preciofrm["2"].value;
  var obj = "{\"email\":\""+ emailval +"\",\"sms\":\""+ smsval +"\",\"codigoProducto\":\""+prodval+"\"}";
  console.log(obj);

  postbreeze(family, btype, version, endpoint, obj)
});
///Precio
$("#descr-frm").submit(function() {
  btype1 = "AAAMIAETIQUETASDESCRIPCION";
 event.preventDefault();
 var descrfrm = $("#descr-frm").serializeArray();
 var phoneval1 = descrfrm["0"].value;
 var prodval1 = descrfrm["1"].value;
 var obj1 = "{\"mobileNumber\":\""+ phoneval1 +"\",\"productcode\":\""+ prodval1 +"\"}";
 console.log(obj);
 postbreeze(family, btype1, version, endpoint, obj1)
});

  //Fin Listeners
});
//Fin OnLoad

//Funciones
//PostBreeze
//Funciones
function postbreeze(bfamily, btype, bversion, endpoint, eventBody) {
	var data = new FormData();
	data.append("family", bfamily);
	data.append("type", btype);
	data.append("version", bversion);
	data.append("eventBody", eventBody);
	try {
		var postdata = $.ajax({
			url: endpoint,
			type: "POST",
			data: data,
			contentType: false,
			cache: false,
			processData: false,
			error: function (xhr, status, errorThrown) {
				console.log("Ha ocurrido un error: ");
				console.log(xhr.statusText + " " + xhr.status);
				alert(" Ha ocurrido un error ! ");
			},
			success: function (xhr, status, error, exception, event, options) {
				console.log("Peticion Correcta");
				console.log(status);
				console.log(xhr.statusText);
				alert(" Done ! ");
			}
		});
	} catch (err) {
		console.log(err.message);
	}
}
//Fin Post
//fin Funciones
