// ////////////////////////////////////////////////////////////////////////////
// 資産登録画面
// ////////////////////////////////////////////////////////////////////////////

//初期画面の設定 //////////////////////
// オーナーが持っている資産一覧を取得して資産一覧に表示する
// ログイン時と更新ボタンが押された場合のみ起動される
// カードの作成は別途asset_create_cardで行う
let asset_const=()=>{ 
   //
   // pre-process
   //

   // 既存のカードがある場合は全て削除
   let delroot=document.getElementById("asset-top");
   for(obj of delroot.querySelectorAll('.card')){obj.parentNode.removeChild(obj);}

   //
   // init
   //

   //サーバーから資産一覧を取得
   let ajaxcall=new Promise((resolve_func)=>{
       let rt=[
         {"assetid":"X1000001","type":1,"maker":"GIANT","model":"TCR","model-detail":"SL1","regist":"2022-12-10","serial":"K7EK20662","bouhan":"千123456789","comment":"メモ","rel":"true","repsw":"true","repdate":"2022-10-10","repno":"A00001","jyoto":"B01","proof":"true"},
         {"assetid":"X1000002","type":1,"maker":"Bianchi","model":"SPRINT","model-detail":"DISK","regist":"2022-12-10","serial":"K7EK20663","bouhan":"千123456780","comment":"メモ","rel":"false","repsw":"false","repdate":"2022-10-10","repno":"A00002","jyoto":"","proof":"false"}
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

//######################################
// ファビコン
//######################################
// 画面右下に編集ボタンを作成する
M.FloatingActionButton.init(document.getElementById("asset-add"));