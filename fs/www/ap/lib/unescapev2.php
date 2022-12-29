<?php
// HTML側でencodeURIComponentでエンコードした場合はこのlibでエンコードする
function unescape($source) {
 return rawurldecode($source);
}
?>
