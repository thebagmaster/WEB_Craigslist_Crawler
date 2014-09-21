<?php
include('simple_html_dom.php');

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://www.craigslist.org/about/sites');
curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch, CURLOPT_FAILONERROR, true);
curl_setopt($ch, CURLOPT_AUTOREFERER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$userAgent = 'Googlebot/2.1 (http://www.googlebot.com/bot.html)';
curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);

$content = curl_exec($ch);

$cities = array();
$i = 0;

$html = str_get_html($content);


foreach($html->find('div[class=state_delimiter]') as $element)
{
	$cities[$i] = $element->innertext;
	$i++;
}

$i = 0;
foreach($html->find('ul') as $ul) 
{
		echo $cities[$i];
       foreach($ul->find('li a') as $li) 
       {
			$sub = $li->href;
			echo "," . substr($sub,7,stripos($sub,".")-7);
       }
	   echo "|";
	   $i++;
}

?>