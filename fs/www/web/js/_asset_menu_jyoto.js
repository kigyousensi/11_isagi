////////////////////////////////////////
// カードメニュー項目のアクション(譲渡)
////////////////////////////////////////

// 譲渡ボタンを押すと資産の譲渡ができる。
// 既に資産を譲渡しようとしている場合は譲渡のキャンセルができる。
// 証明書類の送付が完了していない場合は譲渡できない旨のメッセージを表示する
//
// 資産の譲渡の状況は譲渡スタンプ(asset-jyoto-stamp)に記録されている。
//   <p name="jyoto" class="asset-jyoto-stamp hide" data-state="false" data-user=""><span>譲渡手続中</span></p>
//   data-state { true = 譲渡手続き中 | false = 譲渡しようとしていない | close = 証明書類の送付が完了していない}
//   data-user 譲渡先のユーザー名
//   譲渡中はこのスタンプが画像の上に押される
//
//  data-state=falseの状態で譲渡を選択すると新規譲渡画面を表示する。    <div id="ch1-2-sub1">
//  data-state=trueの状態で譲渡を選択すると譲渡取り消し画面を表示する。 <div id="ch1-2-sub2">
//  data-state=closeの状態で譲渡を選択するとエラーメッセージを表示する。 altMsg()

// 譲渡項目を選択した際の動作 /////////
// 新規譲渡/譲渡取消し画面を表示///////
let asset_jyoto_item=(e)=>{
   asset_card_menu_close(e.parentNode);//カードメニューを閉じる
   //
   // define
   //
   let rootnode=e.parentNode.parentNode.parentNode;   // card
   let assetid=Elm_dataset_get(rootnode,"assetid");   // assetid
   let item=rootnode.querySelector('[name="jyoto"]'); // 譲渡スタンプ
   
   //
   // main
   //
   // 譲渡スタンプのstate属性、本人確認書類の状態で処理を分ける。
   if(Elm_dataset_get(item,"state")==="close"){      // 本人確認が済んでいない
      artMsg(type="error",title="所有者の確認",text="所収者の確認が完了していません。<br/>資産を登録した直後や譲渡された場合に本メッセージが表示されます。<br/>「証明書類を送る」であなたが本来の所有者であることを証明できます。<br/>あなたがこの資産の所有者であることを確認できるまで譲渡はできません。",submit="閉じる")
   }

   if(Elm_dataset_get(item,"state")==="false"){      // 新規譲渡画面を作成して表示する
      //
      // preprocess
      //
      //入力フォームの内容をリセット
      Elm_value("asset-jyoto-account","");               // 譲渡先のアカウントID
      Elm_value("asset-jyoto-pin","");                   // 譲渡用PIN
      Elm_disable("asset-jyoto-run");                    // 「譲渡する」ボタンを非活性化

      //
      // define
      //
      //ドキュメントオブジェクトを作成
      let funcbox=document.getElementById("ch1-2-sub1"); // 新規譲渡画面のルート
      Elm_dataset_set(funcbox,"assetid",assetid);        // 新規譲渡画面にassetidをセット

      //
      // main
      //

      //画面の冒頭のメッセージを作成
      // <メーカー> <モデル + サブモデル>を譲渡します
      Elm_text("asset-jyoto-account-msg",[""]);
      let items=funcbox.querySelectorAll('[name="product"]');        //新規譲渡画面側
      let carditems=rootnode.querySelectorAll('[name="product"]');   //カード側
      Elm_text(items[0],carditems[0].textContent);                 //メーカーをカード側からコピー
      Elm_text(items[1],carditems[1].textContent);                 //モデル+サブモデルをカード側からコピー

      //新規譲渡画面を表示
      Elm_view("ch1-2-sub1");
   }

   if(Elm_dataset_get(item,"state")==="true"){                      // 譲渡取消し画面を作成して表示
      //
      // define
      //
      //ドキュメントオブジェクトを作成
      let funcbox=document.getElementById("ch1-2-sub2");             // 譲渡取消し画面のルート
      Elm_dataset_set(funcbox,"assetid",assetid);                    // 譲渡取消し画面にassetidをセット

       //カード側から取消画面へメーカ等の情報をコピーして冒頭の説明文を作る
       //<メーカー> <モデル + サブモデル>は<ユーザー>に譲渡手続き中
      let items=funcbox.querySelectorAll('[name="product"]');        //譲渡取消し画面側
      let carditems=rootnode.querySelectorAll('[name="product"]');   //カード側
      Elm_text(items[0],Elm_get(carditems[0]));                   //メーカーをカード側からコピー
      Elm_text(items[1],Elm_get(carditems[1]));                   //モデル+サブモデルをカード側からコピー

      items=funcbox.querySelectorAll('[name="user"]');               //譲渡取消し画面側
      item=rootnode.querySelector('[name="jyoto"]');                 //カード側
      Elm_text(items[0],HtmlToForm(Elm_dataset_get(item,"user")));              //ユーザー名をカード側からコピー

      //譲渡取消し画面を表示
       Elm_view("ch1-2-sub2");
   }
}

