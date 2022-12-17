////////////////////////////////////////
// カード関連のアクション
////////////////////////////////////////

// カードを作成 ////////////////////////
// usage asset_create_card(data)
//  data={"assetid":"Axxxxxxxx".....} // サーバーサイドまたは新規作成フォームから受信した形式
//
// asset_constでサーバーサイドから資産の一覧を取得した際に本関数を使用する他、
// 更新や新規作成でも本関数を使用する
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
            items[0].setAttribute("data-type",data["type"]);
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
            /// proofがtrueならjyotoの状態で値を設定
            ///  jyotoが空白 = 譲渡の予定がない > スタンプ非表示。state=false。譲渡先名=""
            ///  jyotoが指定 = 譲渡の予定あり   > スタンプ表示。  state=true。 譲渡先名=指定された値
            /// proofがfalseなら譲渡できない    > スタンプ非表示。state=close。譲渡名=""
            if(data["proof"]==="true"){ //本人確認済み
               if(data["jyoto"] == ""){ // 譲渡予定なし
                  elm.classList.add("hide");
                  elm.dataset.state="false";
                  elm.dataset.user="";
               }
               else{ //譲渡予定あり
                  elm.classList.remove("hide");
                  elm.dataset.state="true";
                  elm.dataset.user=data["jyoto"];
               }
            }
            else{ //本人未確認
               elm.classList.add("hide");
                  elm.dataset.state="close";
                  elm.dataset.user="";
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
            if(data["rel"]==="true"){items[0].checked=true;}else{items[0].checked=false;}    //公開
            if(data["repsw"]==="true"){items[1].checked=true;}else{items[1].checked=false;}  //盗難
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
// usage : setAssetCardDetail(el)
//   el : クリックイベントを発行したエレメント。
//        el.targetでノードを取得できる。
//
// カードの画像をタップする本関数が呼ばれ、隠れていた詳細が表示される。
// 再びカードの画像をタップすると詳細が閉じる。
// カードが再度タップされたか否かはclientHeightの高さで判断する。(0より大きければクローズし、0ならオープンする)
// カードを開く際はカード内の要素の高さを合計して全体の高さを算出する。
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
