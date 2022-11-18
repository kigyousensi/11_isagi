// //////////////////////////////////////////////////////////////////////
// 要素表示の制御
// //////////////////////////////////////////////////////////////////////
function item_hide(id){document.getElementById(id).classList.add("hide");}      //要素を非表示にする
function item_view(id){document.getElementById(id).classList.remove("hide");}   //要素を表示する
function item_text(id,txt){document.getElementById(id).innerHTML=txt;}          //要素のテキストを編集する

// //////////////////////////////////////////////////////////////////////
// スライドメニューの制御
// //////////////////////////////////////////////////////////////////////
function slide_open() { //スライドメニューを開く
    document.getElementById("slide-menu").classList.remove("sidenav-list-close");
    document.getElementById("slide-menu").classList.add("sidenav-list-open");
}
function slide_close(){ //スライドメニューを閉じる
    document.getElementById("slide-menu").classList.remove("sidenav-list-open");
    document.getElementById("slide-menu").classList.add("sidenav-list-close");
} 

// //////////////////////////////////////////////////////////////////////
// チャンネルの制御
// //////////////////////////////////////////////////////////////////////
function changech(ch){
    const items=document.querySelectorAll(".channel");
    for(let i=0;i<items.length;i++){
        if(items[i].getAttribute("id") == ch)
                {items[i].classList.remove("hide");}
            else{items[i].classList.add("hide");}  
    }
    slide_close();
   }

// //////////////////////////////////////////////////////////////////////
// ログイン/ログアウト
// //////////////////////////////////////////////////////////////////////
function tryLogin(){ //ログイン
    { //描画の制御
      item_view("login-preload");// プリロードを表示
      document.getElementById("login-button").classList.add("disabled");//ログインボタンを非活性にする
      item_hide("login-reset");//パスワードリセット画面へのリンクを削除
      item_text("login-error","");// エラーメッセージを削除
    }
    // ログインを試行
    let prom=new Promise((resolve_func)=>{
        setTimeout(resolve_func,3000,[1,"katsumi"]);
    });
    prom.then((v)=>{
        { //画面の制御
            item_hide("login-preload");// プリロードを非表示
            document.getElementById("login-button").classList.remove("disabled");//ログインボタンを活性にする
        }
        if(v[0]==1){ // 成功した場合
            // メニューボタンを活性化
            let items=document.querySelectorAll(".logined");
            for(let i=0;i<items.length;i++){items[i].classList.remove("hide");}
            // 右上のアカウント名を変更
            item_hide("account-login");     //ログインボタンを非表示
            item_text("account-name",v[1]); //アカウント名に置き換えて表示
            item_view("account-name");
            
            // チャンネルを所有者確認画面に切替え
            changech("ch2");
        }
        else {//失敗した場合
            item_text("login-error","メールアドレスまたはパスワードが一致しません");//エラーを表示
            item_view("login-reset");// パスワードリセット画面へのリンクを表示
        }
    });
}
function tryLogout(){ //ログアウト
 // ログアウトリクエストを送信

 // スライドメニューからログイン時のみ表示するリストを削除
 let items=document.querySelectorAll(".logined");
 for(let i=0;i<items.length;i++){items[i].classList.add("hide");}

 // トップメニューを編集
 item_view("account-login");
 item_hide("account-name");
 item_text("account-name","");

 // チャンネルを変更
 changech('ch4');
}
class LoginButton extends HTMLParagraphElement{ // ログインボタンのアクションをカスタム要素として定義
 constructor(){
     super();
     this.addEventListener("click",()=>{changech("ch3"); });
 }
}
customElements.define("login-button",LoginButton,{extends:"p"});