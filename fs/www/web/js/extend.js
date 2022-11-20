// ////////////////////////////////////////////////////////////////////////////
// 全画面共通
// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////
// ファイルio
// let file=readFile('./data/file.txt');
// ////////////////////////////////////
function readFile(filepath){
    let data=[];
    let ajax=new cAjax(filepath);
    ajax.setPosttype('GET');
    let callajax=ajax.send(data,'text');
    return callajax;
}

// ////////////////////////////////////
// 要素表示の制御
// ////////////////////////////////////
function form_active(id){document.getElementById(id).classList.remove("disabled");}  // フォームを活性化する
function form_disable(id){document.getElementById(id).classList.add("disabled");}    // フォームを非活性化する
function item_hide(id){document.getElementById(id).classList.add("hide");}          //要素を非表示にする
function item_view(id){document.getElementById(id).classList.remove("hide");}       //要素を表示する
function item_text(id,txt){document.getElementById(id).innerHTML=txt;}              //要素のテキストを編集する
function item_velue(id,txt){document.getElementById(id).value=txt;}                 //フォームの内容を編集する
function item_attribute(id,name,value){document.getElementById(id).setAttribute(name,value);}//属性を変更
// ////////////////////////////////////
// アラートメッセージ
// ////////////////////////////////////
function artMsg(type="info",title="info",text="",submit="ok"){
    item_text("alert-title",title);
    item_text("alert-text",text);
    item_text("alert-submit",submit);
    item_view("ar1");
    item_attribute("alert-submit","onclick","item_hide('ar1')");
    document.getElementById("ar1-bord").style.backgroundImage = `url('icon/${type}.png')`;
}
// ////////////////////////////////////
// チャンネルの制御
// ////////////////////////////////////
function changech(ch){
    const items=document.querySelectorAll(".channel");
    for(let i=0;i<items.length;i++){
        if(items[i].getAttribute("id") == ch)
                {items[i].classList.remove("hide");}
            else{items[i].classList.add("hide");}  
    }
    slide_close();
   }

// ////////////////////////////////////////////////////////////////////////////
// スライドメニュー
// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////
// スライドメニューの開閉
// ////////////////////////////////////
function slide_open() { //スライドメニューを開く
    document.getElementById("slide-menu").classList.remove("sidenav-list-close");
    document.getElementById("slide-menu").classList.add("sidenav-list-open");
}
function slide_close(){ //スライドメニューを閉じる
    document.getElementById("slide-menu").classList.remove("sidenav-list-open");
    document.getElementById("slide-menu").classList.add("sidenav-list-close");
} 




