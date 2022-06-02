/* EVENT LISTENERS AND VARIABLE DECLARATION */

// get required elements
let search_form = document.getElementById("myForm");
let result_item = {};

// listens for the form to change or keyup
search_form.addEventListener('keyup', function() {
    handleSearch();
});

// if the view basket button is clicked
$("#generateRestockBtn").click(function () {
    createRestockPDF();
});

// on page load
$(document).ready(function () {
    handleSearch();
});

/* START OF MAIN SALES PROCESSING FUNCTIONS */

function createRestockPDF(){

    // filter the items to only include items with a stock of less than 10
    let items = result_item.filter(function (item) {
        return item.ItemStock < 10;
    });

    var doc = new jsPDF('p', 'pt', 'a4');
    doc.setFontSize(20);
    doc.text(20, 20, 'Restock List');
    doc.setFontSize(12);
    doc.text(20, 60, 'Date: ' + new Date().toLocaleString());
    doc.setFontSize(12);
    let i = 0;
    $.each(items, function (index, item)
    {
        // if 60 + (i * 70) is greater than the height of the page, create a new page
        if (100 + (i * 100) > doc.internal.pageSize.height - 100) {
            doc.addPage();
            i = 0;
        }
        // if the stock is less than 10
        if (item.ItemStock < 10) {
            // add the item to the pdf
            doc.text(20, 100 + (i * 100),
                "Item EAN: " + item.ItemEAN + "\n" +
                "Item SKU: " + item.ItemSKU + "\n" +
                "Item Description: " + item.ItemName + "\n" +
                "Item Size: UK" + item.ItemSize + "\n" +
                "Item Stock: " + item.ItemStock + "\n"
            );
        }

        i++;
    });
    doc.save('Restock List - (' + new Date().toLocaleString() + ').pdf');
}

/* POPULATES THE INTERACTIONS TABLE */
function createStockAuditTable(items) {

    var strResult = '<div class="col-md-12">' +
        '<table class="table" id="table-interactions">' +
        '<col style="width: 10%">' +
        '<col style="width: 35%">' +
        '<col style="width: 35%">' +
        '<col style="width: 10%">' +
        '<col style="width: 10%">' +
        '<thead>' +
        '<tr>' +
        '<th>EAN</th>' +
        '<th>SKU</th>' +
        '<th>Description</th>' +
        '<th>Size</th>' +
        '<th>Stock</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';
    $.each(items, function (index, item)
    {
        strResult += "<tr><td>" + item.ItemEAN + "</td>" +
            "<td> " + item.ItemSKU + "</td>" +
            "<td>" + item.ItemName + "</td>" +
            "<td>" + item.ItemSize + "</td>";

        if (item.ItemStock < 10) {
            strResult += "<td style='background: #c32436'>" + item.ItemStock + "</td></tr>";
        }
        else{
            strResult += "<td>" + item.ItemStock + "</td></tr>";
        }
    });
    strResult += "</tbody></table>";
    $("#stock-audit").html(strResult);
}

function handleSearch() {

    result_item = {};

    // get the search term from the search box
    var searchTerm = document.getElementById("myVal").value;

    // if the search term is empty, hide all the rows
    if (searchTerm === "" || searchTerm === null) {
        // get the items data from the database
        $.ajax({
            url: '/retail/items_data',
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function (data) {
                //check if the data is not empty
                if (data !== null && data[0].ItemSKU !== null && data[0].ItemName !== null && data[0].ItemPrice !== null) {
                    // remove any results that contain null values
                    data = data.filter(function (item) {
                        return item.ItemEAN !== null &&
                            item.ItemSKU !== null &&
                            item.ItemName !== null &&
                            item.ItemPrice !== null &&
                            item.ItemStock !== null &&
                            item.ItemSize !== null &&
                            item.ItemCategory !== null &&
                            item.ItemSales !== null;
                    });
                    result_item = data;
                    createStockAuditTable(result_item);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
            }
        });
    }
    else{
        // get the items data from the database
        $.ajax({
            url: '/retail/items_data/stock_audit/' + searchTerm,
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function (data) {
                // remove any results that contain null values
                data = data.filter(function (item) {
                    return item.ItemEAN !== null &&
                        item.ItemSKU !== null &&
                        item.ItemName !== null &&
                        item.ItemPrice !== null &&
                        item.ItemStock !== null &&
                        item.ItemSize !== null &&
                        item.ItemCategory !== null &&
                        item.ItemSales !== null;
                });
                result_item = data;
                createStockAuditTable(result_item);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
            }
        });
    }
}