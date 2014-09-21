<?php
include('simple_html_dom.php');

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://newyork.craigslist.org/');
curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch, CURLOPT_FAILONERROR, true);
curl_setopt($ch, CURLOPT_AUTOREFERER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$userAgent = 'Googlebot/2.1 (http://www.googlebot.com/bot.html)';
curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);

$content = curl_exec($ch);

$catas = array();
$hrefs = array();
$i = 0;

$html = str_get_html($content);


foreach($html->find('div[class=col] h4') as $element)
{
	if($element->childNodes(0)->innertext == "")
	{
		$catas[$i] = "personals";
		$hrefs[$i] = "";
	}
	else
	{
		$catas[$i] = $element->childNodes(0)->innertext;
		$hrefs[$i] = $element->childNodes(0)->href;
	}
	$i++;
}

$i = 0;
foreach($html->find('div[class=cats]') as $ul) 
{
		echo $catas[$i] . "," . $hrefs[$i];
       foreach($ul->find('ul li a') as $li) 
			echo "," . $li->innertext . "," . $li->href;
	   echo "|";
	   $i++;
}

?>