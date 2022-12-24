// ////////////////////////////////////////////////////////////////////////////
// 資産登録画面
// ////////////////////////////////////////////////////////////////////////////

//
// カードメニュー項目のアクション(証明書類の送付)
//
// let ProfAsset  =new cSubFunction("ch1-2-sub3");       //証明書登録

// ////////////////////////////////////
// 証明書類の送付画面を表示
// ////////////////////////////////////
let asset_prof_item=(e)=>{
   //
   // preprocess
   //
   asset_card_menu_close(e.parentNode);//カードメニューを閉じる

   //
   // define
   //
   let rootnode=e.parentNode.parentNode.parentNode;   // card
   let assetid=Elm_dataset_get(rootnode,"assetid");   // assetid
   let type=Elm_dataset_get(rootnode,"type");         // 資産タイプ(1=ロードバイク)

   //
   // main
   // 
   //証明書類送付フォームを表示
   asset_syomei_createform(assetid,type);          //ファイル添付フォームを作成
   ProfAsset.open();
}

// 証明書類を送付 //////////////////////
let asset_syomei_up_run=()=>{
   // assetidと画像データを推進
}

// 証明書類の送付をキャンセル //////////
let asset_syomei_up_close=()=>{
   // 表示を消す
   ProfAsset.close();
}

// テンプレートから画像添付フォームを作成
let asset_syomei_createform=(assetid,type)=>{
   //
   // preprocess
   //
   // 画像の添付フォームを全てリセット(削除)
   for(obj of document.getElementById("asset-syomei-root").querySelectorAll(":scope> div")){
      obj.parentNode.removeChild(obj);
   }
   // 送信ボタンを無効化
   Elm_disable("asset_syomei_submit");

   //
   // define
   //
   let root=document.getElementById("asset-syomei-root"); 　// この下にテンプレートを追加していく
   let tmp=document.getElementById("asset-tmp-photo");      // テンプレートを取得
   let node,items,cols=[];                                  //ループ用変数

   //
   // main
   //
   // 資産タイプで表示するフォームの数を変える
   switch(type){
      case "Roadbike" :cols=gAssetTypes[type];break;
      default:cols=gAssetTypes["default"];
   }
   for(let i=0;i<cols.length;i++){
      // テンプレートのクローンノードを作成
      node=tmp.content.cloneNode(true);

      // 説明文を記載
      items=node.querySelector("span");
      Elm_html(items,cols[i]);

      // リスナーを登録
      items=node.querySelector("input");
      items.addEventListener("change",asset_picture_preview);

      // 子ノードを作成
      root.appendChild(node);
   }
}

