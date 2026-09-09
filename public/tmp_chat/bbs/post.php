<?php

require "config.php";

$thread=intval($_POST["thread"]);

$name=trim($_POST["name"]);
$mail=trim($_POST["mail"]);
$msg=trim($_POST["message"]);

if($name==""){
$name="おなまえモフモフ";
}

if($msg==""){
die("本文が空ですよ！！！");
}

if(!checkNG($msg)){
die("NGワードに引っ掛かってますよ！！！");
}

$file="../dat/$thread.dat";

$fp=fopen($file,"c+");

flock($fp,LOCK_EX);

fseek($fp,0,SEEK_END);

rewind($fp);

$lines = stream_get_contents($fp);

$resno = substr_count($lines,"\n")+1;

if($resno>1000){

flock($fp,LOCK_UN);
fclose($fp);

die("このスレは終了しました！！！");
}

$id=generateID();

$date=date("Y/m/d(D) H:i:s");

$msg=str_replace(["<>","\n","\r"]," ",$msg);

$line="$name<>$mail<>$date<>$id<>$msg";

fwrite($fp,$line."\n");

if($resno==1000){

$next=getNextThreadID();

$system="このスレは1000を超えてしまったので、いったんここでズッパーンですよ。続きは新スレで！";

fwrite($fp,"HeikiChan<>sage<>$date<>SYSTEM<>$system\n");

touch("../dat/$next.dat");

setCurrentThread($next);
}

flock($fp,LOCK_UN);

fclose($fp);

cacheThread($thread);

header("Location: /tmp_chat/bbs/thread/$thread");

exit;
