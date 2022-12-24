// ////////////////////////////////////
// メッセージウインドウクラス
// ////////////////////////////////////

//#################################
//## アラートメッセージ
//#################################

// アラートメッセージを表示する
// メッセージの種類によって背景の画像を変更する。
// インスタンスはglobalに宣言しているのでopen/closeともにどこでも称できる。
//
// ex)
// let ArtMsg = new cArtMsg("ar1","ArtMsg");
// ArtMsg("info","title","msg text","閉じる");

class cArtMsg{
  constructor(id,objname){
    this.id=id;           // ボックスのid
    this.objname=objname; // 変数名
    this.heights={"ar1-bord":0,"alert-title":0,"alert-text":0,"alert-submit":0}; //アラートボックスの高さ(vh) padding含む
  }
  open(type="info",title="info",text="",submit="閉じる"){
    // usage ArtMsg.open)(type,title,text,submit)
    // type   : { info | warn | error }
    // title  : タイトル
    // text   : テキスト(HTML可)
    // submit : 「閉じる」ボタンの文字列

    // define
    // # 条件用の変数
  
    // # 要素の高さ
    let text_height,text_fontsize,line_chars,lines; // textの1行の高さ、文字の大きさ、1行の文字数、行数
    let title_top,text_top;          //alert-title,alert-textのトップの位置;
    let imgheight=0;                 //imgの高さ
    let submit_topmargin,submit_top; //閉じるボタンの位置
    let text_maxvh=parseFloat(window.innerHeight)*0.5;//テキストエリアの最大サイズ

    // # 変更しない要素の高さはcssから取得
    this.heights["alert-title"]=parseFloat(getComputedStyle(document.getElementById("alert-title")).height.replace(/px/,""));
    this.heights["alert-submit"]=parseFloat(getComputedStyle(document.getElementById("alert-submit")).height.replace(/px/,""));
    title_top=parseFloat(getComputedStyle(document.getElementById("alert-title")).top.replace(/px/,""));
    text_top=parseFloat(getComputedStyle(document.getElementById("alert-text")).top.replace(/px/,""));
    text_height=parseFloat(getComputedStyle(document.getElementById("alert-text")).lineHeight.replace(/px/,""));
    text_fontsize=parseFloat(getComputedStyle(document.getElementById("alert-text")).fontSize.replace(/px/,""));
    line_chars=Math.ceil(parseFloat(getComputedStyle(document.getElementById("alert-text")).width.replace(/px/,""))/text_fontsize)-2;

    // テキストと画像を出力
    Elm_text("alert-title",title);    //高さ
    Elm_html("alert-text",text);      //本文
    Elm_text("alert-submit",submit);  //閉じるボタン
    Elm_style("ar1-bord","backgroundImage",`url('icon/${type}.png')`);  //背景を変更

    // テキスト要素の高さを算出
    // # テキストのみの高さ
    lines=Math.ceil(text.length/line_chars);                    //文字数から算出した行数
    lines+=(text.match(/\<br|\<p|\<div|\<li/g)||[]).length +4;  //テキストから算出した行数を追加(4行分は余裕をもたせる)
     //　# イメージの高さ
    {
      for(let img of document.getElementById("alert-text").querySelectorAll("img")){
        imgheight+=Math.ceil(img.height);
      }
    }
    this.heights["alert-text"]=Math.min(lines*text_height+imgheight,text_maxvh); //alert-textの高さを算出。最大値を超えないこと

    // 閉じる要素の位置を決定
    submit_topmargin=text_height;
    submit_top=text_top+this.heights["alert-text"]+submit_topmargin;

    // ボックスサイズを算出
    this.heights["ar1-bord"]=submit_top+this.heights["alert-submit"]+title_top; // 閉じるボタンの位置+titleのtopと同じだけの下マージン
    
    // テキストサイズを変更
    Elm_style("alert-text","height",`${this.heights["alert-text"]}px`);

    // テキストと画像を設定
    Elm_style("alert-submit","top",`${submit_top}px`);
    Elm_attribute("alert-submit","onclick",`${this.objname}.close()`);            //クローズイベント

    //表示
    this.view();
   }
   view(){
    Elm_view(this.id);
    setTimeout(Elm_style,10,"ar1-bord","height",`${this.heights["ar1-bord"]}px`); // 少し時間をずらしてアクションを開始
   }
   close(){
    Elm_style("ar1-bord","height",0);
    setTimeout(Elm_hide,300,this.id); // 少し時間をずらして非表示にする
   }
}

