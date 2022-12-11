// ////////////////////////////////////////////////////////////////////////////
// ログイン画面
// ////////////////////////////////////////////////////////////////////////////
function loginbutton_control(){ //ログインボタンの表示を制御
 // 入力内容に問題がなければログインボタンを有効化する
 if(document.getElementById("login-email").validity.valid && document.getElementById("login-pword").validity.valid){
    Elm_active("login-button");
 }
 else{Elm_disable("login-button");}
}
function tryLogin(){ //ログイン
    { //描画の制御
      Elm_view("login-preload");   // プリロードを表示
      Elm_disable("login-button"); //ログインボタンを非活性にする
      Elm_hide("login-reset");     //パスワードリセット画面へのリンクを削除
      Elm_text("login-error","");  // エラーメッセージを削除
    }
    // ログインを試行
    let prom=new Promise((resolve_func)=>{
        let f=100;
        if(document.getElementById("login-email").value ==="adgjmptw@mineo.jp"){f=1;}
        setTimeout(resolve_func,2000,[f,"katsumi"]);
    });
    prom.then((v)=>{
        { //画面の制御
            Elm_hide("login-preload");// プリロードを非表示
            Elm_disable("login-button");//ログインボタンを活性にする
        }
        if(v[0]==1){ // 成功した場合
            // メニューボタンを活性化
            let items=document.querySelectorAll(".logined");
            for(let i=0;i<items.length;i++){items[i].classList.remove("hide");}
            // 右上のアカウント名を変更
            Elm_hide("account-login");     //ログインボタンを非表示
            Elm_text("account-name",v[1]); //アカウント名に置き換えて表示
            Elm_view("account-name");
            
            // チャンネルを所有者確認画面に切替え
            asset_const();    //資産を取得
            changech("ch2");  //ページを切替え
        }
        else {//失敗した場合
            Elm_text("login-error","メールアドレスまたはパスワードが一致しません");//エラーを表示
            Elm_view("login-reset");// パスワードリセット画面へのリンクを表示
        }
    });
}

// 右上のログインリンクのアクションをカスタム要素として定義
class LoginButton extends HTMLParagraphElement{ 
 constructor(){
     super();
     this.addEventListener("click",()=>{loginbutton_control();changech("ch3"); });
 }
}
customElements.define("login-button",LoginButton,{extends:"p"});

//イベントリスナーを登録
// ログイン画面のemailとパスワード欄にchangeイベントリスナーを登録
document.getElementById("login-email").addEventListener("change",()=>{loginbutton_control();});
document.getElementById("login-pword").addEventListener("change",()=>{loginbutton_control();});
document.getElementById("login-button").addEventListener("click",()=>{tryLogin();});
document.getElementById("login-reset").addEventListener("click",()=>{changech('ch5');});
document.getElementById("login-signup").addEventListener("click",()=>{changech('ch4');});