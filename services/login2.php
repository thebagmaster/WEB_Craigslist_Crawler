<?php

include 'mysql_connect.php';

$email = mysql_real_escape_string(stripslashes($_POST['email']));

$password = md5($_POST['pass']);

$query1 = mysql_query("SELECT * FROM members WHERE
email='$email'");

$result = mysql_num_rows($query1);

if($result == 0)
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
<h1>Error!</h1>The email you specified does not exist!
<br><br><br>Prepare to be redirected!

</body>
</html>
';
}
else
{
$checkuser = mysql_query("SELECT * FROM members WHERE
email='$email'");

$row = mysql_fetch_array($checkuser);
$password2 = $row['password'];
$status = $row['status'];
if ($password == $password2)
{
	session_start(); 
	$_SESSION['email']=$email; 
	header("location:http://clist.us/services/edit/");
}
else
{
	echo '<h1>Error!</h1>The email and password combination you entered does not
	match the ones we have in the database.';
}
}

?>