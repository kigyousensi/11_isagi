////////////////////////////////////////
// 資産カード関連のアクション
////////////////////////////////////////

// 資産カードを作成 ////////////////////////
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
      let node,items;                   // 一時作業用変数

      node=tmp.content.cloneNode(true);   //テンプレートのクローンノードを作成
         /// root
         { // <div class="card">
            items=node.querySelectorAll('.card');
            Elm_dataset_set(items[0],"assetid",data["assetid"]);
            Elm_dataset_set(items[0],"type",data["type"]);
            Elm_attribute(items[0],"id","asset_id_"+data["assetid"]);
         }
         /// カードを作成
         { //// 画像
            items=node.querySelectorAll('[name="img"]');
            items[0].setAttribute("src","img/"+data["assetid"]+".jpg?"+fRnd());
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
            if(data["rel"]==="true")  {Elm_checkbox_set(items[0],true);}else{Elm_checkbox_set(items[0],false);} //公開
            if(data["repsw"]==="true"){Elm_checkbox_set(items[1],true);}else{Elm_checkbox_set(items[1],false);}  //盗難
         }
         { //// 資産情報
            items=node.querySelectorAll('[name="info"]');
            items[0].textContent="資産番号 : "+data["assetid"]+" ("+data["regist"]+"登録)";
            items[1].textContent="個体番号 : "+data["serial"];
         }
         { //防犯登録
            items=node.querySelectorAll('[name="asset-bouhan"]');
            Elm_value(items[0],data["bouhan"]);
            items[0].setAttribute("id","asset-bouhan-"+data["assetid"]);
            items[1].setAttribute("for","asset-bouhan-"+data["assetid"]);
            items[2].setAttribute("id","asset-bouhan-help-"+data["assetid"]);
            items[3].setAttribute("id","asset-bouhan-wait"+data["assetid"]);
            items[2].addEventListener("click",()=>{artMsg(type="info",title="防犯登録番号",text=`防犯登録シールまたは防犯登録カードに記載されている番号を記載して下さい。<br/>以下の場合は「ソ271929」と入力します。<p class="img"><img src="icon/msg-bouhantouroku.jpg"/></p><p class="msginfo"><i class='material-icons'>info_outline</i><span> -や()の入力は任意です</span></p>以下の記述は全て「ソ271929」と解釈されます。<ul><li>ソ271929</li><li>ソ-271929</li><li>(ソ)271929</li></ul>`,submit="閉じる");});
            
            //コメント
            items=node.querySelectorAll('[name="asset-comment"]');
            items[0].value=data["comment"];
            items[0].setAttribute("id","asset-comment-"+data["assetid"]);
            M.CharacterCounter.init(items[0]);
            items[1].setAttribute("for","asset-comment-"+data["assetid"]);
            items[2].setAttribute("id","asset-comment-help-"+data["assetid"]);
            items[3].setAttribute("for","asset-comment-wait"+data["assetid"]);
            items[2].addEventListener("click",()=>{artMsg(type="info",title="コメント",text=`購入年や購入場所、特徴(傷の位置、パーツの交換履歴等)を記載して下さい。<br/>「公開」スイッチをonにすると検索結果に表示されます。<p class="msginfo"><i class="material-icons">report</i><span>個人を特定できる情報は記載しないで下さい。</span></p>`,submit="閉じる");});
         }
         { ///// 盗難保険
            //保険会社(selectは実体化した後でinit)
            items=node.querySelectorAll('[name="asset-hoken1"');
            Elm_select_add(items[0],gInsurances);     //保険会社
            Elm_select_key(items[0],data["insura"]);
            Elm_attribute(items[0],"id","asset-hoken1-"+data["assetid"]);
            Elm_attribute(items[1],"id","asset-hoken1-wait"+data["assetid"]); //wait
            //お客様番号
            items=node.querySelectorAll('[name="asset-hoken2"'); 
            Elm_value(items[0],data["insuraid"]);
            items[0].setAttribute("id","asset-hoken2-"+data["assetid"]);
            items[1].setAttribute("for","asset-hoken2-"+data["assetid"]);
            items[2].setAttribute("id","asset-hoken2-wait"+data["assetid"]);
            //契約完了日
            items=node.querySelectorAll('[name="asset-hoken3"');
            M.Datepicker.init(items[0],{"format":"yyyy-mm-dd"});
            Elm_value(items[0],data["insuradt"]);
            items[0].setAttribute("id","asset-hoken3-"+data["assetid"]);
            items[1].setAttribute("for","asset-hoken3-"+data["assetid"]);
            items[2].setAttribute("id","asset-hoken3-wait"+data["assetid"]);
            //盗難受付窓口
            items=node.querySelectorAll('[name="asset-hoken4"');
            Elm_value(items[0],data["insuratel1"]);
            items[0].setAttribute("id","asset-hoken4-"+data["assetid"]);
            items[1].setAttribute("for","asset-hoken4-"+data["assetid"]);
            items[2].setAttribute("id","asset-hoken4-help-"+data["assetid"]);
            items[3].setAttribute("id","asset-hoken4-wait"+data["assetid"]);
            items[2].addEventListener("click",()=>{artMsg(type="info",title="保険手続き窓口",text=`盗難保険の手続き用窓口の電話番号を記載して下さい。<p>外出先で自転車が盗難に遭った場合のロードサービスなど、緊急時の連絡先は「フィールドサービス窓口」に記載して下さい。</p>`,submit="閉じる");});
            //フィールドサービス窓口
            items=node.querySelectorAll('[name="asset-hoken5"');
            Elm_value(items[0],data["insuratel2"]);
            items[0].setAttribute("id","asset-hoken5-"+data["assetid"]);
            items[1].setAttribute("for","asset-hoken5-"+data["assetid"]);
            items[2].setAttribute("id","asset-hoken5-help-"+data["assetid"]);
            items[3].setAttribute("id","asset-hoken5-wait"+data["assetid"]);
            items[2].addEventListener("click",()=>{artMsg(type="info",title="盗難受付窓口",text=`盗難に遭った際のフィールドサービス窓口の電話番号を記載して下さい。<p>補償など保険の手続きに関する連絡先は「保険手続き窓口」に記載して下さい。</p>`,submit="閉じる");});

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
            items[2].addEventListener("click",()=>{artMsg(type="info",title="盗難届の提出日",text=`盗難届の提出日をここに記録しておくことで時効の成立日などの参考になります。この情報は検索結果に表示されません。<p class="msginfo"><i class="material-icons">info_outline</i><span>盗難に遭った場合</span></p><ul><li>上部の「公開」スイッチと「盗難」スイッチをONにして下さい。</li><li>「盗難」スイッチをonにすると検索結果に警告が表示され、発見者があなたにメッセージを送信できます。<p class="img"><img src="icon/msg-tounanmsg.jpg"/></p></p></li><li>盗難届の提出日を記載しなくても「公開」「盗難」スイッチをONにできます。</li><li>本システムの利用に関わらず、速やかに警察へ盗難届を提出して下さい。</li></ul>`,submit="閉じる");});
            //盗難届番号
            items=node.querySelectorAll('[name="asset-repno"]');
            items[0].value=data["repno"];
            items[0].setAttribute("id","asset-repno-"+data["assetid"]);
            items[1].setAttribute("for","asset-repno-"+data["assetid"]);
            items[2].setAttribute("id","asset-repno-help-"+data["assetid"]);
            items[3].setAttribute("id","asset-repno-wait"+data["assetid"]);
            items[2].addEventListener("click",()=>{artMsg(type="info",title="盗難届の受理番号",text=`盗難届の受理番号をここに記載しておくと、盗難車が見つかった際に本人確認の参考になります。この情報は検索結果に表示されません。<p class="msginfo"><i class="material-icons">info_outline</i><span>盗難に遭った場合</span></p><ul><li>上部の「公開」スイッチと「盗難」スイッチをONにして下さい。</li><li>「盗難」スイッチをonにすると検索結果に警告が表示され、発見者があなたにメッセージを送信できます。<p class="img"><img src="icon/msg-tounanmsg.jpg"/></p></p></li><li>盗難届の提出日を記載しなくても「公開」「盗難」スイッチをONにできます。</li><li>本システムの利用に関わらず、速やかに警察へ盗難届を提出して下さい。</li></ul>`,submit="閉じる");});
         }
         /// カードをrsltの子要素として追加
         rslt.appendChild(node);
         { // 保険会社のselecct
           // M.FormSelectはtemplate内では使えない様なので実体化した後でinitする
           let elm,selparent,size=5;
           elm=document.getElementById("asset-hoken1-"+data["assetid"]);//selectタグ
           if(!isNull(elm.getAttribute("size"))){size=elm.getAttribute("size");} //selectのsize
           selparent=elm.parentNode.parentNode.parentNode.parentNode;   // selectの上部の上限となる親要素(card-info)
           //selectオブジェクトからULを作成
           M.FormSelect.init(elm);
           //selectの表示位置を補正
           elm.parentNode.querySelector("input").addEventListener("click",{"data":{"parent":selparent,"size":size},handleEvent:setSelectHeight});
            
         }
}

