<?php
	require "RetailManagementRestService.php";

	// All requests to the web service are routed through this script.

	$service = new RetailManagementRestService();
	$service->handleRawRequest();
?>
