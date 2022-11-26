// ////////////////////////////////////////////////////////////////////////////
// アカウント新規作成(Sign up)画面
// ////////////////////////////////////////////////////////////////////////////
function signupbutton_control(){ //アカウント登録ボタンの表示を制御
    // 入力内容に問題がなければアカウント登録ボタンを有効化する
    let flg=0;
    if(! document.getElementById("signup-agreeck").checked){flg=3;}
    if(! pwdcheck("signup-pword1","signup-pword2")){flg=2;}
    if(! document.getElementById("signup-email").validity.valid || ! document.getElementById("signup-pword1").validity.valid){flg=1;}
    if(flg==0){ //問題なければアカウント登録ボタンを有効化
        Elm_text("signup-error","");
        Elm_active("signup-button");
    }
    else{
        Elm_disable("signup-button");
        Elm_text("signup-error","");
        switch(flg){
            case 1:
                if(! pwdcheck("signup-pword1","signup-pword2")){
                    // メールアドレスかパスワードに問題がある。
                    // まだ最初のパスワード入力が終わっていない場合はエラーは表示しない
                    Elm_text("signup-error","メールアドレスまたはパスワードが不正です");
                }
                break;
            case 2: // パスワード不一致エラー
                pwderr("signup-pword1","signup-pword2","signup-error");
               break;
            case 3:Elm_text("signup-error","利用条件に同意が必要です");break;
        }
    }

}
function signupModalRecv(){ //利用条件の同意用モーダルボックス
    // モーダルボックスを作成
    let elems = document.querySelectorAll('#signup-modal');
    let instances=M.Modal.init(elems);
    let instance=M.Modal.getInstance(elems[0]);

    // テキストデータを読み込んで表示
    let read=readFile("data/contruct");
    read.then((recv)=>{
        /// モーダルボックスにテキストを設定
        Elm_text("signup-modal-header","利用条件");
        Elm_text("signup-modal-text",recv);

        /// モーダルボックスを表示
        instance.open();
    });
}
function trySignup(){ // アカウントを新規登録
    { //描画の制御
        Elm_view("signup-preload");// プリロードを表示
        document.getElementById("signup-button").classList.add("disabled");//ログインボタンを非活性にする
        Elm_text("signup-error","");// エラーメッセージを削除
    }
// アカウント登録を試行
let prom=new Promise((resolve_func)=>{
    let f=100;
    if(document.getElementById("signup-email").value ==="adgjmptw@mineo.jp"){f=1;}
    setTimeout(resolve_func,2000,[f]);
});
prom.then((v)=>{
    { //画面の制御
        Elm_hide("signup-preload");// プリロードを非表示
        Elm_active("signup-button");//アカウント登録ボタンを活性にする
    }
    if(v[0]==1){ // 成功した場合     
        // チャンネルをログイン画面に切替え
        changech("ch3");
    }
    else {//失敗した場合
        Elm_text("signup-error","既にアカウントが登録されています");//エラーを表示
    }
});
}
// アカウント登録画面のemail、パスワード欄、利用条件の同意にchangeイベントリスナーを登録
document.getElementById("signup-email").addEventListener("change",()=>{signupbutton_control();});
document.getElementById("signup-pword1").addEventListener("change",()=>{signupbutton_control();});
document.getElementById("signup-pword2").addEventListener("change",()=>{signupbutton_control();});
document.getElementById("signup-agreeck").addEventListener("change",()=>{signupbutton_control();});

// モーダル
document.getElementById("signup-agree").addEventListener('click', ()=>{signupModalRecv();}); 
document.getElementById("signup-agree-ok").addEventListener('click', ()=>{document.getElementById("signup-agreeck").checked=true;signupbutton_control();});
document.getElementById("signup-agree-ng").addEventListener('click', ()=>{document.getElementById("signup-agreeck").checked=false;signupbutton_control();});

