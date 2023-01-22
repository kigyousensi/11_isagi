<?php
//
// ファイルシーケンスライブラリ
//
// ex)
//   $sq=new cFileSq("database");
//   $id=$sq->get("id");
//
// 外部仕様
//  クラス名 > Key に最後に使用した値が記載されている。
//  値は数字の他1文字のアルファベット(大文字)を使用できる。
//  get(Key[,type])	 :最後に使用した値に+1した値を返すと共にその値を保存する。
//  last(key[,type]) :最後に使用した値を取得する
//  next(key[,type]) :次の値を取得する
//  reset(key[,type]):リセットする。数字の場合は0,アルファベットの場合はA
//  set(key,value):指定の値にセットする
//  openlock()	: オープンロックをかける
//  openunlock(): オープンロックを解除する
//  typeはKeyが存在しなかった場合に有効文字/数字のどちらか判断するために使う
//
// 内部仕様
//  クラスはファイルでありcachedに保存されている。
//  get,next,resetではクラスファイルにロックをかける。
//
// データ構造
// cached/$クラス名.sq
//    KEY: Value
// tmp/firesq_$クラス名.lock
//    乱数
//
// 前提
//   呼び出し元でfile.phpをロード済みであること
//

class cFileSq{
	private $class;
	private $sq;
	private $closelock;
	private $openlock;
	public $status;
	function __construct($class){ // 初期化
		// クラス名を受信すると共にクラスファイル、ロックファイルを作成するディレクトリが無ければ作成。
		// さらにクラスファイルも作成
		$rc=0;
		$this->class=$class;							//クラス名
		$this->sq="./cached/".$this->class.".sq";		//クラスファイル
		$this->closelock="./tmp/".$this->class."_close";//暗黙のロックファイル
		$this->openlock ="./tmp/".$this->class."_open";	//明示的ロックファイル
		if(!file_exists("./cached")){if(! mkdir("./cached",0774)){$rc=1;}}	//cachedディレクトリが無ければ作成
		if(!file_exists("./tmp")){if(! mkdir("./cached",0777)){$rc=1;}}		//tmpディレクトリが無ければ作成
		if(!file_exists($this->sq) and is_writable("./cached")){file_put_contents( $this->sq,""); }// $classが無ければ作成
		$this->status=$rc;
	}
	private function lock(){	// 明示的ロックがない場合は暗黙のロックを取得する
		if(!flkexit($this->openlock)){
			$idname=mt_rand(100,999);
        	return flk($this->closelock,$idname);
		}
		else{ //ロックがあるなら何もせず正常終了
			return (bool) True;
		} 
	}
	private function unlock(){	// 明示的ロックがない場合は暗黙のロックを解除する
		if(!flkexit($this->openlock)){$result=fulk($this->closelock);}
	}
	private function countup($value){ // 文字または数字をカウントアップする
		return ++$value;	//数字もアルファベットもカウントアップできる
	}
	public function openlock(){ // 明示的ロックを取得する
		// 複数のキーを同時に編集したいは明示的ロックをかけてからget/set/resetする。
		$idname=mt_rand(100,999);
        return flk($this->openlock,$idname);
	}
	public function openunlock(){ // 明示的ロックを解除する
		$result=fulk($this->openlock);
	}
	public function get($key,$def=1){	// Keyの次の値を取得してさらに保存する。無ければ$defをセットして同値を返す
		$rc=(bool) False;
		if($this->lock()){ //暗黙のロックを取得
			// define //
			$find=0;
			$rc=$def;
			// main //
			$data=frd($this->sq);			//シーケンステーブルを読込み
			for($i=0;$i<count($data);$i++){	// Keyを探す
				$dmy=explode(":",$data[$i]);	//:で区切ってKeyとValueを取り出し
				if($dmy[0]===$key){				// 一致するkeyを発見
					$rc=$this->countup($dmy[1]);// 値をカウントアップ
					$data[$i]=$dmy[0].":".$rc;	// 値を更新
					$find=1;$i=count($data);	// ループ終了
				}
			}
			// Keyを発見できた場合はそのままファイルを上書き。
			// 発見できなかった場合は最後にkeyと$defを追加して上書き
			if($find==0){	//発見できなかった場合は最後にkeyとdefを追加
				array_push($data,$key.":".$def);
				$rc=$def;
			}
			fwt($this->sq,$data,$cr="\n");
			// end //
			$this->unlock(); //暗黙のロックを解除
		}
		return $rc;
	}
	public function set($key,$value){		// Keyに値をセット
		$rc=(bool) False;
		if($this->lock()){ //暗黙のロックを取得
			// define //
			$find=0;
			// main //
			$data=frd($this->sq);			//シーケンステーブルを読込み
			for($i=0;$i<count($data);$i++){	// Keyを探す
				$dmy=explode(":",$data[$i]);	//:で区切ってKeyとValueを取り出し
				if($dmy[0]===$key){				// 一致するkeyを発見
					$data[$i]=$dmy[0].":".$value;	// 値を更新
					$find=1;$i=count($data);	// ループ終了
				}
			}
			// Keyを発見できた場合はそのままファイルを上書き。
			// 発見できなかった場合は最後にkeyと$valueを追加して上書き
			if($find==0){	//発見できなかった場合は最後にkeyとvalueを追加
				array_push($data,$key.":".$value);
			}
			fwt($this->sq,$data,$cr="\n");
			// end //
			$rc=(bool) True;
			$this->unlock(); //暗黙のロックを解除
		}
		return $rc;
	}
	public function reset($key,$type="no"){ // Keyの値を0またはAにセット
	
	}
	public function last($key,$def=0){  // Keyの現在値を取得。無ければ現在値に$defをセットして返す
		$rc=(bool) False;
		if($this->lock()){ //暗黙のロックを取得
			// define //
			$find=0;
			// main //
			$data=frd($this->sq);			//シーケンステーブルを読込み
			for($i=0;$i<count($data);$i++){	// Keyを探す
				$dmy=explode(":",$data[$i]);	//:で区切ってKeyとValueを取り出し
				if($dmy[0]===$key){				// 一致するkeyを発見
					$rc=$dmy[1];				// 値を取得
					$find=1;$i=count($data);	// ループ終了
				}
			}
			// 発見できなかった場合は最後にkeyと$defを追加して上書き
			if($find==0){	//発見できなかった場合は最後にkeyと$defを追加
				array_push($data,$key.":".$def);
				fwt($this->sq,$data,$cr="\n");
				$rc=$def;
			}
			// end //
			$this->unlock(); //暗黙のロックを解除
		}
		return $rc;
	}
	public function next($key,$def=0){  // Keyの次の値を取得。無ければ現在値に$defをセットして次の値を返す
	}
}
?>