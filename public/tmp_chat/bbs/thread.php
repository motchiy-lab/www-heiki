<?php

require "config.php";

$id=intval($_GET["id"]);

$cache="../cache/$id.html";

echo "<html>";
echo "<head><link rel='stylesheet' href='../style.css' /><title>HeikiChan - スレッド".$id."</title><?php include __DIR__ . "/head.php"; ?>
</head>";
echo "<body>";

include(__DIR__ . "/headers.php");

echo "<div class='documents-container' style='font-family:monospace'>";

if(file_exists($cache)){
readfile($cache);
}else{
cacheThread($id);
readfile($cache);
}

$current=getCurrentThread();

if($id==$current){

echo "<h2>書き込み</h2>";

echo "
<form action='/tmp_chat/bbs/post.php' method='post'>

<input type='hidden' name='thread' value='$id'>

名前<br>
<input name='name'><br>

メール<br>
<input name='mail'><br>

本文<br><textarea name='message' rows='10' style='width:100%; max-width:800px;'></textarea><br>

<input type='submit' value='投稿'>

</form>
";

echo "<h3>絵文字</h3>";

$files=glob("../emojis/*.png");

foreach($files as $f){

$name=basename($f,".png");

echo "<img src='../../emojis/$name.png' width='20'
onclick=\"insertEmoji(':$name:')\">";
}

}

?>

<script>

function insertEmoji(code){

const textarea=document.querySelector("textarea");

const start=textarea.selectionStart;
const end=textarea.selectionEnd;

textarea.value=
textarea.value.substring(0,start)
+code+
textarea.value.substring(end);

textarea.focus();
}

</script>
</div>
</body></html>