//###############################
//## Yes / No メッセージ
//## コールバック関数を起動するメッセージ(No時は閉じるだけ)
//###############################

class cYesnoMsg{
    constructor(id,name){
      this.id=id;
      this.obj=document.getElementById(id);
      this.name=name; //オブジェクト名
      this.cb;    //コールバック関数
      this.prm;   //パラメタ
    }
    open(title,text,cb,prm){
      // Yes / No メッセージを表示する
      // / usage yesnoMsg(str title,str msg,str cb, [] prm)
      // /  title : タイトル
      // /  msg   : メッセージ本文
      // /  cb    : コールバック関数の関数名
      // /  prm   : コールバック関数に引き渡す配列
      // /          [a,b,c,d...] -> "a,b,c,d..."としてdatasetに登録される

      //引数を受取
      this.cb=cb;this.prm=prm;

      // タイトルとメッセージを表示
      let elms=this.obj.querySelectorAll('[name="bord"]');
      Elm_text(elms[0],title);
      Elm_html(elms[1],text);

      // リスナーを登録
      elms=this.obj.querySelectorAll('[name="anser"]');
      Elm_attribute(elms[0],"onclick",`${this.name}.recv(this)`);
      Elm_attribute(elms[1],"onclick",`${this.name}.recv(this)`);

      // boxを表示(hideになっていると高さの取得ができないので先に表示する)
　    Elm_view(this.obj);
      let margin=10;  // 高さに持たせる余裕(px)
      let higt=Elm_sumHight("yesno-top")+margin;
      Elm_style("yesno-top","height",higt+"px");
    }
    wait(sw){
      if(sw==="on"){Elm_view("yesno-wait");}
      else{Elm_hide("yesno-wait");}
    }
    recv(el){
      //ボックスを非表示にする
      Elm_style("yesno-top","height",0);
      setTimeout(Elm_hide,210,this.id);

      // yes or noを取得
      let anser=Elm_dataset_get(el,"val"); //yes or no

      // コールバック関数を実行
      Function(this.cb+"('"+anser+"',['"+this.prm+"'])")();
    }
}

// ////////////////////////////////////
// サブファンクション
// ////////////////////////////////////

// # サブファンクションのOpen,Close等の一般的な動作
// let addfunc = new cSubFunction
// method
//  getChRoot()  : トップオブジェクト
//  getChFirst() : ドキュメントエリアオブジェクト
//  open()       : 表示
//  reseize()    : 画面の大きさを再調整
//  close()      : 表示を終了
//  wait(on|off) : waitバーの表示/非表示

class cSubFunction{
  constructor(subchid){
    this.subchid=subchid;
    this.subfirst=subchid+"-first";
    this.waitid=subchid+"-wait";
    this.paddingsize=24;
  }
  getChRoot(){return document.getElementById(this.subchid);}
  getChFirst(){return document.getElementById(this.subfirst);}
  open(){
   // オブジェクト
   let pobj=document.getElementById(this.subchid);
   let cobj=document.getElementById(this.subfirst);

   // 表示
   Elm_view(pobj);
   let h=Elm_sumHight(this.subfirst)+this.paddingsize*2;
   Elm_style(cobj,"paddingTop",this.paddingsize+"px");
   Elm_style(cobj,"paddingBottom",this.paddingsize+"px");
   Elm_style(cobj,"height",h+"px");
  }
  close(){
    let pobj=document.getElementById(this.subchid);
    let cobj=document.getElementById(this.subfirst);
    Elm_style(cobj,"paddingTop",0);
    Elm_style(cobj,"paddingBottom",0);
    Elm_style(cobj,"height",0);
    this.wait("off");
    setTimeout(()=>{Elm_hide(pobj);},300);
  }
  resize(){
    // オブジェクト
   let cobj=document.getElementById(this.subfirst);
   let h=Elm_sumHight(this.subfirst)+this.paddingsize*2;
   Elm_style(cobj,"height",h+"px");
  }
  wait(sw){
    switch(sw){
      case "on" :Elm_view(this.waitid);break;
      case "off":Elm_hide(this.waitid);break;
    }
  }
}
