/* EVENT LISTENERS AND VARIABLE DECLARATION */

// get required elements
let search_form = document.getElementById("myForm");
let result_item = {};
let viewing_stock = false;

// listens for the form to change or keyup
search_form.addEventListener('keyup', function() {
    handleSearch();
});

// if the view basket button is clicked
$("#viewStockBtn").click(function () {
    viewing_stock = !viewing_stock;
    setStockPanel("#stockPanel", viewing_stock);
});

// if the closeBtn is clicked
$(".closebtn.right").click(function () {
    viewing_stock = !viewing_stock;
    setStockPanel("#stockPanel", viewing_stock);
});

/* START OF MAIN SALES PROCESSING FUNCTIONS */

// FUNCTION TO UPDATE THE STOCK PANEL
function updateStockPanel(items) {
    // get the basket elements
    let stock_names = document.getElementById("stockNameSummary");
    let stock_sizes = document.getElementById("stockSizeSummary");
    let stock_stock = document.getElementById("stockStockSummary");

    // if the basket is empty
    if (items.length === 0) {
        // set the basket name to empty
        stock_names.innerHTML = "Nothing To Show Yet";
        // set the basket size to empty
        stock_sizes.innerHTML = "N/A";
        // set the basket stock to empty
        stock_stock.innerHTML = "N/A";
    }
    else {
        // empty the basket elements
        stock_names.innerHTML = "";
        stock_sizes.innerHTML = "";
        stock_stock.innerHTML = "";
        // for each item in the basket
        for (let i = 0; i < items.length; i++) {
            // add the item name to the basket name
            stock_names.innerHTML += items[i].ItemName + "<br>";
            // add the item size to the basket size
            stock_sizes.innerHTML += "UK " + items[i].ItemSize + "<br>";
            // add the item stock to the basket stock
            stock_stock.innerHTML += items[i].ItemStock + "<br>";
        }
    }
}

function findSimilarItems() {

    let target_sku = result_item.ItemSKU;

    //split the sku into an array at the '-'
    let sku_array = target_sku.split("-");

    target_sku = sku_array[0] + "-" + sku_array[1] + "-" + sku_array[2] + "-" + sku_array[3];

    // get the items data from the database
    $.ajax({
        url: '/retail/items_data/stock_query/' + target_sku,
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function (data) {
            updateStockPanel(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

// FUNCTION TO HANDLE CHARACTER SEARCH

function setStockPanel(panel, toggle) {
    if (toggle) {
        // set the panel display to block
        $(panel).css("display", "block");
        // set the panel width to 250px
        $(panel).css("width", "475px");
    }
    else {
        closeStockPanel(panel);
    }
}

function closeStockPanel(panel) {
    // set the panel width to 0px
    $(panel).css("width", "0px");
}

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
                findSimilarItems(result_item);
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
                totalText = "UK" + item.ItemSize
                break;
            case 3:
                // un hide the row
                row.style.display = "block";
                totalText = item.ItemSKU;
                break;
            case 4:
                // un hide the row
                row.style.display = "block";
                totalText = item.ItemStock;
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