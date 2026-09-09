<?php
require "config.php";

$files=glob("../dat/*.dat");

rsort($files);

echo "<html>";
echo "<head><link rel='stylesheet' href='style.css' /><title>HeikiChan - スレッド".$id."</title><?php include __DIR__ . "/head.php"; ?>
</head>";
echo "<body>";
include(__DIR__ . "/headers.php");
echo "<div class='documents-container' style='font-family:monospace'>";
echo "<h1>スレ一覧</h1>";

foreach($files as $f){

$id=basename($f,".dat");

echo "<a href='/tmp_chat/bbs/thread/$id'>スレ$id</a><br>";

}

echo "</div></body></html>";