let setSelectHeight=function(e){
   //selectの親要素がoverflow:hideになっている場合、はみ出した要素が非表示になってしまう。
  //下限は計算されているようだが上部を計算するロジックが入っていないためここで計算してULのcssを上書きする
   setTimeout(()=>{
      let ul=e.target.parentNode.querySelector("ul");
      //要素の場所
      let rectP=this.data["parent"].getBoundingClientRect();  //親要素のwindow位置
      let rectT=e.target.getBoundingClientRect();             //input要素のwindow位置

      //要素の高さ
      let hul,hli;                     //selectで設定されているsize×liの高さ=ulの高さにするための変数
      let sposition;                   //表示の開始位置
      hli=parseInt(ul.firstChild.offsetHeight);  //1行の高さ
      hul=this.data["size"]*hli;       //ulの高さ=liの高さ×size(表示する行数)
      if(hul > this.data["parent"].height *0.8){ hul=hul*0.8} //親要素より大きくしない
      

      //表示位置を決定
      // 基本的に下。下に余裕がなければ上
      /// 開始位置は以下の内もっとも高い位置にあるものを採用
      ///  ul要素の下限の位置
      ///  親要素の下限の位置-ul-liの高さ 
      sposition=Math.min(parseInt(rectP.bottom-hul),parseInt(rectT.bottom)) -parseInt(rectT.bottom); 
   
      // 表示位置を変更
      Elm_style(ul,"height",hul+"px");
      Elm_style(ul,"top",sposition+"px");
   },10);
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
    let higt;//オープンした後の高さ

    //
    // main
    //
    // 算出した大きさでカードの詳細を表示する or 詳細を閉じる
    if(tgt[0].clientHeight==0){ //オープンする
        higt=Elm_sumHight(tgt[0]); 
        Elm_style(tgt[0],"height",higt+"px");
        tgt[0].style.paddingBottom="24px";
    }
    else{ //クローズする
        Elm_style(tgt[0],"height",0);
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
      heih=Elm_sumHight(ul);
      Elm_style(ul,"height",heih+"px");
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
   Elm_style(ul,"height",0);
   ul.style.marginTop=0;
   ul.style.backgroundColor="rgba(255,255,255,0)";
   ul.style.width="0";
}
