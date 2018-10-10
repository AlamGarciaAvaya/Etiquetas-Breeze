$(document).ready(function() {



  //Variables globales
  //Valores por defecto
  var endpoint = "https://breeze2-213.collaboratory.avaya.com/services/EventingConnector/events";
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
    $('input#endpoint').val("https://breeze2-213.collaboratory.avaya.com/services/EventingConnector/events");
  } else {
    $('input#endpoint').val(endpoint);
    //$("select#debugmode").val(debugmode).change();
  }
  //Fin de Comprobación
  //Validacion E164
  var input = document.querySelector("#inputsms-txt"),
    errorMsg = document.querySelector("#error-msg"),
    validMsg = document.querySelector("#valid-msg");
    var input2 = document.querySelector("#inputsms2-txt"),
      errorMsg2 = document.querySelector("#error-msg2"),
      validMsg2 = document.querySelector("#valid-msg2");

  // here, the index maps to the error code returned from getValidationError - see readme
  var errorMap = ["Número no válido", "Código de País Incorrecto", "Muy Corto", "Muy largo", "Número Inválido"];

  // initialise plugin
  var iti = window.intlTelInput(input, {
    preferredCountries: ["us", "mx"],
    hiddenInput: "full_phone",
    initialCountry: "auto",
    geoIpLookup: function(callback) {
      $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
        var countryCode = (resp && resp.country) ? resp.country : "";
        callback(countryCode);
      });
    },
    nationalMode: true,
    utilsScript: "js/utils.js"
  });

  var iti2 = window.intlTelInput(input2, {
    hiddenInput: "full_phone2",
    initialCountry: "auto",
    geoIpLookup: function(callback) {
      $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
        var countryCode = (resp && resp.country) ? resp.country : "";
        callback(countryCode);
      });
    },
    nationalMode: true,
    utilsScript: "js/utils.js"
  });

  var reset = function() {
    input.classList.remove("error");
    input2.classList.remove("error");
    errorMsg.innerHTML = "";
    errorMsg.classList.add("hide");
    validMsg.classList.add("hide");

    errorMsg2.innerHTML = "";
    errorMsg2.classList.add("hide");
    validMsg2.classList.add("hide");
  };

  // on blur: validate
  input.addEventListener('blur', function() {
    reset();
    if (input.value.trim()) {
      if (iti.isValidNumber()) {
        validMsg.classList.remove("hide");
        console.log(iti.getNumber());
        $("input#intnumber-txt").val(iti.getNumber());
        $("#submit-frm1").removeAttr('disabled');
      } else {
        input.classList.add("error");
        var errorCode = iti.getValidationError();
        errorMsg.innerHTML = errorMap[errorCode];
        errorMsg.classList.remove("hide");
        $("input#intnumber-txt").val('');
        $("input#intnumber-txt").prop("disabled", true);

      }
    }
  });

  input2.addEventListener('blur', function() {
    reset();
    if (input2.value.trim()) {
      if (iti2.isValidNumber()) {
        validMsg2.classList.remove("hide");
        console.log(iti2.getNumber());
        $("input#intnumber2-txt").val(iti2.getNumber());
        $("#submit-frm2").removeAttr('disabled');
      } else {
        input2.classList.add("error");
        var errorCode = iti2.getValidationError();
        errorMsg2.innerHTML = errorMap[errorCode];
        errorMsg2.classList.remove("hide");
        $("input#intnumber-txt2").val('');
        $("input#intnumber-txt2").prop("disabled", true);

      }
    }
  });

  // on keyup / change flag: reset
  input.addEventListener('change', reset);
  input.addEventListener('keyup', reset);

  input2.addEventListener('change', reset);
  input2.addEventListener('keyup', reset);

  //FIN Validacion


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
    console.log(preciofrm);
    var emailval = preciofrm["0"].value;
    var smsval = preciofrm["1"].value;
    var prodval = preciofrm["2"].value;
    var obj = "{\"email\":\"" + emailval + "\",\"sms\":\""+ smsval +"\",\"codigoProducto\":\"" + prodval + "\"}";
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
    var obj1 = "{\"mobileNumber\":\""+ phoneval1 +"\",\"productcode\":\"" + prodval1 + "\"}";
    console.log(descrfrm);
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
      error: function(xhr, status, errorThrown) {
        console.log("Ha ocurrido un error: ");
        console.log(xhr.statusText + " " + xhr.status);
        alert(" Ha ocurrido un error ! ");
      },
      success: function(xhr, status, error, exception, event, options) {
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
