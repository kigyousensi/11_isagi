////////////////////////////////////////
// カードメニュー項目のアクション(削除)
////////////////////////////////////////
// 削除ボタンを押すと本当に削除するか確認するダイアログを表示させる(yesnoMsg)
// yesno画面の応答(yes or no)を受け取って、yesならサーバー上のデータと画面を更新 

// 削除の確認 //////////////////////
let asset_delete_item=(e)=>{
   //
   // preprocess
   //
   asset_card_menu_close(e.parentNode);   //カードメニューを閉じる

   //
   // define
   //
   let rootnode=e.parentNode.parentNode.parentNode;   //card
   let assetid=rootnode.dataset.assetid;              //資産番号を取得

   //
   // main
   //
   // yesnoMsgにコールバック関数(asset_delete_run)と削除対象のassetidを渡してダイアログを表示する
   yesnoMsg("資産の削除","この資産を削除しますか？","asset_delete_run",[assetid]);
}

// 削除処理 ////////////////////////
// yesnoMsg画面の応答
let asset_delete_run=(ansr,prm)=>{
   // ansr { yes | no }
   // prm=[assetid];
   if(ansr==='yes'){ // 削除に同意した場合は削除処理を継続
      let ajaxcall=new Promise((resolve_func)=>{
         // サーバー上のデータを削除
         setTimeout(resolve_func,1000);
      });
      ajaxcall.then(()=>{
         // 続いて画面の表示を変更
         let root=document.getElementById('asset_id_'+prm[0]); //cardにはid='asset_id_資産番号'が定義されている
         root.parentNode.removeChild(root);
      });
   }
}
