var carrito = [];
var productos = [];
var total = 0;
var local = window.localStorage;
function sumarValor() {
	var valor = $("#txtCantidad").val();
	valor = parseInt(valor);
	var resultado = valor+1;
	$("#txtCantidad").val(resultado);
}

function restarValor() {
	var resultado
	var valor = $("#txtCantidad").val();
	valor = parseInt(valor);
	if(valor <= 0)
	{
		resultado = 0;
	}else
	{
		resultado = valor-1;
	}
	$("#txtCantidad").val(resultado);
}

function getApi()
{
   $.ajax({
            url: "/productos",
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            success: function(resultData) {
               console.log(resultData);
            	var cadena = '<option value="-1">Selecciona un producto</option>';
               productos = resultData;
            	for (var i = 0; i < resultData.length; i++) 
               	{	
               		var data = JSON.parse(JSON.stringify(resultData[i]));
               		cadena += '<option value="'+data.id+'">'+data.nombre+' '+data.precio+'$</option>';
               	}
               	$("#slctGalleta").html(cadena);
            },
            error : function(jqXHR, textStatus, errorThrown) {
            	console.log("Error");
            },
            timeout: 120000,
        });
}

function addCarrito()
{
   var x = $('#slctGalleta').val();
   var cantidad = $('#txtCantidad').val();
   x = x-1;
   var valor = -1;
   if(x == -1)
   {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Selecciona un item de la lista',
      })
      return 1;
   }
   if(carrito.length > 0)
   {
       console.log(carrito);
       console.log(productos);
       for (var i = 0; i < carrito.length; i++) {
         if(carrito[i].id == productos[x].id)
         {
            valor = i;
            break;
         }
      }
      if(valor != -1)
      {
         var l = parseInt(carrito[valor].cantidad);
         var suma = l+parseInt(cantidad);
         console.log(suma);
         carrito[valor].cantidad = suma;
      }else{
         productos[x].cantidad = cantidad;
         carrito.push(productos[x]);
      }
      
   }else
   {
      productos[x].cantidad = cantidad;
      carrito.push(productos[x]);
   }
   this.actualizarTabla();
}

function actualizarTabla()
{
   var salida = '';
   for (var i = 0; i < carrito.length; i++)
   {
      salida += '<tr>';
      salida += '<td>'+carrito[i].nombre+'</td>';
      salida += '<td>'+carrito[i].cantidad+'</td>';
      salida += '<td>'+carrito[i].precio+'</td>';
      salida += '<td>'+calcularSub(carrito[i].precio,carrito[i].cantidad)+'</td>';
      salida += '<td><button type="button" class="btn-floating btn-lg btn-default" onclick="restarCarrito('+i+')"><i class="fa fa-minus"></i></button><button type="button" class="btn-floating btn-lg btn-default" onclick="sumarCarrito('+i+')"><i class="fa fa-plus"></i></button><button type="button" class="btn-floating btn-lg btn-default" onclick="eliminarCarrito('+i+')"><i class="fa fa-trash"></i></button></td>';
      salida += '</tr>';
   }
   $("#tableVenta").html(salida);
   this.calcularTotal();
   $('#txtCantidad').val(1);
}
function calcularSub(val,val2){
   return val*val2;
}

function calcularTotal()
{
   total = 0;
   if(carrito.length > 0)
   {
      for (var i = 0; i < carrito.length; i++)
      {
         total += calcularSub(carrito[i].precio,carrito[i].cantidad);
      }
      if(total > 0)
      {
         $("#txtTotal").text("Total: "+total+"$");
      }else $("#txtTotal").text("Total: 0$");
   }else{
      $("#txtTotal").text("Total: 0$");
   } 
}

function eliminarCarrito(id)
{
   carrito.splice(id,1);
   this.actualizarTabla();
}

function sumarCarrito(id)
{
   carrito[id].cantidad++;
   this.actualizarTabla();
}

function restarCarrito(id)
{
   carrito[id].cantidad--;
   if(carrito[id].cantidad <= 0)
   {
      this.eliminarCarrito(id);
   }
   this.actualizarTabla();
}

function guardarCarrito()
{
   var nombre = $('#nombre').val();
   if(nombre == '' || nombre == ' ')
   {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Agrega el nombre a la compra',
      })
      return 1;
   }
   if(carrito.length <= 0)
   {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No has agregado ningun objeto al carrito',
      })
      return 1;
   }
   var title ="Ticket";
   carrito.comprador = nombre;
   console.log(carrito);
   let mywindow = window.open('', 'PRINT', 'height=600,width=600,top=50,left=50');
   var escribir = '<html><head><title>Ticket</title>';
   escribir +=  '</head><body>';
   escribir +=  '<img src="static/images/images.png" alt="Girl in a jacket" width="100" height="100">';
   escribir +=  '<h1>'+carrito.comprador+'</h1>';
   escribir +=  '<table><thead>';
   escribir +=  '<tr>';
   escribir +=  '<td>Nombre</td>';
   escribir +=  '<td>Cantidad</td>';
   escribir +=  '<td>Precio</td>';
   escribir +=  '<td>Subtotal</td>';
   escribir +=  '</tr>';
   escribir +=  '</thead>'; 
   escribir +=  '<tbody>'; 
   for (var i = 0; i < carrito.length; i++) {
      escribir +=  '<tr>';
      escribir +=  '<td>'+carrito[i].nombre+'</td>';
      escribir +=  '<td>'+carrito[i].cantidad+'</td>';
      escribir +=  '<td>'+carrito[i].precio+'</td>';
      escribir +=  '<td>'+calcularSub(carrito[i].precio,carrito[i].cantidad)+'</td>';
      escribir +=  '</tr>';
   }
   escribir +=  '</tbody></table>';
   escribir += '<h1>Total:'+total+'</h1>';
   escribir +=  '</body></html>';
   mywindow.document.write(escribir);
   mywindow.document.close(); // necessary for IE >= 10
   mywindow.focus(); // necessary for IE >= 10*/

   mywindow.print();
   mywindow.close();
   carrito = [];
   this.actualizarTabla();
}

function eliminarCarrito()
{
   carrito = [];
   this.actualizarTabla();
}