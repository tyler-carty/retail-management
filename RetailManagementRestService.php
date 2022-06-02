<?php

	//Include the database info, interaction class and the base RESTful API class

    require "dbinfo.php";
    require "RestService.php";
    require "Item.php";
	require "Employee.php";
	require "Shift.php";

	//Class to handle the RESTful API requests, suh as displaying the list of interactions and filtering them

class RetailManagementRestService extends RestService
{
	private $data;
    
	public function __construct() 
	{
		// Passing in the string 'retail' to the base constructor ensures that all
		// requests are in the form http://server/retail/[parameters]
		parent::__construct("retail");
	}

	// Function to handle the GET requests depending on the URL parameters
	public function performGet($url, $parameters, $requestBody, $accept) 
	{
		switch (count($parameters))
		{
			case 1:
				$this->methodNotAllowedResponse();
				break;
			case 2:
				if ($parameters[1] == "items_data")
				{
					// If there is only one parameter, the full table of data is requested
					header('Content-Type: application/json; charset=utf-8');
					// This header is needed to stop IE cacheing the results of the GET
					header('no-cache,no-store');
					$this->getAllItems($parameters[1]);
					echo json_encode($this->data);
					break;
				}
				elseif ($parameters[1] == "employee_data")
				{
					// If there is only one parameter, the full table of data is requested
					header('Content-Type: application/json; charset=utf-8');
					// This header is needed to stop IE cacheing the results of the GET
					header('no-cache,no-store');
					$this->getAllEmployees($parameters[1]);
					echo json_encode($this->data);
					break;
				}
				{
					$this->methodNotAllowedResponse();
				}


			case 3:
				// If there is only one parameter, the full table of data is requested
				header('Content-Type: application/json; charset=utf-8');
				// This header is needed to stop IE cacheing the results of the GET
				header('no-cache,no-store');
				$this->getCertainItems($parameters[1], $parameters[2]);
				echo json_encode($this->data);
				break;
			case 4:
				// if parameters[2] is 'stock_audit' then the stock audit is requested
				if ($parameters[2] == 'stock_audit')
				{
					header('Content-Type: application/json; charset=utf-8');
					// This header is needed to stop IE cacheing the results of the GET
					header('no-cache,no-store');
					$this->getStockAudit($parameters[1], $parameters[3]);
					echo json_encode($this->data);
					break;
				}
				elseif ($parameters[2] == 'stock_query')
				{
					// If there is only one parameter, the full table of data is requested
					header('Content-Type: application/json; charset=utf-8');
					// This header is needed to stop IE cacheing the results of the GET
					header('no-cache,no-store');
					$this->getSimilarItems($parameters[1], $parameters[3]);
					echo json_encode($this->data);
					break;
				}
				elseif ($parameters[2] == 'employee_query')
				{
					// If there is only one parameter, the full table of data is requested
					header('Content-Type: application/json; charset=utf-8');
					// This header is needed to stop IE cacheing the results of the GET
					header('no-cache,no-store');
					$this->getCertainEmployees($parameters[1], $parameters[3]);
					echo json_encode($this->data);
					break;
				}
				elseif ($parameters[2] == 'shift_query')
				{
					// If there is only one parameter, the full table of data is requested
					header('Content-Type: application/json; charset=utf-8');
					// This header is needed to stop IE cacheing the results of the GET
					header('no-cache,no-store');
					$this->getEmployeeShifts($parameters[1], $parameters[3]);
					echo json_encode($this->data);
					break;
				}
				break;

			default:	
				$this->methodNotAllowedResponse();
		}
	}

	// Function to handle the PUT requests depending on the URL parameters
	public function performPut($url, $parameters, $requestBody, $accept)
	{
		global $dbserver, $dbusername, $dbpassword, $dbdatabase;

		$newItem = $this->extractItemFromJSON($requestBody);
		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);

