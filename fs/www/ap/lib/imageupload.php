<?php
//
// 画像のアップロード用ライブラリ
// 使い方
// require 'imageupload.php';
// $saveimage=new MyImageUploadClass($_POST['data'],"../image","data.jpg");
// $saveimage->maxwide(100);
// $saveimage->save();
// v2019.1.3 新規作成

class MyImageUploadClass
{
  var $sourcedata;
  var $outdir;
  var $outfile;
  var $wide;

  //////////////////////////////////////////////
  // Constractor
  //////////////////////////////////////////////
  function MyImageUploadClass($sourcedata,$outdir,$outfile)
  {
    $this->sourcedata=$sourcedata;
    $this->outdir=$outdir;
    $this->outfile=$outfile;
    $this->wide=100;
  }

  //////////////////////////////////////////////
  // 縦/横の短い方の大きさを設定する
  //////////////////////////////////////////////
  function maxwide($wide)
  {
    $this->wide=$wide;
  }

  //////////////////////////////////////////////
  // 画像のサイズを変更する
  //////////////////////////////////////////////
  function save()
  {
    // 画像データをbase64からバイナリへデコード
    $img=base64_decode(preg_replace('/^.*base64,/','',str_replace(' ','+',$this->sourcedata)));
    // 画像をオブジェクトに変換
    if(!$im=imagecreatefromstring($img)){$rt=1;};
    //短い方の長さを$wideに揃える
    $wx=imagesx($im); $wy=imagesy($im);
    if($wx>$wy){$new_x=(int)$wx*$this->wide/$wy;$new_y=$this->wide;}
           else{$new_x=$this->wide;$new_y=(int)$wy*$this->wide/$wx;}
    $outimage=ImageCreateTrueColor($new_x, $new_y);
    ImageCopyResampled($outimage,$im,0,0,0,0,$new_x,$new_y,$wx,$wy);
    //$widex$wideになるように中心でクリップ
    $wx=imagesx($outimage); $wy=imagesy($outimage);
    $outimage =  imagecrop($outimage,['x'=>(int)(($wx-$this->wide)/2),'y'=>$ystart=(int)(($wy-$this->wide)/2),'width'=>$this->wide,'height'=>$this->wide]);
    //保存先ディレクトリを作成して保存
    if(!file_exists($this->outdir)){if(!mkdir($this->outdir,0777)){$rt=2;}}
    if($rt==0){ImageJPEG($outimage,$this->outdir."/".$this->outfile);}
    return $rt;
  }
}
?>
