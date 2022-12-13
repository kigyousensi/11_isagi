// ////////////////////////////////////////////////////////////////////////////
// 資産登録画面
// ////////////////////////////////////////////////////////////////////////////
//######################################
// 初期化
//######################################

//初期画面の設定 //////////////////////
//
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

   //サーバーから資産一覧を取得
   let ajaxcall=new Promise((resolve_func)=>{
       let rt=[
         {"assetid":"X1000001","maker":"GIANT","model":"TCR","model-detail":"SL1","regist":"2022-12-10","serial":"K7EK20662","bouhan":"千123456789","comment":"メモ","rel":"true","repsw":"true","repdate":"2022-10-10","repno":"A00001","jyoto":"B01"},
         {"assetid":"X1000002","maker":"Bianchi","model":"SPRINT","model-detail":"DISK","regist":"2022-12-10","serial":"K7EK20663","bouhan":"千123456780","comment":"メモ","rel":"false","repsw":"false","repdate":"2022-10-10","repno":"A00002","jyoto":""}
      ];
       setTimeout(resolve_func,1000,rt);
   });

   //
   // proc
   //
   ajaxcall.then((recv)=>{
      ///
      /// main
      /// 
      /// 受信した検索結果を元にテンプレートからカードを作成
      for(let i=0;i<recv.length;i++){asset_create_card(recv[i]);}
   });
}


//######################################
// アクション
//######################################

////////////////////////////////////////
// カード関連のアクション
////////////////////////////////////////

// カードを作成 ////////////////////////
// 資産は１台づつカードで表示する。カードはテンプレートから取得。
// イベントリスナーもここで登録する
// サーバーサイドから資産の一覧を取得した際に本関数を使用する他、
// 更新や新規作成でも本関数を使用する
// data={"assetid":"Axxxxxxxx".....} // サーバーサイドまたは新規作成フォームから受信した形式
let asset_create_card=(data)=>{
      ///
      /// define
      ///
      let rslt=document.getElementById("asset-top");  // この下にカードを追加していく
      let tmp=document.getElementById("asset-tmp");   // テンプレートを取得
      let node,items,elm;                             //ループ用変数

      node=tmp.content.cloneNode(true);   //テンプレートのクローンノードを作成
         /// root
         { // <div class="card">
            items=node.querySelectorAll('.card');
            items[0].setAttribute("data-assetid",data["assetid"]);
            items[0].setAttribute("id","asset_id_"+data["assetid"]);
         }
         /// カードを作成
         { //// 画像
            items=node.querySelectorAll('[name="img"]');
            items[0].setAttribute("src","img/"+data["assetid"]+".jpg");
            items[0].setAttribute("onclick","setAssetCardDetail(this)");
         }
         { //// 譲渡手続中の表示
            elm=node.querySelector('[name="jyoto"]');
            if(data["jyoto"] !== ""){
               elm.classList.remove("hide");
               elm.dataset.state="true";
               elm.dataset.user=data["jyoto"];
            }
         }
         { //// メーカーや型名+サブモデル
            items=node.querySelectorAll('[name="product"]');
            items[0].textContent=data["maker"];
            items[1].textContent=data["model"]+" "+data["model-detail"];
         }
         { //// カードメニューボタン
            items=node.querySelectorAll('[name="more"]');
            items[0].addEventListener("click",asset_card_menu);
         }
         { //// スイッチ
            items=node.querySelectorAll('[name="sw"]');
            if(data["rel"]==="true"){items[0].checked=true;}else{items[0].checked=false;}
            if(data["repsw"]==="true"){items[1].checked=true;}else{items[1].checked=false;}
         }
         { //// 資産情報
            items=node.querySelectorAll('[name="info"]');
            items[0].textContent="資産番号 : "+data["assetid"]+" ("+data["regist"]+"登録)";
            items[1].textContent="個体番号 : "+data["serial"];
         }
         { //防犯登録
            items=node.querySelectorAll('[name="asset-bouhan"]');
            items[0].value=data["bouhan"];
            items[0].setAttribute("id","asset-bouhan-"+data["assetid"]);
            items[1].setAttribute("for","asset-bouhan-"+data["assetid"]);
            items[2].setAttribute("id","asset-bouhan-help-"+data["assetid"]);
            items[3].setAttribute("id","asset-bouhan-wait"+data["assetid"]);
            items[2].addEventListener("click",()=>{artMsg(type="info",title="防犯登録番号",text="()や-の入力は任意です。以下の記述は全て同じ内容とみなされます。<ul><li>千A123456</li><li>(千)-A123456</li><li>千)A123456</li></ul>",submit="閉じる");});
            
            //コメント
            items=node.querySelectorAll('[name="asset-comment"]');
            items[0].value=data["comment"];
            items[0].setAttribute("id","asset-comment-"+data["assetid"]);
            M.CharacterCounter.init(items[0]);
            items[1].setAttribute("for","asset-comment-"+data["assetid"]);
            items[2].setAttribute("id","asset-comment-help-"+data["assetid"]);
            items[3].setAttribute("for","asset-comment-wait"+data["assetid"]);
            items[2].addEventListener("click",()=>{artMsg(type="info",title="コメント",text="購入年や購入場所、特徴(傷の位置、パーツの交換履歴等)を記載して下さい。",submit="閉じる");});
         }
         { //// 盗難届
            //届出日
            items=node.querySelectorAll('[name="asset-repdate"]');
            M.Datepicker.init(items[0],{"format":"yyyy-mm-dd"});
            items[0].value=data["repdate"];
            items[0].setAttribute("id","asset-repdate-"+data["assetid"]);
            items[1].setAttribute("for","asset-repdate-"+data["assetid"]);
            items[2].setAttribute("id","asset-repdate-help-"+data["assetid"]);
            items[3].setAttribute("id","asset-repdate-wait"+data["assetid"]);
            items[2].addEventListener("click",()=>{artMsg(type="info",title="盗難届の提出日",text="盗難にあった場合は上部の「公開」スイッチと「盗難」スイッチをONにして下さい。<br/>盗難届の提出日をここに記録しておくことで時効の成立日などの参考になります。この情報は検索結果に表示されません。",submit="閉じる");});
            //盗難届番号
            items=node.querySelectorAll('[name="asset-repno"]');
            items[0].value=data["repno"];
            items[0].setAttribute("id","asset-repno-"+data["assetid"]);
            items[1].setAttribute("for","asset-repno-"+data["assetid"]);
            items[2].setAttribute("id","asset-repno-help-"+data["assetid"]);
            items[3].setAttribute("id","asset-repno-wait"+data["assetid"]);
            items[2].addEventListener("click",()=>{artMsg(type="info",title="盗難届の受理番号",text="盗難にあった場合は上部の「公開」スイッチと「盗難」スイッチをONにして下さい。<br/>盗難届の受理番号をここに記載しておくと、盗難車が見つかった際に本人確認の参考になります。この情報は検索結果に表示されません。",submit="閉じる");});
         }
         /// カードをrsltの子要素として追加
         rslt.appendChild(node);
}