		if (!$connection->connect_error)
		{
			$sql = "update $parameters[1] set item_stock = ?, item_sales = ? where item_ean = ?";
			// We pull the fields of the book into local variables since
			// the parameters to bind_param are passed by reference.
			$statement = $connection->prepare($sql);
			$item_ean = $newItem->getItemEAN();
			$item_stock = $newItem->getItemStock();
			$item_sales = $newItem->getItemSales();
			$statement->bind_param('iis', $item_stock, $item_sales, $item_ean);
			$result = $statement->execute();
			if ($result == FALSE)
			{
				$errorMessage = $statement->error;
			}
			$statement->close();
			$connection->close();
			if ($result == TRUE)
			{
				// We need to return the status as 204 (no content) rather than 200 (OK) since
				// we are not returning any data
				$this->noContentResponse();
			}
			else
			{
				$this->errorResponse($errorMessage);
			}
		}
	}

	// Function to get all the edges from the database, unfiltered
	private function getAllItems($param_one)
	{
		global $dbserver, $dbusername, $dbpassword, $dbdatabase;

		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$query = "select item_ean, item_sku, item_name, item_size, item_category, item_price, item_stock, item_sales from $param_one";
			if ($result = $connection->query($query))
			{
				while ($row = $result->fetch_assoc())
				{
					$this->data[] = new Item($row['item_ean'], $row['item_sku'], $row['item_name'], $row['item_size'], $row['item_category'], $row['item_price'], $row['item_stock'], $row['item_sales']);
				}
				$result->close();
			}
			$connection->close();
		}
	}

	// Function to get all the edges from the database, unfiltered
    private function getCertainItems($param_one, $param_two)
    {
		global $dbserver, $dbusername, $dbpassword, $dbdatabase;
	
		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$query = "select item_ean, item_sku, item_name, item_size, item_category, item_price, item_stock, item_sales from $param_one where item_ean = $param_two";
			if ($result = $connection->query($query))
			{
				while ($row = $result->fetch_assoc())
				{
					$this->data[] = new Item($row['item_ean'], $row['item_sku'], $row['item_name'], $row['item_size'], $row['item_category'], $row['item_price'], $row['item_stock'], $row['item_sales']);
				}
				$result->close();
			}
			$connection->close();
		}
	}

	// Function to get the data for a specific stock audit
	private function getStockAudit($param_one, $param_two)
	{
		global $dbserver, $dbusername, $dbpassword, $dbdatabase;

		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$query = "select item_ean, item_sku, item_name, item_size, item_category, item_price, item_stock, item_sales from $param_one where item_ean like '%$param_two%' or item_sku like '%$param_two%' or item_name like '%$param_two%'";
			if ($result = $connection->query($query))
			{
				while ($row = $result->fetch_assoc())
				{
					$this->data[] = new Item($row['item_ean'], $row['item_sku'], $row['item_name'], $row['item_size'], $row['item_category'], $row['item_price'], $row['item_stock'], $row['item_sales']);
				}
				$result->close();
			}
			$connection->close();
		}
	}

	// Function to get all the edges from the database, unfiltered
	private function getSimilarItems($param_one, $param_three)
	{
		global $dbserver, $dbusername, $dbpassword, $dbdatabase;

		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$query = "select item_ean, item_sku, item_name, item_size, item_category, item_price, item_stock, item_sales from $param_one where item_sku like '%$param_three%'";
			if ($result = $connection->query($query))
			{
				while ($row = $result->fetch_assoc())
				{
					$this->data[] = new Item($row['item_ean'], $row['item_sku'], $row['item_name'], $row['item_size'], $row['item_category'], $row['item_price'], $row['item_stock'], $row['item_sales']);
				}
				$result->close();
			}
			$connection->close();
		}
	}

	// Function to get all the edges from the database, unfiltered
	private function getAllEmployees($param_one)
	{
		global $dbserver, $dbusername, $dbpassword, $dbdatabase;

		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$query = "select employee_id, employee_forename, employee_surname, employee_phone, employee_email from $param_one";
			if ($result = $connection->query($query))
			{
				while ($row = $result->fetch_assoc())
				{
					$this->data[] = new Employee($row['employee_id'], $row['employee_forename'], $row['employee_surname'], $row['employee_phone'], $row['employee_email']);
				}
				$result->close();
			}
			$connection->close();
		}
	}

	// Function to get the data for a specific stock audit
	private function getCertainEmployees($param_one, $param_two)
	{
		global $dbserver, $dbusername, $dbpassword, $dbdatabase;

		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$query = "select employee_id, employee_forename, employee_surname, employee_phone,  employee_email from $param_one where employee_id like '%$param_two%' or CONCAT(employee_forename, ' ', employee_surname) like '%$param_two%'";
			if ($result = $connection->query($query))
			{
				while ($row = $result->fetch_assoc())
				{
					$this->data[] = new Employee($row['employee_id'], $row['employee_forename'], $row['employee_surname'], $row['employee_phone'], $row['employee_email']);
				}
				$result->close();
			}
			$connection->close();
		}
	}

	// Function to get the data for a specific employee shift
	private function getEmployeeShifts($param_one, $param_two)
	{
		global $dbserver, $dbusername, $dbpassword, $dbdatabase;

		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$query = "select shift_id, shift_employee_id, shift_date, shift_hours from $param_one where shift_employee_id = $param_two";
			if ($result = $connection->query($query))
			{
				while ($row = $result->fetch_assoc())
				{
					$this->data[] = new Shift($row['shift_id'], $row['shift_employee_id'], $row['shift_date'], $row['shift_hours']);
				}
				$result->close();
			}
			$connection->close();
		}
	}



	private function extractItemFromJSON($requestBody)
	{
		// This function is needed because of the perculiar way json_decode works.
		// By default, it will decode an object into a object of type stdClass.  There is no
		// way in PHP of casting a stdClass object to another object type.  So we use the
		// approach of decoding the JSON into an associative array (that's what the second
		// parameter set to true means in the call to json_decode). Then we create a new
		// Book object using the elements of the associative array.  Note that we are not
		// doing any error checking here to ensure that all of the items needed to create a new
		// book object are provided in the JSON - we really should be.
		$nodeArray = json_decode($requestBody, true);
		$node = new Item(
			$nodeArray['ItemEAN'],
			$nodeArray['ItemSKU'],
			$nodeArray['ItemName'],
			$nodeArray['ItemSize'],
			$nodeArray['ItemCategory'],
			$nodeArray['ItemPrice'],
			$nodeArray['ItemStock'],
			$nodeArray['ItemSales']
		);
		unset($nodeArray);
		return $node;
	}

}
?>
