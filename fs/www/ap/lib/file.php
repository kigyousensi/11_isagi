<?php
//
// ファイル関数ライブラリ
//
// frd($filename)
// fad($filename,$tx)
// fwt($filename,$tx)
// mkf($filename)
// rmf($filename)
// flk($lockname,$idname)
// fulk($lockname,$idname)
// dirlist($dir) 　$dirの最後に/を忘れないように
// filelist($dir)　$dirの最後に/を忘れないように
//

////////////////////////////////////////////////////////////////////////
//読み込み関数
// ファイルの内容を読みこみ、配列に格納する。
// 改行文字は削除する。
//

function frd($filename)
{
 if(!file_exists($filename)){return -1;}
 else
 {
 	$data=file("$filename");
 	for($i=0;$i<count($data);$i++)
 	{
		$data[$i]=str_replace("\n","",$data[$i]);
		$data[$i]=str_replace("\r","",$data[$i]);
		$data[$i]=str_replace("\r\n","",$data[$i]);
	}
  return $data;
  }
}

////////////////////////////////////////////////////////////////////////
// 追記関数
// ファイルの最後尾にテキスト配列を出力する。

function fad($filename,$tx,$cr)
{
 //最後の1行が空白行かどうか判断する。
 if(!file_exists($filename)){return -1;}
 else
 {
 	$dumy=file("$filename");
 	$fp=fopen("$filename",'a');
 	for($i=0;$i<mb_strlen($tx);$i++)
	{
		fwrite($fp,"$tx[$i]");
	}
	fwrite($fp,$cr);
 	fclose($fp);
	return 0;
 }
}

////////////////////////////////////////////////////////////////////////
// 上書き関数
// ファイルにテキスト配列を出力する。
// デフォルトでは最後に改行マークを入れる。

function fwt($filename,$tx,$cr='\r\n')
{
 if($cr=='NONE'){$cr=NULL;}
 $fp=fopen("$filename",'w');
 for($i=0;$i<count($tx);$i++)
 {
	$tx[$i]=str_replace("\n","",$tx[$i]);
	$tx[$i]=str_replace("\r","",$tx[$i]);
	fwrite($fp,"$tx[$i]"."$cr");
 }
 fclose($fp);
}

////////////////////////////////////////////////////////////////////////
// 空ファイル作成
function mkf($filename){$fp=fopen("$filename",'w'); fclose($fp);}

////////////////////////////////////////////////////////////////////////
// ファイル削除
function rmf($filename){if(!unlink($filename)){echo "ERROR:ファイル $filename の削除に失敗しました。<br/>";};}

////////////////////////////////////////////////////////////////////////
// ロック
function flk($lockname,$idname)
{
	// $lockname:name of LOCKFILE (first commit)
	//		It is used to First Commit.
	//		if this file is already exist user most wait while this file removed.
	//		After this file removed, this user create this file,and this user get a themapho.

	// $idname : name of USER-ID (second commit)
	//		Usual, this user get a themapo, if user can create the lockfile.
	//		But some user create this file at same timing.(it rera case).
	//		Becouse this user write USER-ID into the file to commit cretail.
	//		This user create and check USERID.
	//		if USER-ID equal this users USER-ID, this user get a themapho cretain.

	// Set flag
		$lockname=$lockname.".lockfile";
		$flag=0;
		$rc=0;		// return code:0isOK 1is NG
		$second=5; 	// it is wait interbal time for file exist check.
		$maxcount=4;// it is max count of file exit check. 

	// Try while $frag equal zero.
		while($flag == 0)
		{
			// First, wait while $lockname file exist.(First commit)
			$count=0;	// Counter of file exist check.
			while(file_exists("$lockname"))
			{
				$count++;
				if($count>=$maxcount){$rc=1;$flag=1;break;}
				sleep($second);
				clearstatcache();
			}

			if($rc==0)
			{
			// Freate file
			$tx[0]=$idname;
			fwt($lockname,$tx,"\n");

			// Second, chekck USER-ID in $lockname file.(Second commit)
			// If you can get Second Commit, $flag is change to 1.
			$userid=frd($lockname);
			$userid[0]=str_replace("\n","",$userid[0]);
			if($userid[0] == $idname){$flag=1;}
			}
		}
		return $rc;
}

////////////////////////////////////////////////////////////////////////
// ロック解除
function fulk($lockname)
{
 $lockname=$lockname.".lockfile";
 if(!unlink($lockname)){echo "ERROR:ロックの解除に失敗しました($lockname)<br/>";};
}

function fout($filename,$txt)
{
 $fp=fopen("$filename",'w');
 fwrite($fp,"$txt");
 fclose($fp);
}

function fin($filename)
{
 $fp=fopen("$filename",'r');
 $txt=fgets($fp,4096);
 fclose($fp);
 return $txt;
}

////////////////////////////////////////////////////////////////////////
// ファイルリストを取得(.,..は除く)
// $dirの最後に"/"を忘れないように。
function filelist($dir)
{
	$list="";
	$cnt=0;

	if(is_dir($dir))
	{
		$dh = opendir($dir);
		while (($file = readdir($dh)) !== false)
		{
			if(filetype($dir . $file) == "file")
			{

				$list[$cnt]=$file;
				$cnt++;
			}
		}
		closedir($dh);
	}
	return $list;
}

////////////////////////////////////////////////////////////////////////
// ディレクトリリストを取得(.,..は除く)
// $dirの最後に"/"を忘れないように。
function dirlist($dir)
{
	$list="";
	$cnt=0;
	if(is_dir($dir))
	{
		$dh = opendir($dir);
		while (($file = readdir($dh)) !== false)
		{
			if((filetype($dir . $file) == "dir") and ($file != ".") and ($file != ".."))
			{
				$list[$cnt]=$file;
				$cnt++;
			}
		}
		closedir($dh);
	}
	return $list;
}

?>