// ////////////////////////////////////////////////////////////////////////////
// 資産登録画面
// ////////////////////////////////////////////////////////////////////////////

//
// 資産登録画面の入口
//

// ////////////////////////////////////
// 初期化
// ////////////////////////////////////
// # 初期画面を表示
let asset_const=()=>{ 
  // オーナーが持っている資産一覧を取得して資産一覧に表示する
  // usage asset_const()
  // return なし
  // /
  // / ログイン成功時にコールされる。(テスト時はonload時にもコールされる)
  // / カードの作成は別途asset_create_cardで行う

   //
   // pre-process
   //

   // 既存のカードがある場合は全て削除
   let delroot=document.getElementById("asset-top");
   for(obj of delroot.querySelectorAll('.card')){obj.parentNode.removeChild(obj);}

   // 機能別画面の高さを0に設定
   Elm_style("ch1-2-sub10-first","height",0);   //新規作成画面

   //
   // init
   //

   //サーバーから資産一覧を取得
   let ajaxcall=new Promise((resolve_func)=>{
       let rt=[
         {"assetid":"X1000001","type":"Roadbike","maker":"GIANT","model":"TCR","model-detail":"SL1","regist":"2022-12-10","serial":"K7EK20662","bouhan":"千123456789","comment":"メモ","rel":"true","repsw":"true","repdate":"2022-10-10","repno":"A00001","jyoto":"B01","proof":"true","insura":"giant1","insuraid":"706105484","insuradt":"2022-12-09","insuratel1":"0120-052-625","insuratel2":"0120-819-101"},
         {"assetid":"X1000002","type":"kaden","maker":"Bianchi","model":"SPRINT","model-detail":"DISK","regist":"2022-12-10","serial":"K7EK20663","bouhan":"千123456780","comment":"メモ","rel":"false","repsw":"false","repdate":"2022-10-10","repno":"A00002","jyoto":"","proof":"false","insura":"panasonic1","insuraid":"p0001-0000","insuradt":"2025-12-1","insuratel1":"03-715-8152","insuratel2":"0120-819-101"}
      ];
       setTimeout(resolve_func,1000,rt);
   });

   //
   // main
   //

   // 取得したデータを元に資産カードを作成して表示
   ajaxcall.then((recv)=>{
      /// 受信した検索結果を元にテンプレートからカードを作成
      for(let i=0;i<recv.length;i++){asset_create_card(recv[i]);}
   });
}

// ////////////////////////////////////
// ファビコン
// ////////////////////////////////////
// 画面右下に編集ボタンを作成する
let gmAsset_action=M.FloatingActionButton.init(document.getElementById("asset-action"));

// リスナーを登録
document.getElementById("asset-action-add").addEventListener('click',()=>{func_asset_action_add()});