// カードの開閉 ///////////////////////
// カードの画像をタップすると詳細が表示される。
// 詳細を表示する際は表示する内容の大きさを取得してcard-info領域の大きさをCSSで拡張する。
// 高さを取得する際はブロックの大きさだけでなく上下のmarginも加算する必要があるので注意。
// 再びカードの画像をタップすると詳細が閉じる。
// カードが再度タップされたか否かはclientHeightの高さで判断する。(0より大きければクローズし、0ならオープンする)
let setAssetCardDetail=(el)=>{
    //
    // define
    //
    // card-info領域の高さを算出
    let tgt=el.parentElement.parentElement.querySelectorAll(".card-info");
    let higt=0;let style;
    for(let obj of tgt[0].querySelectorAll(":scope> div")){
         style=window.getComputedStyle(obj);
         higt+=obj.offsetHeight+parseInt(style.marginTop.replace(/[a-zA-Z]/g,""))+parseInt(style.marginBottom.replace(/[a-zA-Z]/g,""));
    }

    //
    // main
    //
    // 算出した大きさでカードの詳細を表示する or 詳細を閉じる
    if(tgt[0].clientHeight==0){ //オープンする
        tgt[0].style.height=higt+"px";
        tgt[0].style.paddingBottom="24px";
    }
    else{ //クローズする
        tgt[0].style.height=0;
        tgt[0].style.paddingBottom="0";
    }
}

////////////////////////////////////////
// カードメニューのアクション
////////////////////////////////////////

