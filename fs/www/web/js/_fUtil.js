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
let Elm_active=function(id){ // 要素を活性化する
    let obj=document.getElementById(id);
    //フォームの場合はdisabled属性を削除。それ以外の場合はdisableクラスを削除
    switch(document.getElementById(id).tagName.toLowerCase()){
        case "input":obj.removeAttribute("disabled","disabled");break;
        default:obj.classList.remove("disabled");
    }
}  
let Elm_disable=function(id){ // 要素を非活性化する
    let obj=document.getElementById(id);
    //フォームの場合はdisabled属性を追加。それ以外の場合はdisableクラスを追加
    switch(document.getElementById(id).tagName.toLowerCase()){
        case "input":obj.setAttribute("disabled","disabled");break;
        default:obj.classList.add("disabled");
    }
}
let Elm_hide=function(id){document.getElementById(id).classList.add("hide");}          //要素を非表示にする
let Elm_view=function(id){document.getElementById(id).classList.remove("hide");}       //要素を表示する
let Elm_text=function(id,txt){document.getElementById(id).textContent=txt;}              //要素のテキストを編集する
let Elm_html=function(id,txt){document.getElementById(id).innerHTML=txt;}              //要素のテキストを編集する
let Elm_velue=function(id,txt){document.getElementById(id).value=txt;}                 //フォームの内容を編集する
let Elm_attribute=function(id,name,value){document.getElementById(id).setAttribute(name,value);}//属性を変更
let Elm_style=function(id,typ,val){
    let obj=document.getElementById(id);
    switch(typ){
        case "height":obj.style.height=val;break;
        case "backgroundImage":obj.style.backgroundImage=val;break;
        case "top":obj.style.top=val;break;
    }
}
// ////////////////////////////////////
// アラートメッセージ
// ////////////////////////////////////
function artMsg(type="info",title="info",text="",submit="閉じる"){
    // Boxサイズを決定
    // 100文字まではデフォルトの21vh。20文字超える毎に3vh追加
    // div,br,p,liタグを発見したら1行とみなす
    let texth=21,boxh,buttontop,lines=0;
    if(text.length > 100){
        lines=(Math.ceil(text.length-100)/20);
        lines+=(text.match(/\<br|\<p|\<div|\<li/g)||[]).length;
        if(lines>5){lines=3;}//多くても追加は３行まで。それ以上はスクロール。
    }
    // Boxサイズを決定
    texth+=lines*3;
    buttontop=13+texth+2;
    boxh=buttontop+7+5;
    //高さ調整
    Elm_style("alert-text","height",`${texth}vh`);
    Elm_style("alert-submit","top",`${buttontop}vh`);

    // テキストと画像を設定
    Elm_text("alert-title",title);
    Elm_html("alert-text",text);
    Elm_text("alert-submit",submit);
    Elm_attribute("alert-submit","onclick","artMsgClose()");
    Elm_style("ar1-bord","backgroundImage",`url('icon/${type}.png')`);

    // 表示
    Elm_view("ar1");
    let timeout=setTimeout(Elm_style,10,"ar1-bord","height",`${boxh}vh`);
}
function artMsgClose(){
    //閉じる
    Elm_style("ar1-bord","height",0);
    let timeout=setTimeout(Elm_hide,200,"ar1");
}

// ////////////////////////////////////
// チャンネルの制御
// ////////////////////////////////////
function changech(ch){
    const items=document.querySelectorAll(".channel");
    for(let i=0;i<items.length;i++){
        if(items[i].getAttribute("id") == ch){
            items[i].classList.remove("hide");
            //document.body.classList.add(`${ch}_color`);
        }
        else{
            items[i].classList.add("hide");
            // document.body.classList.remove(ch+"color");
        }  
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