// 新規譲渡画面への入力 ///////////////
// usae : asset_jyoto_active_button (e)
//    e:フォームノード
// 
// 新規譲渡画面の入力フォームに変化があれば内容を随時チェックし、問題なければ「譲渡する」ボタンを有効化する
// アカウント名のチェック
//       アカウントが存在するか
//       アカウントがあってもなくても結果をasset-jyoto-account-msgに表示する。
// 内容のチェックは複数の位置から行うため別関数とした。asset_jyoto_active_button_next();
// また、チェックと同時に「譲渡する」ボタンのリスナーも解除＆再設定する
let asset_jyoto_active_button=(e)=>{
   //
   // preprocess
   //
   // 「譲渡する」ボタンのリスナーを一旦解除
   document.getElementById("asset-jyoto-run").removeEventListener("click",asset_jyoto_run);

   //
   // main
   //
   // 譲渡先アカウントが変更された場合は先にアカウントがあるか確認してメッセージ欄に表示
   // ユーザーが存在しない場合はアカウントの入力欄を空白にする
   // (空白にしないと文字数だけでinputタグのステータスが正常扱いになるので)
   if(e.target.getAttribute("id")=="asset-jyoto-account"){
      // アカウントIDが変更になった場合
      // アカウントIDの書式が合っていれば実在するか確認する
      Elm_disable("asset-jyoto-run");        // 一旦ボタンを非活性化する
      if(Elm_check("asset-jyoto-account")){ //アカウントIDの書式チェック
         // アカウントの存在を問い合わせ
         // 開発中はA0000000001なら"Genki"、それ以外なら空白が帰ってくる。
         let data=[];
         if(Elm_get("asset-jyoto-account")==="A0000000001"){data={"user":"Genki&#39;s"};}
         else{data={"user":""};}
         let ajax=new Promise((resolve)=>{
            setTimeout(resolve,1000,data);
         });
         ajax.then((recv)=>{ // ajaxの結果
            if(recv["user"] !== ""){
               //  ユーザーが存在する場合は正常なメッセージを表示
               textMsg("asset-jyoto-account-msg","info",`${HtmlToForm(recv["user"])}さんに譲渡します。`);
               Elm_dataset_set("asset-jyoto-account","checkstate","true");   //入力フォームのステータスをtrueにする
               Elm_dataset_set("ch1-2-sub1","user",recv["user"]);       //取得したユーザー名を保存
            }
            else{
               //  ユーザーが存在しない場合はエラー表示
               textMsg("asset-jyoto-account-msg","err",`ユーザーが存在しません`);
               Elm_dataset_set("asset-jyoto-account","checkstate","false");   //入力フォームのステータスをfalseにする
            }
            asset_jyoto_active_button_next();//ボタンのステータス変更
         });
      }
      else{asset_jyoto_active_button_next();}
   }
   else{asset_jyoto_active_button_next();}
   
}

// 新規譲渡の入力欄チェック ////////////
// 入力欄が全て正しく入力されていれば「譲渡する」ボタンが有効になる。
// また、リスナーが登録される(asset_jyoto_run
let asset_jyoto_active_button_next=()=>{
   if(Elm_check("asset-jyoto-account") && Elm_dataset_check("asset-jyoto-account") && Elm_check("asset-jyoto-pin")){
      // アカウントIDとPINが正しく入力されている場合、譲渡するボタンをactiveにしてイベントリスナーを登録する
      Elm_active("asset-jyoto-run");
      document.getElementById("asset-jyoto-run").addEventListener("click",asset_jyoto_run);
   }else{
      // アカウントIDとPINのいずれかに問題がある場合は譲渡するボタンを無効にする
      Elm_disable("asset-jyoto-run");
   }
}

// 新規譲渡画面を閉じる /////////////////
// 単純に新規譲渡画面を閉じる。waitバーが表示されていれば非表示にしておく
let asset_jyoto_close=()=>{
   Elm_hide("ch1-2-sub1");
   Elm_hide("asset-jyoto-preload");
}

