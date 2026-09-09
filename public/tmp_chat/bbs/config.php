<?php

$SERVER_SECRET="CHANGE_SECRET";

$DAT_DIR=__DIR__."/../dat";
$CACHE_DIR=__DIR__."/../cache";

function getCurrentThread(){
global $DAT_DIR;
return intval(trim(file_get_contents("$DAT_DIR/current_thread.txt")));
}

function setCurrentThread($id){
global $DAT_DIR;
file_put_contents("$DAT_DIR/current_thread.txt",$id);
}

function getNextThreadID(){

global $DAT_DIR;

$fp=fopen("$DAT_DIR/current_thread.txt","c+");

flock($fp,LOCK_EX);

rewind($fp);

$current=intval(trim(fgets($fp)));

$next=$current+1;

ftruncate($fp,0);
rewind($fp);

fwrite($fp,$next);

flock($fp,LOCK_UN);

fclose($fp);

return $next;
}

function generateID(){

global $SERVER_SECRET;

$ip=$_SERVER["REMOTE_ADDR"];
$ua=$_SERVER["HTTP_USER_AGENT"];
$date=date("Y-m-d");

$hash=hash("sha256",$ip.$ua.$date.$SERVER_SECRET);

return substr($hash,0,8);
}

function parseTrip($name){

$parts=explode("#",$name);

$display=htmlspecialchars($parts[0]);

if(count($parts)==2){

$trip=substr(hash("sha1",$parts[1]),0,8);

return "$display ◆$trip";
}

return $display;
}

function parseEmoji($text){
    return preg_replace_callback( '/\:([a-zA-Z0-9_]+)\:/', function($m){
        $file="../emojis/".$m[1].".png";
        if(file_exists($file)){
            return "<img src='../../emojis/".$m[1].".png' width='20'>";
        }
        return $m[0];
    }, htmlspecialchars($text) );
}

function parseAnchor($text){

return preg_replace(
'/>>([0-9]+)/',
'<a href="#res$1">&gt;&gt;$1</a>',
$text
);

}

function checkNG($text){

$ng=["死ね","spam"];

foreach($ng as $w){
if(strpos($text,$w)!==false){
return false;
}
}

return true;
}

function cacheThread($thread){

global $DAT_DIR,$CACHE_DIR;

$dat="$DAT_DIR/$thread.dat";

if(!file_exists($dat))return;

$lines=file($dat);

ob_start();

echo "<h1>スレ$thread</h1>";

foreach($lines as $i=>$line){

list($name,$mail,$date,$uid,$msg)=explode("<>",$line);

$msg=parseEmoji($msg);
$msg=parseAnchor($msg);

$no=$i+1;

echo "<div id='res$no'>";
echo "$no ".parseTrip($name)." $date ID:$uid<br>";
echo $msg;
echo "</div><hr>";

}

$html=ob_get_clean();

file_put_contents("$CACHE_DIR/$thread.html",$html);
}