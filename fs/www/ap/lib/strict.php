<?php
function makernd($type='safe',$len=8){ // 乱数を返す
  $nums="0123456789";
  $alps="abcdefghijklmnopqrstuvwxyz";
  $alpb="ABCDEFGHIJKLMNOPUQRSTUVWXYZ";
  $safe="23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPUQRSTUVWXYZ";
  $safec="abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPUQRSTUVWXYZ";
  if($type=='num'){$chars=$nums;}
  if($type=='small'){$chars=$alps;}
  if($type=='big'){$chars=$alpb;}
  if($type=='char'){$chars=$alps.$alpb;}
  if($type=='safec'){$chars=$safec;}
  if($type=='safe'){$chars=$safe;}
  return substr(str_shuffle($chars),0,$len);
}
?>
