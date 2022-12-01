// ////////////////////////////////////////////////////////////////////////////
// 基本情報
// ////////////////////////////////////////////////////////////////////////////
// 
// イベントを受信して変更内容をサーバーへ送信する
// 
let base_listerner=(item)=>{
    ///////////////////////////////
    // init 
    ///////////////////////////////
    let rc=0,val="";
    let item_id=item.target.getAttribute("id"); //  操作対象のフォームのID
    let texlist=["account","email","pword"];     // テキスト入力欄のリスト(SNS除く)
    let snslist=["sns-twtr","sns-inst"];        // SNSのリスト(SNSアカウントの入力欄とスイッチで共用)
    // ウエイトサークル用の配列を作る
    let weights=[];      //ウエイトサークルのid       
    for(let i=0;i<texlist.length;i++){        // 入力フォームにリンクするウエイトサークルを設定
        weights["base-"+texlist[i]]="base-"+texlist[i]+"-wait";
    }
    for(let i=0;i<snslist.length;i++){ //SNSアカウントとスイッチにリンクするウエイトサークルを設定
        weights["base-"+snslist[i]]="base-"+snslist[i]+"-wait";
        weights["base-"+snslist[i]+"-sw"]="base-"+snslist[i]+"-wait";
     }

    // 入力エラーが発生していないか確認
    if(item_id === "base-pword"){
        // パスワード変更の場合は既にチェック済みなので内容を取得
        val=document.getElementById("base-pword1").value;
    }
    if(item_id !== "base-pword"){ // その他の場合は入力チェックに引っかかっていないか確認して値を取得
        if(item.target.validity.valid && item.target.value.length >0){
            val=item.target.value;
        }else{rc=1;}
    }

    // SNSスイッチをONにした場合はSNSのアカウントが入力されているか確認。
    // 入力されていない場合はスイッチをオフに戻してrc=2(後で警告を表示）に設定。
    let snscheckTextitem;
    for(let i=0;i<snslist.length;i++){
        if(item_id=="base-"+snslist[i]+"-sw" && item.target.checked==true){
            snscheckTextitem=document.getElementById("base-"+snslist[i]);
            if(snscheckTextitem.value.length==0 || snscheckTextitem.validity.valid==false){
                item.target.checked=false;rc=2;
            }
        }
    }
    ///////////////////////////////
    // main
    ///////////////////////////////
    // ここまで問題なければ更新処理を実行
    if(rc==0){
        // ウエイトサークルを活性化
        Elm_view(weights[item_id]);

        // 変更をサーバーへ送信 
        let callajx=new Promise((resolve_func)=>{
            setTimeout(resolve_func,2000,[1,item_id]);
        });
        callajx.then((recv)=>{
            // アカウント名を変更した場合は右上の表示名を変更
            if(item_id === "base-account"){Elm_text("account-name",document.getElementById("base-account").value);}
            
            // SNSスイッチをONにした場合はSNSアカウントの編集をロックする
            // オフにした場合はロックを解除する
            for(let i=0;i<snslist.length;i++){
                if(item_id==="base-"+snslist[i]+"-sw" && item.target.checked==true){Elm_disable("base-"+snslist[i]);}
                if(item_id==="base-"+snslist[i]+"-sw" && item.target.checked==false){Elm_active("base-"+snslist[i]);}
            }
            Elm_hide(weights[item_id]); // ウエイトサークルを非活性化
        });
    }
    ///////////////////////////////
    // end
    ///////////////////////////////
    switch(rc){
        case 2:artMsg(type="error",title="SNSアカウントエラー",text="SNSのアカウントを指定して下さい",submit="閉じる");break;
    }
}

// 
// 2つのパスワード入力欄の値をチェックする
// パスワードが一致していればパスワード変更ボタンを表示する
// 
let base_pwchek=()=>{
    // 一旦非表示
    Elm_text("base-pwderror","")// メッセージ初期化
    Elm_disable("base-pword");   // 変更ボタンを非活性化
     //変更ボタンを活性化させるかエラーを表示させる
    if(pwdcheck("base-pword1","base-pword2")){Elm_active("base-pword");}
    else{pwderr("base-pword1","base-pword2","base-pwderror");}
}

// 
// ヘルプメッセージ
// 
let base_help=(item)=>{
    let item_id=item.target.getAttribute("id");
    let helptext="";helptitle="";
  switch(item_id){
     case "base-account-help"   : helptitle="表示名";    
        helptext="照会者に表示される名前です。<br/>3〜16文字で記入して下さい。<br/>@&lt;&gt;&amp;シングルクオート、ダブルクオート、スペースは使用できません";break;
     case "base-id-help"        : helptitle="アカウントID";
        helptext="あなたの一意なアカウントIDです。変更できません。";break;
     case "base-token-help"     : helptitle="トークン";
        helptext="他社のAPIと連携するためのトークンです。<br/>例えばフリマアプリから照会する場合に使用します。この機能を使用するにはフリマアプリがトークンに対応している必要があります。<br/>トークンは他の誰かがあなたに成りすますのを防ぐための情報です。第3者には教えないで下さい。";break;
     case "base-sns-twtr-sw-help" : helptitle="twitterアカウント";
        helptext="照会者にtwitterのアカウントを公開します。<br/>照会者はtwitterで正式な所有者(つまりあなた)を発見できます。\
        例えば盗まれた自転車がtwitterで転売されている場合、照会者があなたに連絡する助けになります。";break;
     case "base-sns-inst-sw-help" : helptitle="instagramアカウント";
        helptext="照会者にinstagramのアカウントを公開します。<br/>スイッチをオンにすると照会者はインスタグラムで正式な所有者(つまりあなた)を発見できます。<br/>\
        例えば盗まれた自転車がinstagramで転売されている場合、照会者があなたに連絡する助けになります。";break;
 
  }
  artMsg("info",helptitle,helptext,submit="ok");
}

// 
// イベントリスナーを登録
// 

/// パスワード入力フォーム
let pws=["base-pword1","base-pword2"];
document.getElementById(pws[0]).addEventListener("change",()=>{base_pwchek();}); //password1
document.getElementById(pws[1]).addEventListener("change",()=>{base_pwchek();}); //password2

///  パスワード入力以外のフォーム
let clicks=["base-pword"];
for(let i=0;i<clicks.length;i++){
    document.getElementById(clicks[i]).addEventListener("click",(el)=>{base_listerner(el);}); //変更ボタン
  }
let forms=["base-account","base-email"];
forms.push("base-sns-twtr");forms.push("base-sns-twtr-sw");//twitterスイッチ
forms.push("base-sns-inst");forms.push("base-sns-inst-sw");//インスタグラムスイッチ
for(let i=0;i<forms.length;i++){
  document.getElementById(forms[i]).addEventListener("change",(el)=>{base_listerner(el);}); //イベント登録
}

/// ヘルプボタン
let helps=["base-account-help","base-id-help","base-token-help"];
helps.push("base-sns-twtr-sw-help");
helps.push("base-sns-inst-sw-help");
for(let i=0;i<helps.length;i++){
  document.getElementById(helps[i]).addEventListener("click",(el)=>{base_help(el);}); //ヘルプイベント
}