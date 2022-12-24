// ////////////////////////////////////////////////////////////////////////////
// 資産登録画面
// ////////////////////////////////////////////////////////////////////////////

//
// カードメニュー項目のアクション(画像を送付)
//
// let PhotoAsset  =new cSubFunction("ch1-2-sub4");      //写真変更 

let asset_photo_item=(e)=>{
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
   // フォームに既存の画像を登録
   //証明書類送付フォームを表示
   asset_photo_createform(assetid,type);  //ファイル添付フォームを作成
   PhotoAsset.open();                     //画像変更画面を表示
}

// 写真を送付 //////////////////////////
let asset_photo_up_run=()=>{
}

// 写真の送付をキャンセル //////////////
let asset_photo_up_close=()=>{
   PhotoAsset.close();
}

// テンプレートから画像添付フォームを作成 ///
let asset_photo_createform=(assetid,type)=>{
    //
   // preprocess
   //
   // 画像の添付フォームを全てリセット(削除)
   for(obj of document.getElementById("asset-photo-root").querySelectorAll(":scope> div")){
      obj.parentNode.removeChild(obj);
   }
   // 送信ボタンを無効化
   Elm_disable("asset_photo_submit");

   //
   // define
   //
   let root=document.getElementById("asset-photo-root");  // この下にテンプレートを追加していく
   let tmp=document.getElementById("asset-tmp-photo");   // テンプレートを取得
   let node,items,width,hight;                             //ループ用変数

    //
   // main
   //
   for(let i=0;i<1;i++){
      // テンプレートのクローンノードを作成
      node=tmp.content.cloneNode(true);

      // 説明文を記載
      items=node.querySelector("span");
      Elm_html(items,"画像1<br/>横縦比4:3で中央をトリミングします");

      //画像が変更された場合のリスナーを登録
      items=node.querySelector("input");
      items.addEventListener("change",asset_picture_preview);
      //子ノードを作成
      root.appendChild(node);
   } 
   
   //既に登録されている画像を埋め込み
     let w=rePaint();
     w.then(()=>{
     for(let obj of root.querySelectorAll(".pic")){
         width=obj.clientWidth;
         hight=parseInt(width*3/4);
         Elm_style(obj,"height",hight+"px");    
         Elm_style(obj,"backgroundImage",`url('img/${assetid}.jpg?${fRnd()}')`);
     }
   
     // ボックス領域を拡張
      let h=Elm_sumHight(root.parentNode);
      Elm_style(root.parentNode,"height",`min(80vh,${h}px)`);
   });
}