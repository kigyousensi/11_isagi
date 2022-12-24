// ////////////////////////////////////////////////////////////////////////////
// パスワードリセット画面
// ////////////////////////////////////////////////////////////////////////////
function resetbutton_control(){ //リセットボタンの表示を制御
    // 入力内容に問題がなければリセットボタンを有効化する
    if(document.getElementById("reset-email").validity.valid){
       Elm_text("reset-error","");
       Elm_active("reset-button");
    }else{Elm_disable("reset-button");}
}
function tryReset(){ // リセットを実行
    { //描画の制御
        Elm_view("reset-preload");// プリロードを表示
        Elm_disable("reset-button");//リセットボタンを非活性にする
        Elm_text("reset-error","");// エラーメッセージを削除
    }
    // リセットを試行
    let prom=new Promise((resolve_func)=>{
     let f=100;
     if(document.getElementById("reset-email").value ==="adgjmptw@mineo.jp"){f=1;}
     setTimeout(resolve_func,2000,[f]);
    });
    prom.then((v)=>{
     { //画面の制御
        Elm_hide("reset-preload");// プリロードを非表示
     }
     if(v[0]==1){ // 成功した場合
        // アラートメッセージを表示(メールしました)
        // チャンネルをログイン画面に切替え
        Elm_text("login-error","");    //ログイン画面のエラーメッセージを初期化
        Elm_value("login-pword","");   //ログイン画面のパスワードを初期化
        Elm_hide("login-reset");       //リセット画面へのリンクを非表示
        Elm_disable("login-button");   //ログインボタンを非活性化
        changech("ch3");
        ArtMsg.open("info","パスワードリセット","登録されているメールアドレスに新しいパスワードを送信しました。12時間以内にログインしてパスワードを再設定して下さい。");
     }
     else {//失敗した場合
        Elm_text("reset-error","メールアドレスが見つかりませんでした。");//エラーを表示
     }
});
}
// パスワードリセット画面のemail欄にchangeイベントリスナーを登録
document.getElementById("reset-email").addEventListener("change",()=>{resetbutton_control();});