////////////////////////////////////////
// カードメニュー項目のアクション(画像を送付)
////////////////////////////////////////
let asset_photo_item=(e)=>{
   asset_card_menu_close(e.parentNode);//カードメニューを閉じる
   asset_photo_createform();           //ファイル添付フォームを表示
   //
   // define
   //
   let rootnode=e.parentNode.parentNode.parentNode;   // card
   let assetid=rootnode.dataset.assetid;              // assetid

   //画像変更画面を表示
   Elm_view("ch1-2-sub4");
}

// 写真を送付 //////////////////////////
let asset_photo_up_run=()=>{
}

// 写真の送付をキャンセル //////////////
let asset_photo_up_close=()=>{
   Elm_hide("ch1-2-sub4");
}
// テンプレートから画像添付フォームを作成
let asset_photo_createform=()=>{
   // define
   let root=document.getElementById("asset-photo-root");  // この下にテンプレートを追加していく
   let tmp=document.getElementById("asset-tmp-photo");   // テンプレートを取得
   let node,items,elm;                             //ループ用変数

   for(let i=0;i<1;i++){
      // テンプレートのクローンノードを作成
      node=tmp.content.cloneNode(true);

      //既に登録されている画像があれば表示

      //画像が変更された場合のリスナーを登録
      //子ノードを作成
   root.appendChild(node);
   } 
}