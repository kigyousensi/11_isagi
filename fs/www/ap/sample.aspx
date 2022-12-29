<?php
require "lib/json.php";
//header check
$flg=0;
if($_SERVER['HTTP_X_REQUESTED_WITH']!="XMLHttpRequest"){$flg=1;}
if($_POST['apid'] ==''){$flg=2;}

$data["id"]="data";

//main
if($flg==0){

}
else {$data="";}

// end
$json=new Services_JSON();
print $json->encode($data);
?>