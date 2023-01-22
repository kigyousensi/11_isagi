// ////////////////////////////////////////////////////////////////////////////
// アカウント新規作成(Sign up)画面
// ////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////
// 入力欄を初期化
// ////////////////////////////////////
function signup_const(){
    Elm_text("signup-error","");
    Elm_value("signup-email","");
    Elm_dataset_set("signup-email","checkstate","");
    Elm_value("signup-pword1","");
    Elm_value("signup-pword2","");
    Elm_checkbox_set("signup-agreeck","off");
    Elm_disable("signup-button");
}
// ////////////////////////////////////
// 新規登録画面の制御
// ////////////////////////////////////
// # アカウント登録ボタンの表示を制御
function signupbutton_control(){
    // 入力内容に問題がなければアカウント登録ボタンを有効化する
    let flg=0;
    if(! document.getElementById("signup-agreeck").checked){flg=3;} //利用条件に同意
    if(! pwdcheck("signup-pword1","signup-pword2")){flg=2;}         //パスワードが一致
    if(! document.getElementById("signup-email").validity.valid || ! document.getElementById("signup-pword1").validity.valid){flg=1;} //メールアドレスかパスワード不正
    if(Elm_dataset_get("signup-email","checkstate")=="false"){flg=4;}

    Elm_text("signup-error","");//初期化
    if(flg==0){ //問題なければアカウント登録ボタンを有効化
        Elm_text("signup-error","");
        Elm_active("signup-button");
    }
    else{ // なにか問題がある
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
            case 4:Elm_text("signup-error","メールアドレスが既に登録されています");break;
        }
    }

}

// # 利用条件の同意用モーダルボックス
function signupModalRecv(){
    // モーダルボックスを作成
    let elems = document.querySelectorAll('#signup-modal');
    let instances=M.Modal.init(elems);
    let instance=M.Modal.getInstance(elems[0]);

    // テキストデータを読み込んで表示
    let read=readFile("data/contruct");
    read.then((recv)=>{
        /// モーダルボックスにテキストを設定
        Elm_html("signup-modal-header","利用条件");
        Elm_html("signup-modal-text",recv);

        /// モーダルボックスを表示
        instance.open();
    });
}

// ////////////////////////////////////
// Ajax Call
// ////////////////////////////////////
function trySignup(){ // アカウントを新規登録
    //
    // preprocess
    //

    let data=[],ajax,prom;
    { //描画の制御
        Elm_view("signup-preload");// プリロードを表示
        document.getElementById("signup-button").classList.add("disabled");//ログインボタンを非活性にする
        Elm_text("signup-error","");// エラーメッセージを削除
    }

    //
    // main
    //
    // アカウント登録を試行
    { // 入力値を取得
        data["adr"]=Elm_get("signup-email");
        data["pwd"]=Elm_get("signup-pword1");
    }
    { // ajax call
        ajax=new cAjax("/ap/trysignup.aspx");
        prom=ajax.send(data,'json');
    }

    //
    // end
    //
    prom.then((recv)=>{
     { //画面の制御
        Elm_hide("signup-preload");// プリロードを非表示
        Elm_active("signup-button");//アカウント登録ボタンを活性にする
     }
     switch(recv["result"]){
        case 0: // 成功 チャンネルをログイン画面に切替え
                changech("ch3");
                ArtMsg.open(type="info",title="サインアップ完了",text="ログイン画面からログインしてください。",submit="閉じる");
                break;
        case 1: // 失敗
                Elm_text("signup-error","メールまたはパスワードに問題があります");//エラーを表示
                break;
        case 3: // 失敗
                Elm_text("signup-error","サーバーエラーが発生しました。");//エラーを表示
                break;
        default: // 原因不明のエラー
                Elm_text("signup-error","原因不明のエラーが発生しました");//エラーを表示
                break;
     }
    });
}

// ////////////////////////////////////
// リスナー
// ////////////////////////////////////
// アカウント登録画面のemail、パスワード欄、利用条件の同意にchangeイベントリスナーを登録
document.getElementById("signup-email").addEventListener("change",()=>{
    // メールアドレスが空白か不正の場合はステータスを空白に変更
    // メールアドレス正しく入力されている場合は既に使用されていないか確認し、
    // 問題が無ければステータスをtrue、問題があればfalseにセットして
    // signupbutton_control()を実行

    let data=[];data["adr"]=Elm_get("signup-email");
    if(! document.getElementById("signup-email").validity.valid){
        Elm_dataset_set("signup-email","checkstate","");
        signupbutton_control(); // 表示のコントロールへ
    }
    else { //メールアドレスが正しく入力されている
        let ajax=new cAjax("/ap/trysignup_idcheck.aspx");  // チェックを依頼
        let prom=ajax.send(data,'json');
        prom.then((recv)=>{
            if(recv["result"] == "0"){ // 重複していない場合はtrueをセット
                Elm_dataset_set("signup-email","checkstate","true");
            }
            else{ // 重複している場合はfalseをセット
                Elm_dataset_set("signup-email","checkstate","false");
            }
            signupbutton_control(); // 表示のコントロールへ
        });
    } 
});
document.getElementById("signup-pword1").addEventListener("change",()=>{signupbutton_control();});
document.getElementById("signup-pword2").addEventListener("change",()=>{signupbutton_control();});
document.getElementById("signup-agreeck").addEventListener("change",()=>{signupbutton_control();});

// モーダル
document.getElementById("signup-agree").addEventListener('click', ()=>{signupModalRecv();}); 
document.getElementById("signup-agree-ok").addEventListener('click', ()=>{document.getElementById("signup-agreeck").checked=true;signupbutton_control();});
document.getElementById("signup-agree-ng").addEventListener('click', ()=>{document.getElementById("signup-agreeck").checked=false;signupbutton_control();});

