<? 
session_start();
if(!isset($_SESSION['email'])){
header("location:http://clist.us/services/");
}
else
{
$email = $_SESSION['email'];
include '../mysql_connect.php';
$checkuser = mysql_query("SELECT * FROM members WHERE
email='$email'");
$row = mysql_fetch_array($checkuser);
echo '
<html>
<head>
<title>CList.us Service Customization</title>
<meta http-equiv="Content-Type" content="text/html" >
<meta name="keywords" content="craigslist search clist engine find craigs list" >
<link rel="stylesheet" type="text/css" href="crawler.css" />
<script src="jquery.min.js"></script>
<script type="text/javascript" src="crawler.js"></script>
</head>
<body onload="Crawler.Init()">
<center><div id="logo" onclick="window.location.href = \'http://clist.us/services/edit/\';">CList.us Services Edit</div><br><br></center>
<div style="margin-top:-5000px; position: absolute; color:#fff;">A Craigslist Search Engine! Simple Light and EASY! san diego craigslist craigslist modesto craigslist el paso tx grand rapids craigslist craigslist oc craigs list los angeles craigslist grand rapids mi springfield mo craigslist craigslist columbia mo craigslist baton rouge craigslist craigslist usa craigslist st louis mo craigslist miami florida craigslist orange county ca craigslist list craigslist birmingham craigs list kansas city craigs list las vegas craigslist homepage craigs list st louis craigslist kc craigs list grand rapids craigslist des moines craigs list santa barbara craigslist springfield springfield craigslist craigslist palm springs craigs list baton rouge craigs list springfield mo craigslist dayton craigs list orange county craigs list la craigslist jacksonville craigslist gr craigslist little rock garage sales craigslist craigslist cars for sale craigs list st louis mo santa barbara craigslist nashville tn craigslist rockford san diego reader craigs list long island craigslist mo craigslist kansas craigslist springfield missouri craigslist used cars craigslist oahu backpage san diego baton rouge jobs jobs in santa barbara backpage kansas city craigslist atlanta ga craigslist search engine santa barbara news press classified ads craigslist knoxville los angeles rentals apartments springfield mo baton rouge classifieds craigslist kansas city mo backpage baton rouge craigslist fayetteville nc backpage el paso monster.com top job search websites craigslist car craigslist las vegas nv craigslist long island apartments apartments baton rouge craigslist ocala free business advertising san diego rentals craigslist columbus ohio craigs list sandiego craigslist st louis cars los angeles times craigslist detroit mi craigslist los angeles ca craigslist los angeles cars craigslist longisland craigslist wausau craigslist long island boats craigslist elpaso santa barbara craigslist backpage st louis craigs list home page craigslist used cars for sale site search sandiego craigslist craigslist san diego cars craigslist autos for sale craigslist fargo craigslist northern va craigslist las vegas cars craigs list longisland craigslist kalamazoo custom search craigslist grand rapids michigan craigslist.org,craigslist cars,craigslist houston,craigslist san diego,craigslist ny,craigslist phoenix,craigslist dallas,craigslist michigan,craigslist denver,craigslist atlanta,craigslist maine,craigslist boston,craigslist tulsa,craigslist nj,craigslist austin,craigslist nashville,craigslist nh,craigslist san antonio,craigslist los angeles,craigslist pittsburgh,craigslist portland,craigslist.com,craigslist search,craigslist seattle,craigslist arkansas,craigs list,craigslist florida,www.craigslist.org,craigslist auto,craigslist duluth,craigslist eugene,craigslist home page,craigslist mn,craigslist motorcycles,craigslist michigan boats,craigslist tampa,jobs craigslist,craigslist ohio cars,craiglist,craigslist garage sales,craigslist st louis,craigslist california,craigslist wisconsin,craigslist bikes,craigslist jobs,craigslist pa,craigslist tucson,craigslist las vegas,craigslist kansas city,craigslist minnesota,craigslist ri,craigslist nc,craigslist classified ads,craigslist charlotte,craigslist cincinnati,craigslist ohio,google custom search,craigslist wisconsin auto,craigslist albuquerque,job search websites,craigslist spokane,craigslist columbus,craigslist arizona,www.craigslist.com,craigslist detroit,craigslist santa barbara,craigslist classifieds,craigslist boise,apartments on craigslist,craigslist baltimore,craigslist cars trucks,craigslist indianapolis,craigslist fresno,search.com,craigslist rochester,craigslist sfbay,craigslist sarasota,craigslist ma,craigslist buffalo,craigslist grand rapids,craigslist raleigh,craigslist okc,craigslist for cars,craigslist omaha,craigslist dc,craigslist reno,craigslist el paso,craigslist orange county,craigslist albany,los angeles craigslist,craigslist long island,free online advertising,craigslist baton rouge,craigs list.org,craigslist syracuse,apartments craigslist,craigslist maryland,free ads,craigslist springfield mo,craigslist south florida</div>
<div style="left:100px; position:relative;">
	<div id="stateContainer" class="stateHolder">
		Retrieving Cities<br><img src="load.gif">
	</div>
	<div id="cataContainer" class="stateHolder">
		Retrieving Categories<br><img src="load.gif">
	</div>
	<div id="resultsContainer">
		Welcome to your services edit page.<br><br>
		Here you will find how many cities you are available to monitor and have the ability to change them.
	</div>
	<div id="statsContainer">
		<div>Logged in as ' . $_SESSION['email'] . '.</div>
		<div class="stats">Credits Available:<span id="citiesAvail" class="counter">'.$row['credits'].'</span></div>
		<a href="http://clist.us/services/logout.php" style="text-align:left;padding-right:110px;">Logout</a>
		<span style="text-align:right;">Cities&nbsp;<span id="cityCount" class="counter"></span></span>&nbsp;&nbsp;&nbsp;<span style="text-align:right;">Areas&nbsp;<span id="cataCount" class="counter"></span></span>
	</div>
</div>
</body>
</html>
';
}
?>