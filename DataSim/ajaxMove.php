<?php
	$servername = "142.55.32.48";
	$username = "harquaim_php";
	$password = "c@pstone_server";
	$dbname = "harquaim_capstone";
	$uid = $_POST["q"];

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	} 

	$sql = "INSERT INTO sensor2 (uid)
	VALUES ('".$uid."')";

	if ($conn->query($sql) === TRUE) {
	    echo "Movement Insert Successful";
	} else {
	    error_log("Error: " . $sql . "<br>" . $conn->error,0);
	}

	$conn->close();
?>