// 「譲渡する」ボタンの動作 /////////////
// 資産番号と譲渡先、PINをサーバーへ送るとともにカードに譲渡スタンプを表示する。
// カードスタンプを押す際に譲渡関連のステータスも更新する
let asset_jyoto_run=()=>{
   //
   // preprocess
   //
   Elm_view("asset-jyoto-preload"); //waitを表示する
   
   //
   // define
   //
    let assetid=Elm_dataset_get("ch1-2-sub1","assetid");          // 資産番号を新規譲渡画面から取得
    Elm_dataset_set("asset-jyoto-account","checkstate","false");  // 入力フォームのステータスをfalseにする
    let card=document.getElementById("asset_id_"+assetid);        // 操作対象のcard

   //
   // main
   //
   // ajaxcallした後カードのステータスを譲渡手続き中にしてダイアログを閉じる
   let data={
     "assetid":assetid,
     "touser":Elm_get("asset-jyoto-account"),
     "pin":Elm_get("asset-jyoto-pin")
   };
   // ajaxcall
   let ajaxcall=new Promise((resoleve)=>{
      setTimeout(resoleve,1500);
   });
   ajaxcall.then(()=>{
      // カードのステータスを譲渡手続き中に変更
      let item=card.querySelector('[name="jyoto"]');  // 譲渡スタンプ
      Elm_view(item);                                 // スタンプを表示
      Elm_dataset_set(item,"state","true");           // 譲渡中フラグを立てる
      Elm_dataset_set(item,"user",Elm_dataset_get("ch1-2-sub1","user"));   //譲渡先ユーザー

      // 新規譲渡画面を閉じる
      asset_jyoto_close();
   });
   
}

// 譲渡取り消し系 ///////////////////////
// 取り消すかやめるかの2択で、やめる場合は単純に画面を消す
// 取り消す場合はサーバーとローカル画面を更新

// 譲渡取り消し画面をクローズ////////////
// 単純に譲渡取り消し画面をクローズする。
// waitが表示されている場合は非表示に戻す
let asset_jyoto_reset_close=()=>{
   Elm_hide("ch1-2-sub2");
   Elm_hide("asset-jyoto-reset-preload");
}

// 譲渡取り消し処理 /////////////////////
// 取り消し画面で「譲渡を取り消す」を選択した場合はサーバーとローカルの更新　
let asset_jyoto_reset_run=()=>{
   //
   // preprocess
   //
   Elm_view("asset-jyoto-reset-preload");    // waitを表示

   //
   // define
   //
    let assetid=Elm_dataset_get("ch1-2-sub2","assetid");   //取消し画面から資産番号を取得
    let card=document.getElementById("asset_id_"+assetid); //card

   //
   // main
   // 
   // ajaxcallした後カードのステータスを通常に戻してダイアログを閉じる
   let data={"assetid":assetid};
   let ajaxcall=new Promise((resolve)=>{
      setTimeout(resolve,1500);
   });
   ajaxcall.then(()=>{
      // カードのステータスを通常の状態に変更
      let item=card.querySelector('[name="jyoto"]');  // 譲渡スタンプ   
      Elm_hide(item);                     // スタンプを非表示
      Elm_dataset_set(item,"state","false");         // 譲渡しないステータス
      Elm_dataset_set(item,"user","");               // 譲渡先ユーザーをリセット
      
      // 取り消し画面を閉じる
      asset_jyoto_reset_close();
   });
}

//######################################
// イベントリスナー
//######################################
// 新規譲渡画面のヘルプ ////////////////
// アカウントID
document.getElementById("asset-jyoto-account-help").addEventListener("click",()=>{
   artMsg(type="info",title="譲渡先アカウントID",text="譲渡する相手のアカウントID(A0000000001の様な11桁のアカウント)を記載して下さい。<br/>譲渡する相手が当サイトのアカウントを持ってる必要があります。譲渡する相手が当サイトのアカウントを持っておらず、アカウントを作成する予定も無い場合は「譲渡」ではなく「削除」を行って下さい。<br/>可能な限り譲渡先に当サイトのアカウントを作成して頂いて譲渡手続きを行うことを推奨致します。<br/>当サイトで譲渡手続きを行った場合、個体番号で現在の所有者を追跡できます。<br/>例えば「転売しない」約束で自転車を譲渡した場合、現在の利用者を追跡することで約束が守られているか確認できます。",submit="閉じる");
});
// PIN
document.getElementById("asset-jyoto-pin-help").addEventListener("click",()=>{
   artMsg(type="info",title="譲渡用PIN",text="譲渡手続きで使用するパスワードです。任意のパスワードを設定して譲渡相手に伝えて下さい。<br/>譲渡する相手がこのPINを入力することで資産の所有者があなたから譲渡先へ切り替わります。<br/>PINを使用することで誤った相手に譲渡されることを防止できます。例えばあなたが譲渡する相手のアカウントIDを誤って指定してしまっても、その相手はPINを知らないため譲渡を受けられません。",submit="閉じる");
});

// 譲渡入力画面の入力フォーム
document.getElementById("asset-jyoto-account").addEventListener("change",asset_jyoto_active_button);  // アカウントID
document.getElementById("asset-jyoto-pin").addEventListener("change",asset_jyoto_active_button);      // PIN
