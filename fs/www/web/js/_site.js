// ////////////////////////////////////////////////////////////////////////////
// サイト制御
// ////////////////////////////////////////////////////////////////////////////

//
// サイト全体の制御を行う
//

// ////////////////////////////////////
// グローバルオブジェクト
// ////////////////////////////////////
//###############################
//## メッセージ
//###############################
let ArtMsg = new cArtMsg("ar1","ArtMsg");             //アラートメッセージ
let YesnoMsg = new cYesnoMsg("yesno","YesnoMsg");     // yesnoメッセージ

//###############################
//## サブファンクション
//###############################
let AddAsset   =new cSubFunction("ch1-2-sub10");      //新規追加
let JyotoAsset =new cSubFunction("ch1-2-sub1");       //譲渡
let ProfAsset  =new cSubFunction("ch1-2-sub3");       //証明書登録
let PhotoAsset  =new cSubFunction("ch1-2-sub4");      //写真変更 
// ////////////////////////////////////
// ウインドウ制御
// ////////////////////////////////////

//###############################
//## windowイベント
//###############################

// # onload
window.addEventListener('load',()=>{
  ownr_const();  //
  asset_const(); // テスト時のみ
});

// # 描画の完了を待つ
function rePaint() {
  // 再描画やdomオブジェクトの追加など、何らかの描画が行われている場合にその完了を待つ
  // / usage rePaint()
  // / return Promise
  let p=new Promise((resolve)=>{requestAnimationFrame(resolve);}).then(()=>{new Promise((resolve)=>{requestAnimationFrame(resolve);});});
  return p;
}

// ////////////////////////////////////
// チャンネルの制御
// ////////////////////////////////////

//###############################
//## チャンネルの切替え
//###############################

// #チャンネルを切り替える
function changech(ch){
  const items=document.querySelectorAll(".channel");
  for(let i=0;i<items.length;i++){
    // 対象のチャンネル以外は非表示にし、対象のチャンネルを表示にする。
    // 必要に応じて各チャンネルの初期化(const)をコールする。
      if(items[i].getAttribute("id") == ch){
          //items[i].classList.remove("hide");
          Elm_view(items[i]);
          switch(ch){
              case "ch2":ownr_const();break;
              case "ch4":signup_const();break;
          }
      }
      else{
          items[i].classList.add("hide");
      }  
  }
  slide_close();  // スライドメニューを閉じる
 }

//###############################
//## テキストメッセージ
//###############################

// 指定したIDにフォントカラーを指定してテキストを入力する
let textMsg=(id,typ,msg)=>{
  // / usage textMsg(str or obj id, str typ, str msg)
  // /  obj   :idもしくはオブジェクト
  // /  typ   :{info | warn | err}
  // / return なし
  let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
  switch(typ){
      case "info" :obj.style.color="#66BB6A";break
      case "warn" :obj.style.color="#fbc02d";break
      case "err"  :obj.style.color="#d84315";break
  }
  Elm_text(id,msg);
}
