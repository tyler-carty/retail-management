/* EVENT LISTENERS AND VARIABLE DECLARATION */

// get required elements
let search_form = document.getElementById("myForm");
let result_item = {};
let basket = [];
let viewing_basket = false;

// listens for the form to change or keyup
search_form.addEventListener('keyup', function() {
    handleSearch();
});

// if the closeBtn is clicked
$(".closebtn.right").click(function () {
    viewing_basket = !viewing_basket;
    updateBasket();
    setBasketPanel("#basketPanel", viewing_basket);
});

// if the checkout button is clicked
$("#checkoutBtn").click(function () {
    processSale();
});

// if the view basket button is clicked
$("#viewBasketBtn").click(function () {
    viewing_basket = !viewing_basket;
    updateBasket();
    setBasketPanel("#basketPanel", viewing_basket);
});

// if the cartBtn is clicked, call the showClicked function
$("#cartBtn").click(function () {
    if (Object.entries(result_item).length === 0 ){
        alert("Please scan an item first");
        return;
    }
    addToCart();
    updateBasket()
});




/* START OF MAIN SALES PROCESSING FUNCTIONS */

function resetBasket(){
    // empty the basket
    result_item = {};
    basket = [];
    viewing_basket = false;

    // close the basket panel
    closeBasketPanel('#basketPanel');
    // update the basket
    updateBasket();
}

function createInvoicePDF(){

    let items = basket;

    // create the pdf
    let doc = new jsPDF();

    // change the font size
    doc.setFontSize(12);
    // add the date/time to the pdf
    doc.text(20, 20, "Date: " + new Date().toLocaleString());
    // add the store name to the pdf
    doc.text(20, 30, "Store: " + "Example Store");


    // change the font size
    doc.setFontSize(20);
    doc.text(20, 50, "ITEMS BOUGHT:");

    // change the font size
    doc.setFontSize(12);
    // for each item in the basket
    items.forEach(function(item, i){
        // add the item to the pdf
        doc.text(20, 60 + (i * 20),
            "Item Description: " + item.ItemName + "\n" +
            "Item Size: UK" + item.ItemSize + "\n" +
            "Item Price: " + item.ItemPrice + "\n"
        );
    });

    // at the end of the pdf, add the total
    doc.text(20, 70 + (items.length * 20), "Total: " + calculateBasketTotal());

    doc.save('Purchase Invoice - (' + new Date().toLocaleString() +').pdf');

}

function putItem(item, count){

    // edit the item stock to reflect the new sale
    item.ItemStock = item.ItemStock - count;
    // edit the item sales to reflect the new sale
    item.ItemSales = parseInt(item.ItemSales) + count;

    console.log(item.ItemSales);

    // put the item into the database
    $.ajax({
        url: '/retail/items_data/',
        type: 'PUT',
        data: JSON.stringify(item),
        success: function () {
            console.log("Reached Put");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function processSale(){

    // count how many times each EAN code is scanned
    let count = {};
    for (let i = 0; i < basket.length; i++) {
        let key = basket[i].ItemEAN;
        if (count[key] === undefined) {
            count[key] = 1;
        }
        else {
            count[key]++;
        }
    }

    // for each key in the count object
    for (let key in count) {
        // get the items data from the database
        $.ajax({
            url: '/retail/items_data/' + key,
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function (data) {
                //check if the data is not empty
                if (data !== null && data[0].ItemSKU !== null && data[0].ItemName !== null && data[0].ItemPrice !== null) {
                    // push the data to the submission_items object
                    console.log(data, count[key]);
                    putItem(data[0], count[key]);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
            }
        });
    }
    // after the for loop, reset the basket
    createInvoicePDF();
    resetBasket();

}

function calculateBasketTotal(){
    let total = 0;
    for (let i = 0; i < basket.length; i++) {
        //convert the price to a float;
        total += parseFloat(basket[i].ItemPrice);
    }

    return total.toFixed(2);
}

function updateBasket(){

    // get the basket elements
    let basket_names = document.getElementById("basketNameSummary");
    let basket_prices = document.getElementById("basketPriceSummary");
    let basket_sizes = document.getElementById("basketSizeSummary");
    let basket_total = document.getElementById("basketTotalPrice");

    // if the basket is empty
    if (basket.length === 0) {
        // set the basket name to empty
        basket_names.innerHTML = "Nothing To Show Yet";
        // set the basket price to empty
        basket_prices.innerHTML = "£0.00";
        // set the basket size to empty
        basket_sizes.innerHTML = "N/A";
        // set the basket total to empty
        basket_total.innerHTML = "£0.00";
    }
    else {
        // empty the basket elements
        basket_names.innerHTML = "";
        basket_prices.innerHTML = "";
        basket_sizes.innerHTML = "";
        basket_total.innerHTML = "";
        // for each item in the basket
        for (let i = 0; i < basket.length; i++) {
            // add the item name to the basket name
            basket_names.innerHTML += basket[i].ItemName + "<br>";
            // add the item size to the basket size
            basket_sizes.innerHTML += "UK " + basket[i].ItemSize + "<br>";
            // add the item price to the basket price
            basket_prices.innerHTML += "£" + basket[i].ItemPrice + "<br>";
        }

        // add the total price to the basket total
        basket_total.innerHTML += "£" + calculateBasketTotal() + "<br>";
    }
}

function setBasketPanel(panel, toggle) {
    if (toggle) {
        // set the panel display to block
        $(panel).css("display", "block");
        // set the panel width to 250px
        $(panel).css("width", "475px");
    }
    else {
        closeBasketPanel(panel);
    }
}

function closeBasketPanel(panel) {
    // set the panel width to 0px
    $(panel).css("width", "0px");
}

function addToCart() {
    // add result_item to the basket JSON
    basket.push(result_item);

    // empty the search box
    document.getElementById("myVal").value = "";
    hideAllRows();
    result_item = {};
}

// FUNCTION TO HANDLE CHARACTER SEARCH
function handleSearch() {

    result_item = {};

    // get the search term from the search box
    var searchTerm = document.getElementById("myVal").value;

    // if the search term is empty, hide all the rows
    if (searchTerm === "" || searchTerm === null) {
        hideAllRows();
    }

    // get the items data from the database
    $.ajax({
        url: '/retail/items_data/' + searchTerm,
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function (data) {
            //check if the data is not empty
            if (data !== null && data[0].ItemSKU !== null && data[0].ItemName !== null && data[0].ItemPrice !== null) {
                result_item = data[0];
                handleScan(result_item);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function handleScan(item){

    // get the table
    var table = document.getElementById("recentitems_table");

    // get the number of rows in the table
    var rowCount = table.rows.length;

    // loop through the rows
    for(var i=0; i<rowCount; i++){

        // add the search term to the cell string
        var row = table.rows[i];

        var totalText = ""

        // switch through the cells
        switch(i){
            case 0:
                // un hide the row
                row.style.display = "block";
                // get the text to put in the cell
                totalText = item.ItemName;
                break;
            case 1:
                // un hide the row
                row.style.display = "block";
                totalText = item.ItemPrice;
                break;
            case 2:
                // un hide the row
                row.style.display = "block";
                totalText = item.ItemSKU;
                break;
        }

        // set the cell text to the total text
        row.cells[1].innerHTML = totalText;

    }
}

function hideAllRows(){

    // get the table
    var table = document.getElementById("recentitems_table");

    // get the number of rows in the table
    var rowCount = table.rows.length;

    // loop through the rows
    for(var i=0; i<rowCount; i++){

            // add the search term to the cell string
            var row = table.rows[i];

            // hide the row
            row.style.display = "none";

    }

}