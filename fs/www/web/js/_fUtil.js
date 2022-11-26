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
// 要素制御のショートカット
// ////////////////////////////////////
let Elm_active=function(id){document.getElementById(id).classList.remove("disabled");}  // フォームを活性化する
let Elm_disable=function(id){document.getElementById(id).classList.add("disabled");}    // フォームを非活性化する
let Elm_hide=function(id){document.getElementById(id).classList.add("hide");}          //要素を非表示にする
let Elm_view=function(id){document.getElementById(id).classList.remove("hide");}       //要素を表示する
let Elm_text=function(id,txt){document.getElementById(id).innerHTML=txt;}              //要素のテキストを編集する
let Elm_velue=function(id,txt){document.getElementById(id).value=txt;}                 //フォームの内容を編集する
let Elm_attribute=function(id,name,value){document.getElementById(id).setAttribute(name,value);}//属性を変更

// ////////////////////////////////////
// アラートメッセージ
// ////////////////////////////////////
function artMsg(type="info",title="info",text="",submit="ok"){
    Elm_text("alert-title",title);
    Elm_text("alert-text",text);
    Elm_text("alert-submit",submit);
    Elm_view("ar1");
    Elm_attribute("alert-submit","onclick","Elm_hide('ar1')");
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

// ////////////////////////////////////
// パスワードのチェック
//// 2つのパスワード入力欄にエラーが無く一致する場合にtrueを返す
let pwdcheck=(id1,id2)=>{
    let rt=true;
    if(! document.getElementById(id1).validity.valid){rt=false;}
    if(! document.getElementById(id2).validity.valid){rt=false;}
    if(document.getElementById(id1).value !== document.getElementById(id2).value){rt=false;}
    return rt;
}
// パスワードが一致しない場合のエラー表示
//// 指定したidにパスワードチェックエラーを表示させる
//// 片方の入力が完了していない場合はエラーを表示しない
let pwderr=(id1,id2,txtid)=>{
    // 既にエラー判定がされれている前提。
    // 片方がまだ未入力の場合はエラー扱いとしない。両方入力されていた場合はエラーを表示する
    if(document.getElementById(id1).value.length >0 && document.getElementById(id2).value.length >0){
        Elm_text(txtid,"パスワードが一致しません");
    }
}