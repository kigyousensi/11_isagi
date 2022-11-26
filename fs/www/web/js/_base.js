// ////////////////////////////////////////////////////////////////////////////
// 基本情報
// ////////////////////////////////////////////////////////////////////////////
// イベントリスナーを受信して変更を実行
let base_listerner=(item)=>{
    let rc=0,val="";
    let item_id=item.target.getAttribute("id");
    // 入力エラーが発生していないか確認
    // 問題なければ値を取得
    if(item_id === "base-pword"){
        // パスワード変更の場合は既にチェック済みなので内容を取得
        val=document.getElementById("base-pword1").value;
    }
    else{ // その他の場合は入力チェックに引っかかっていないか確認して値を取得
        if(item.target.validity.valid && item.target.value.length >0){
            val=item.target.value;
        }else{rc=1;}
    }
    // ここまで問題なければ更新処理を実行
    if(rc==0){
        let test=new Promise((resolve_func)=>{
            setTimeout(resolve_func,1000,[1,item_id]);
        });
        test.then((recv)=>{
            console.log(recv);
        });
    }
}

// パスワードが一致していればパスワード変更ボタンを表示
let base_pwchek=()=>{
    // 一旦非表示
    Elm_text("base-pwderror","")// メッセージ初期化
    Elm_disable("base-pword");   // 変更ボタンを非活性化
     //変更ボタンを活性化させるかエラーを表示させる
    if(pwdcheck("base-pword1","base-pword2")){Elm_active("base-pword");}
    else{pwderr("base-pword1","base-pword2","base-pwderror");}
}
// イベントリスナーを登録
//  パスワード入力以外
let clicks=["base-pword"];
for(let i=0;i<clicks.length;i++){
    document.getElementById(clicks[i]).addEventListener("click",(el)=>{base_listerner(el);}); //email
  }
let forms=["base-email"];
forms.push("base-sns-twtr");forms.push("base-sns-twtr-sw");
forms.push("base-sns-inst");forms.push("base-sns-inst-sw");
for(let i=0;i<forms.length;i++){
  document.getElementById(forms[i]).addEventListener("change",(el)=>{base_listerner(el);}); //email
}
/// パスワード入力
let pws=["base-pword1","base-pword2"];
document.getElementById(pws[0]).addEventListener("change",()=>{base_pwchek();}); //email
document.getElementById(pws[1]).addEventListener("change",()=>{base_pwchek();}); //email
