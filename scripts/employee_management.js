/* EVENT LISTENERS AND VARIABLE DECLARATION */

// console.log the date without time
console.log(new Date().toISOString().slice(0, 10));

// get required elements
let search_form = document.getElementById("myForm");
let result_employees = {};
let result_shifts = {};
let viewing_shifts = false;

// listens for the form to change or keyup
search_form.addEventListener('keyup', function() {
    handleSearch()
});

// when the page loads, get the items data from the database
$(document).ready(function () {
    handleSearch();
});

// for each employee, add a click event listener
$(document).on('click', '#table-interactions button', function () {
    // get the employee id from the button
    let employee_id = $(this).attr('id');
    getEmployeeShifts(employee_id);
});

// if the closeBtn is clicked
$(".closebtn.right").click(function () {
    viewing_shifts = !viewing_shifts;
    closeShiftPanel("#shiftPanel");
});


/* START OF MAIN SALES PROCESSING FUNCTIONS */

function updateShiftPanel(shifts) {

    // get the basket elements
    let shift_ids = document.getElementById("shiftIDSummary");
    let shift_dates = document.getElementById("shiftDateSummary");
    let shift_hours = document.getElementById("shiftHoursSummary");

    // if the basket is empty
    if (shifts === null) {
        // set the basket name to empty
        shift_ids.innerHTML = "N/A";
        // set the basket size to empty
        shift_dates.innerHTML = "N/A";
        // set the basket stock to empty
        shift_hours.innerHTML = "N/A";
    }
    else {
        // empty the basket elements
        shift_ids.innerHTML = "";
        shift_dates.innerHTML = "";
        shift_hours.innerHTML = "";
        // for each item in the basket
        for (let i = 0; i < shifts.length; i++) {
            // add the item name to the basket name
            shift_ids.innerHTML += shifts[i].ShiftID + "<br>";
            // add the item size to the basket size
            shift_dates.innerHTML += shifts[i].Date + "<br>";
            // add the item stock to the basket stock
            shift_hours.innerHTML += shifts[i].TimeIn + "<br>";
        }
    }
}

function setShiftPanel(panel, shifts) {
    if(viewing_shifts){
        closeShiftPanel(panel);
        viewing_shifts = false;
        setShiftPanel(panel, shifts);
    }
    else{
        viewing_shifts = true;
        $(panel).css("width", "400px");
        updateShiftPanel(shifts);
    }
}

function closeShiftPanel(panel) {
    // set the panel width to 0px
    $(panel).css("width", "0px");
}

/* POPULATES THE INTERACTIONS TABLE */
function createEmployeeTable(employees) {

    var strResult = '<div class="col-md-12">' +
        '<table class="table" id="table-interactions">' +
        '<col style="width: 15%">' +
        '<col style="width: 30%">' +
        '<col style="width: 20%">' +
        '<col style="width: 35%">' +
        '<col style="width: 20%">' +
        '<thead>' +
        '<tr>' +
        '<th>Employee ID</th>' +
        '<th>Name</th>' +
        '<th>Phone</th>' +
        '<th>Email</th>' +
        '<th>Visualise Shifts</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';
    $.each(employees, function (index, employee) {
        strResult += "<tr><td>" + employee.EmployeeID + "</td>" +
            "<td> " + employee.FirstName + " " + employee.LastName + "</td>" +
            "<td>" + employee.Phone + "</td>" +
            "<td>" + employee.Email + "</td>" +
            "<td><button type='button' id='" + employee.EmployeeID + "' class='btn btn-primary' style='font-size: medium'>View Shifts</button></td></tr>";
    });
    strResult += "</tbody></table>";
    $("#employee-data-tabular").html(strResult);
}

// FUNCTION TO GET THE SHIFT DATA FOR THE SELECTED EMPLOYEE
function getEmployeeShifts(employeeID) {

    $.ajax({
        url: '/retail/employee_shifts/shift_query/' + employeeID,
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function (data) {
            result_shifts = data;
            setShiftPanel("#shiftPanel", result_shifts);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function handleSearch() {

    result_employees = {};

    // get the search term from the search box
    var searchTerm = document.getElementById("myVal").value;

    // if the search term is empty, hide all the rows
    if (searchTerm === "" || searchTerm === null) {
        // get the items data from the database
        $.ajax({
            url: '/retail/employee_data',
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function (data) {
                result_employees = data;
                createEmployeeTable(result_employees);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
            }
        });
    }
    else{
        // get the items data from the database
        $.ajax({
            url: '/retail/employee_data/employee_query/' + searchTerm,
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function (data) {
                result_employees = data;
                createEmployeeTable(result_employees);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
            }
        });
    }
}