// カードメニューを開く ///////////////
// カードメニューをクリックすると削除、譲渡等のメニューが表示される。
// メニューはULタグで作成している。
let asset_card_menu=(e)=>{
   //
   // define
   //
   let heih=0;
   let rootnode=e.target.parentNode.parentNode.parentNode;  //cardノード
   let ul=rootnode.querySelector('[name="cardmenu"]');      //カードメニューの本体

   //
   // main
   //
   // カードメニューの高さが0ならオープン、0より大きいならクローズする
   // カードメニューのクローズは他の関数からも呼ばれるので別関数とする
   if(parseInt(ul.style.height.replace(/[a-zA-Z]/g,""))==0 || ul.style.height==""){ // オープン
      let lis=ul.querySelectorAll(":scope>li");
      for(let obj of lis){heih+=obj.offsetHeight; } //高さを算出
      ul.style.height=heih+"px";
      ul.style.marginTop=-1*heih+"px";
      ul.style.backgroundColor="rgba(255,255,255,1)";
      ul.style.width="150px";
   }else{ // クローズ
    asset_card_menu_close(ul)
   };
}

// カードメニューを閉じる ///////////
let asset_card_menu_close=(ul)=>{
   //
   // main
   //
   // 単純にカードメニューを閉じるだけ
   ul.style.height=0;
   ul.style.marginTop=0;
   ul.style.backgroundColor="rgba(255,255,255,0)";
   ul.style.width="0";
}

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

////////////////////////////////////////
// カードメニュー項目のアクション(譲渡)
////////////////////////////////////////

// 譲渡ボタンを押すと資産の譲渡ができる。
// 既に資産を譲渡しようとしている場合は譲渡のキャンセルができる。
// 資産の譲渡の状況は譲渡スタンプ(asset-jyoto-stamp)に記録されている。
//   <p name="jyoto" class="asset-jyoto-stamp hide" data-state="false" data-user=""><span>譲渡手続中</span></p>
//   data-state { true = 譲渡手続き中 | false = 譲渡しようとしていない}
//   data-user 譲渡先のユーザー名
//   譲渡中はこのスタンプが画像の上に押される
//
//  data-state=falseの状態で譲渡を選択すると新規譲渡画面を表示する。    <div id="ch1-2-sub1">
//  data-state=trueの状態で譲渡を選択すると譲渡取り消し画面を表示する。 <div id="ch1-2-sub2">

