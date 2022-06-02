/* EVENT LISTENERS AND VARIABLE DECLARATION */

// get required elements
let search_form = document.getElementById("myForm");
let result_item = {};

let viewing_best = false;
let viewing_worst = false;

// listens for the form to change or keyup
search_form.addEventListener('keyup', function() {
    handleSearch();
});

// on page load
$(document).ready(function () {
    handleSearch();
});

// if the h2l button is clicked
$("#sortH2L").click(function () {
    // sort the result_item array by the item sales in descending order
    result_item.sort(function (a, b) {
        return b.ItemSales - a.ItemSales;
    });
    // create the table
    createSalesAnalysisTable(result_item);
});

// if the sortl2h button is clicked
$("#sortL2H").click(function () {
    // sort the result_item array by the item sales in ascending order
    result_item.sort(function (a, b) {
        return a.ItemSales - b.ItemSales;
    });
    // create the table
    createSalesAnalysisTable(result_item);
});

// if the visBest button is clicked
$("#visBest").click(function () {
    // close the sidebar
    closeChartPanel("#sellingChartSidebar");

    viewing_best = !viewing_best;
    setChartPanel("#sellingChartSidebar", viewing_best);
});

// if the visWorst button is clicked
$("#visWorst").click(function () {
    // close the sidebar
    closeChartPanel("#sellingChartSidebar");

    viewing_worst = !viewing_worst;
    setChartPanel("#sellingChartSidebar", viewing_worst);
});

// if the closeBtn is clicked
$(".closebtn.chart").click(function () {
    viewing_best = false;
    viewing_worst = false;
    closeChartPanel("#sellingChartSidebar");
});

/* START OF MAIN SALES PROCESSING FUNCTIONS */



function closeChartPanel(panel) {
    // set the panel width to 0px
    $(panel).css("width", "0px");
}

function setChartPanel(panel, toggle) {
    // if viewing_best is true
    if (viewing_best && !viewing_worst) {
        // sort the result_item array by the item sales in descending order
        result_item.sort(function (a, b) {
            return b.ItemSales - a.ItemSales;
        });
        // set the panel display to block
        $(panel).css("display", "block");
        // set the panel width to 250px
        $(panel).css("width", "300px");

        updateChartPanel(result_item);
    }
    // if viewing_worst is true
    else if (viewing_worst && !viewing_best) {
        // sort the result_item array by the item sales in ascending order
        result_item.sort(function (a, b) {
            return a.ItemSales - b.ItemSales;
        });
        // set the panel display to block
        $(panel).css("display", "block");
        // set the panel width to 250px
        $(panel).css("width", "300px");

        updateChartPanel(result_item);
    }
    else{
        closeChartPanel(panel);
        viewing_best = false;
        viewing_worst = false;
    }
}

// FUNCTION TO UPDATE THE STOCK PANEL
function updateChartPanel(items) {

    let chartStatus = Chart.getChart("sellingChart");
    if (chartStatus !== undefined) {
        chartStatus.destroy();
    }

    //for each item in items, display the first 5 items with their name and sales

    items = items.slice(0, 5);

    //create the chart using the nodes
    let chart = new Chart(document.getElementById("sellingChart"), {
        type: 'bar',
        data: {
            labels: items.map(function (item) {
                return item.ItemSKU;
            }),
            datasets: [{
                label: 'Number of Sales',
                backgroundColor: '#808080',
                data: items.map(function (item) {
                    return item.ItemSales;
                })
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: { display: false },
            title: {
                display: true,
                text: 'Total Sales by Item'
            }
        }
    });

}

/* POPULATES THE INTERACTIONS TABLE */
function createSalesAnalysisTable(items) {

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
        '<th>Sales</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';
    $.each(items, function (index, item)
    {
        strResult += "<tr><td>" + item.ItemEAN + "</td>" +
            "<td> " + item.ItemSKU + "</td>" +
            "<td>" + item.ItemName + "</td>" +
            "<td>" + item.ItemSize + "</td>" +
            "<td>" + item.ItemSales + "</td></tr>";
        ;
    });
    strResult += "</tbody></table>";
    $("#sales-analysis-tabular").html(strResult);
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
                    createSalesAnalysisTable(result_item);
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
                createSalesAnalysisTable(result_item);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
            }
        });
    }
}