// ////////////////////////////////////////////////////////////////////////////
// ログイン画面
// ////////////////////////////////////////////////////////////////////////////
function loginbutton_control(){ //ログインボタンの表示を制御
 // 入力内容に問題がなければログインボタンを有効化する
 if(document.getElementById("login-email").validity.valid && document.getElementById("login-pword").validity.valid){
    form_active("login-button");
 }
 else{form_disable("login-button");}
}
function tryLogin(){ //ログイン
    { //描画の制御
      item_view("login-preload");   // プリロードを表示
      form_disable("login-button"); //ログインボタンを非活性にする
      item_hide("login-reset");     //パスワードリセット画面へのリンクを削除
      item_text("login-error","");  // エラーメッセージを削除
    }
    // ログインを試行
    let prom=new Promise((resolve_func)=>{
        let f=100;
        if(document.getElementById("login-email").value ==="adgjmptw@mineo.jp"){f=1;}
        setTimeout(resolve_func,2000,[f,"katsumi"]);
    });
    prom.then((v)=>{
        { //画面の制御
            item_hide("login-preload");// プリロードを非表示
            form_disable("login-button");//ログインボタンを活性にする
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
class LoginButton extends HTMLParagraphElement{ // 右上のログインリンクのアクションをカスタム要素として定義
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

// ////////////////////////////////////////////////////////////////////////////
// アカウント新規作成(Sign up)画面
// ////////////////////////////////////////////////////////////////////////////
function signupbutton_control(){ //アカウント登録ボタンの表示を制御
    // 入力内容に問題がなければアカウント登録ボタンを有効化する
    let flg=0;
    if(! document.getElementById("signup-agreeck").checked){flg=3;}
    if(document.getElementById("signup-pword1").value !== document.getElementById("signup-pword2").value){flg=2;}
    if(! document.getElementById("signup-email").validity.valid || ! document.getElementById("signup-pword1").validity.valid){flg=1;}
    if(flg==0){ //問題なければアカウント登録ボタンを有効化
        item_text("signup-error","");
        form_active("signup-button");
    }
    else{
        form_disable("signup-button");
        item_text("signup-error","");
        switch(flg){
            case 1:
                if(document.getElementById("signup-pword1").value.length > 0){
                    // メールアドレスかパスワードに問題がある。
                    // まだ最初のパスワード入力が終わっていない場合はエラーは表示しない
                    item_text("signup-error","メールアドレスまたはパスワードが不正です");
                }
                break;
            case 2:
                if(document.getElementById("signup-pword2").value.length > 0){
                    // パスワードが一致しない。
                    // まだ2つ目のパスワードが入力されていない場合はエラーは表示しない
                    item_text("signup-error","パスワードが一致しません");
                }
                break;
            case 3:item_text("signup-error","利用条件に同意が必要です");break;
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
        item_text("signup-modal-header","利用条件");
        item_text("signup-modal-text",recv);

        /// モーダルボックスを表示
        instance.open();
    });
}
function trySignup(){ // アカウントを新規登録
    { //描画の制御
        item_view("signup-preload");// プリロードを表示
        document.getElementById("signup-button").classList.add("disabled");//ログインボタンを非活性にする
        item_text("signup-error","");// エラーメッセージを削除
    }
// アカウント登録を試行
let prom=new Promise((resolve_func)=>{
    let f=100;
    if(document.getElementById("signup-email").value ==="adgjmptw@mineo.jp"){f=1;}
    setTimeout(resolve_func,2000,[f]);
});
prom.then((v)=>{
    { //画面の制御
        item_hide("signup-preload");// プリロードを非表示
        document.getElementById("signup-button").classList.remove("disabled");//アカウント登録ボタンを活性にする
    }
    if(v[0]==1){ // 成功した場合     
        // チャンネルをログイン画面に切替え
        changech("ch3");
    }
    else {//失敗した場合
        item_text("signup-error","既にアカウントが登録されています");//エラーを表示
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

// ////////////////////////////////////////////////////////////////////////////
// パスワードリセット画面
// ////////////////////////////////////////////////////////////////////////////
function resetbutton_control(){ //リセットボタンの表示を制御
    // 入力内容に問題がなければリセットボタンを有効化する
    if(document.getElementById("reset-email").validity.valid){
       item_text("reset-error","");
       form_active("reset-button");
    }else{form_disable("reset-button");}
}
function tryReset(){ // リセットを実行
    { //描画の制御
        item_view("reset-preload");// プリロードを表示
        form_disable("reset-button");//リセットボタンを非活性にする
        item_text("reset-error","");// エラーメッセージを削除
    }
// リセットを試行
let prom=new Promise((resolve_func)=>{
    let f=100;
    if(document.getElementById("reset-email").value ==="adgjmptw@mineo.jp"){f=1;}
    setTimeout(resolve_func,2000,[f]);
});
prom.then((v)=>{
    { //画面の制御
        item_hide("reset-preload");// プリロードを非表示
    }
    if(v[0]==1){ // 成功した場合
        // アラートメッセージを表示(メールしました)
        // チャンネルをログイン画面に切替え
        item_text("login-error","");    //ログイン画面のエラーメッセージを初期化
        item_velue("login-pword","");   //ログイン画面のパスワードを初期化
        item_hide("login-reset");       //リセット画面へのリンクを非表示
        form_disable("login-button");   //ログインボタンを非活性化
        changech("ch3");
        artMsg("info","パスワードリセット","登録されているメールアドレスに新しいパスワードを送信しました。12時間以内にログインしてパスワードを再設定して下さい。");
    }
    else {//失敗した場合
        item_text("reset-error","メールアドレスが見つかりませんでした。");//エラーを表示
    }
});
}
// パスワードリセット画面のemail欄にchangeイベントリスナーを登録
document.getElementById("reset-email").addEventListener("change",()=>{resetbutton_control();});

// ////////////////////////////////////
// ログアウト
// ////////////////////////////////////
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
    changech('ch2');
   }