// 譲渡項目を選択した際の動作 /////////
// 新規譲渡/譲渡取消し画面を表示///////
let asset_jyoto_item=(e)=>{
   asset_card_menu_close(e.parentNode);//カードメニューを閉じる
   //
   // define
   //
   let rootnode=e.parentNode.parentNode.parentNode;   // card
   let assetid=rootnode.dataset.assetid;              // assetid
   let item=rootnode.querySelector('[name="jyoto"]'); // 譲渡スタンプ
   
   //
   // main
   //
   // 譲渡スタンプのstate属性で処理を分岐
   if(item.dataset.state==="false"){
      //
      // 新規譲渡画面を作成して表示する
      //
      //ドキュメントオブジェクトを作成
      let funcbox=document.getElementById("ch1-2-sub1"); // 新規譲渡画面のルート
      funcbox.dataset.assetid=assetid;                   // 新規譲渡画面にassetidをセット

      //入力フォームの内容をリセット
      Elm_value("asset-jyoto-account","");               // 譲渡先のアカウントID
      Elm_value("asset-jyoto-pin","");                   // 譲渡用PIN
      Elm_disable("asset-jyoto-run");                    // 「譲渡する」ボタンを非活性化

      //画面の冒頭のメッセージを作成
      // <メーカー> <モデル + サブモデル>を譲渡します
      let items=funcbox.querySelectorAll('[name="product"]');        //新規譲渡画面側
      let carditems=rootnode.querySelectorAll('[name="product"]');   //カード側
      items[0].textContent=carditems[0].textContent;                 //メーカーをカード側からコピー
      items[1].textContent=carditems[1].textContent;                 //モデル+サブモデルをカード側からコピー

      //新規譲渡画面を表示
      Elm_view("ch1-2-sub1");
   }
   else{
      //
      // 譲渡取消し画面を作成して表示
      //

      //ドキュメントオブジェクトを作成
      let funcbox=document.getElementById("ch1-2-sub2");    // 譲渡取消し画面のルート
       funcbox.dataset.assetid=assetid;                     // 譲渡取消し画面にassetidをセット

       //取り消しメニューの説明文を作成
       //<メーカー> <モデル + サブモデル>は<ユーザー>に譲渡手続き中
      let items=funcbox.querySelectorAll('[name="product"]');        //譲渡取消し画面側
      let carditems=rootnode.querySelectorAll('[name="product"]');   //カード側
      items[0].textContent=carditems[0].textContent;                 //メーカーをカード側からコピー
      items[1].textContent=carditems[1].textContent;                 //モデル+サブモデルをカード側からコピー

      items=funcbox.querySelectorAll('[name="user"]');               //譲渡取消し画面側
      item=rootnode.querySelector('[name="jyoto"]');                 //カード側
      items[0].textContent=item.dataset.user;                        //ユーザー名をカード側からコピー

      //譲渡取消し画面を表示
       Elm_view("ch1-2-sub2");
   }
}
// 新規譲渡画面への入力 ///////////////
// 新規譲渡画面の入力フォームに変化があれば内容を随時チェックし、問題なければ「譲渡する」ボタンを有効化する
// アカウント名が変更になった場合は先にアカウントが存在するか確認する
// アカウントがあってもなくても結果をasset-jyoto-account-msgに表示する。
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
      if(Elm_check("asset-jyoto-account")){ //アカウントIDの書式チェック
         // アカウントの存在を問い合わせ
         // 開発中はA0000000001なら"Genki"、それ以外なら空白が帰ってくる使用とした。
         let data=[];
         if(Elm_get("asset-jyoto-account")[1]==="A0000000001"){data={"user":"Genki"};}
         else{data={"user":""};}
         let ajax=new Promise((resolve)=>{
            setTimeout(resolve,1000,data);
         });
         ajax.then((recv)=>{ // ajaxの結果
            if(recv["user"] !== ""){
               //  ユーザーが存在する場合は正常なメッセージを表示
               textMsg("asset-jyoto-account-msg","info",`${recv["user"]}に譲渡します。`);
               document.getElementById("ch1-2-sub1").dataset.user=recv["user"];
            }
            else{
               //  ユーザーが存在しない場合は入力欄を空白にしてエラー表示
               textMsg("asset-jyoto-account-msg","err",`ユーザーが存在しません`);
               Elm_text("asset-jyoto-account","");
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
   if(Elm_check("asset-jyoto-account") && Elm_check("asset-jyoto-pin")){
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
    let assetid=document.getElementById("ch1-2-sub1").dataset.assetid; // 資産番号を新規譲渡画面から取得
    let card=document.getElementById("asset_id_"+assetid);             // card

   //
   // main
   //
   // ajaxcallした後カードのステータスを譲渡手続き中にしてダイアログを閉じる
   let data={
     "assetid":assetid,
     "touser":Elm_get("asset-jyoto-account")[1],
     "pin":Elm_get("asset-jyoto-pin")[1]
   };
   // ajaxcall
   let ajaxcall=new Promise((resoleve)=>{
      setTimeout(resoleve,1500);
   });
   ajaxcall.then(()=>{
      // カードのステータスを譲渡手続き中に変更
      let item=card.querySelector('[name="jyoto"]');        // 譲渡スタンプ
      item.classList.remove("hide");                        // スタンプを表示
      item.dataset.state="true";                            // 譲渡中フラグを立てる
      item.dataset.user=document.getElementById("ch1-2-sub1").dataset.user;   //譲渡先ユーザー

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
    let assetid=document.getElementById("ch1-2-sub2").dataset.assetid;  //取消し画面から資産番号を取得
    let card=document.getElementById("asset_id_"+assetid);              //card

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
      item.classList.add("hide");                     // スタンプを非表示
      item.dataset.state="false";                     // 譲渡しないステータス
      item.dataset.user="";                           // 譲渡先ユーザーをリセット
      
      // 取り消し画面を閉じる
      asset_jyoto_reset_close();
   });
}

////////////////////////////////////////
// 証明書類の送付
////////////////////////////////////////
let asset_prof_item=(e)=>{
   console.log("証明書類");
   asset_card_menu_close(e.parentNode);//カードメニューを閉じる
   //証明書類送付フォームを表示
}
////////////////////////////////////////
// 画像の変更
////////////////////////////////////////
let asset_photo_item=(e)=>{
   console.log("画像を変更");
   asset_card_menu_close(e.parentNode);//カードメニューを閉じる

}
//######################################
// css調整
//######################################
// 編集ボタン
// 画面右下に編集ボタンを作成する
M.FloatingActionButton.init(document.getElementById("asset-add"));

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
