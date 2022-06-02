/* EVENT LISTENERS AND VARIABLE DECLARATION */

// initialise the barcode


// get required elements
let search_form = document.getElementById("myForm");

// listens for the form to change or keyup
search_form.addEventListener('keyup', function() {
    generateBarcode();
});

function generateBarcode(){

    // get the input value
    let input_value = document.getElementById("myVal").value;

    console.log(input_value);

    $("#barcode").JsBarcode(input_value);
}