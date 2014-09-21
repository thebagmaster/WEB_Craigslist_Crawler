<?php
include('simple_html_dom.php');

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://' . $_POST["prefix"] . '.craigslist.org/search/' . $_POST["cata"] . "?query=" . $_POST["query"] . "&srchType=A&minAsk=" . $_POST["min"] . "&maxAsk=" . $_POST["max"] );
curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch, CURLOPT_FAILONERROR, true);
curl_setopt($ch, CURLOPT_AUTOREFERER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$userAgent = 'Googlebot/2.1 (http://www.googlebot.com/bot.html)';
curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);

if($content = curl_exec($ch))
{

$catas = array();
$hrefs = array();
$i = 0;

$html = str_get_html($content);


foreach($html->find('p[class=row]') as $element)
{
	echo $element->outertext;
	//echo "|S|P|L|I|T|";
	$i++;
}
if($i === 0)
	echo "<div><p class='row'>No Results From " . $_POST["prefix"] . " in " . $_POST["cata"] . "</p></div>";
}
else
{
	echo "<div><p class='row'>Results Could Not Be Retreived From " . $_POST["prefix"] . ".</p></div>";
}
?>