<?php

include 'mysql_connect.php';

$email = mysql_real_escape_string(stripslashes($_POST['email']));

$password = md5($_POST['password']);

$ip = $_SERVER['REMOTE_ADDR'];

$result = mysql_num_rows(mysql_query("SELECT * FROM members WHERE
email='$email'"));

if($result == 1)
{
    echo '<h1>ERROR!</h1>The email you have chosen already exists!';
}
else
{
        $result = mysql_query("INSERT INTO members (email, password, ip, date, credits, cities, catas, search,subs) 
		VALUES ('$email', '$password', '$ip', " . time() . ", 0, 'none', 'none', 'none',0)");
		if (!$result) {
			die('Invalid query: ' . mysql_error());
		}
		else
		{
        echo '
		<html>
			<head>
		<script type="text/javascript">
		<!--
		function delayer(){
			window.location = "http://clist.us/services/"
		}
		//-->
		</script>
		</head>
		<body onLoad="setTimeout(\'delayer()\', 3000)">
		<p>Congratulations! You have successfully registered! </p>
		<p>Click <a href="http://clist.us/services/">here</a> to login.</p>
		<br><br><br>Prepare to be redirected to login!
		</body>
		</html>
		';
		}
}
 
?>