// ////////////////////////////////////
// ログアウト
// ////////////////////////////////////
function tryLogout(){ //ログアウト
    // ログアウトリクエストを送信
   
    // スライドメニューからログイン時のみ表示するリストを削除
    let items=document.querySelectorAll(".logined");
    for(let i=0;i<items.length;i++){items[i].classList.add("hide");}
   
    // トップメニューを編集
    Elm_view("account-login");
    Elm_hide("account-name");
    Elm_text("account-name","");
   
    // チャンネルを変更
    changech('ch2');
   }