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
// テキスト編集
// ////////////////////////////////////
/// ///////////////
/// サニタイズ
/// ///////////////

/// テキスト→HTMLへ変換
/// return : {サニタイズ後の文字}
/// usage  : TxToHtml($str)
function TxToHtml(str){
    return String(str).replace(/&/g,"&amp;")
    .replace(/"/g,"&quot;")
    .reprace(/'/g,"&#39;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
}

/// HTML→フォームへ変換
/// return : {変換後の文字}
/// usage  : HtmlToForm($str)
function HtmlToForm(str){
    return String(str).replace(/&amp;/g,"&")
    .replace(/&quot;/g,'\"')
    .replace(/&#39;/g,"\'")
    .replace(/&lt;/g,"<")
    .replace(/&gt;/g,">")
}

/// HTML→テキストへ変換 (通常は使わない)
/// return : {変換後の文字列}
/// usage  : HtmlToTx($str)
function HtmlToTx(str){
    return String(str).replace(/&amp;/g,"&")
    .replace(/&quot;/g,'"')
    .replace(/&#39;/g,"'")
    .replace(/&lt;/g,"<")
    .replace(/&gt;/g,">")
}

/// ///////////////
/// 乱数
/// ///////////////
function fRnd(num=6){
  let result = '';
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
/// ///////////////
/// 連想配列の中に特定のキーが存在するか確認する
/// return : {"" | 一致した配列のキー}
/// usage  : txcompkey(key,ary)
///          key: 検索するキー
///          ary: 検索対象の連想配列
/// ///////////////
function txcompkey(key,ary){
  let rc="";
  for (k in ary){
    if(k === key || k.toLowerCase() === key.toLowerCase()){rc=k;}
  }
  return rc;
}

/// ///////////////
/// 描画の完了を待つ
/// ///////////////
function rePaint() {
     let p=new Promise((resolve)=>{requestAnimationFrame(resolve);}).then(()=>{new Promise((resolve)=>{requestAnimationFrame(resolve);});});
     return p;
}

/// ///////////////
/// 空白の判断
/// ///////////////
function isNull(value){ // 文字列が空白、null、undefinedその他のエラーだった場合はtrueを返す
    let rt=false;
    if(!value || value.length==0 || value === null || value === undefined){rt=true;}
    return rt;
}

// ////////////////////////////////////
// オブジェクト
// ////////////////////////////////////
function isObject(value){return value !== null && typeof value === 'object';}

// ////////////////////////////////////
// 要素制御のショートカット
// ////////////////////////////////////

/// フォームの入出力
let Elm_active=function(id){    // inputまたはa要素を活性化する
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    //フォームの場合はdisabled属性を削除。それ以外の場合はdisableクラスを削除
    switch(obj.tagName.toLowerCase()){
        case "input":obj.removeAttribute("disabled","disabled");break;
        default:obj.classList.remove("disabled");
    }
}  
let Elm_disable=function(id){   // inputまたはa要素を非活性化する
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    //フォームの場合はdisabled属性を追加。それ以外の場合はdisableクラスを追加
    switch(obj.tagName.toLowerCase()){
        case "input":obj.setAttribute("disabled","disabled");break;
        default:obj.classList.add("disabled");
    }
}
let Elm_value=function(id,txt){ // フォームの値を設定する
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    obj.value=txt;
}
let Elm_radio_select=function(grp,val){ //ラジオボックスにチェックを付ける
    let radios=document.querySelectorAll(`input[type='radio'][name='${grp}']`);
    for(let i=0;i<radios.length;i++){
        if(radios[i].value===val){radios[i].checked=true;i=radios.length;}
    }
}
let Elm_select_key=function(id,key){ //keyが一致するリストを選択する
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    for(let i=0;i<obj.options.length;i++){
        if(obj.options[i].value===key){obj.options[i].selected=true;}
    }
}
let Elm_checkbox_set=function(id,val="off"){ //チェックボックスをon/offする
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    if(
         (typeof(val) === "string" && (val.toLowerCase() === "on" || val.toLowerCase() === "true")) ||
         (typeof(val) === "boolean" && val === true)
      ){obj.checked=true;}
    else{obj.checked=false;}
}
let Elm_get=function(id){       // フォームの値、またはタグ内のテキストを取得する。
    // id 要素またはテキスト名
    //   idがテキストの場合は要素に置き換える(select,text,radio,checkbox,tx(div,p,span,i,b,li))
    // 結果は配列であることに注意
    // 要素が無い場合 [] (length=0)
    // 単一要素の場合 [1,value]
    // 複数要素の場合 [要素数,[要素配列]] ([0,[]]もありえる)
    let rc,type="id",obj,tag="";
    // 要素を確定
    if(isObject(id)){type="obj";obj=id;}
    else{
        type="id";
        if(document.querySelectorAll("#"+id).length==1){obj=document.getElementById(id);}//通常
        else{ // idが指定されていない場合はradioのnameが指定されたと判断する
            obj=document.querySelector(`input[type='radio'][name='${id}']`);
        }
    }
    // 要素のタグを判断
    switch(obj.tagName.toLowerCase()){
     case "select":tag="select";break;
     case "input": tag=obj.getAttribute("type");break
     case "div":tag="tx";break
     case "p":tag="tx";break
     case "span":tag="tx";break
     case "li":tag="tx";break
     case "b":tag="tx";break
     case "i":tag="tx";break
     default:tag="none";
    }

    // タグのタイプによって処理を変更
    switch(tag){
        case "tx":rc=obj.textContent;break;
        case "select":
            //複数選択されている可能性があるためmaltipleを判断
            if(obj.maltiple){
               let buf=[];
                for(let i=0;i<obj.length;i++){
                    if(obj[i].selected){buf.push(obj[i].value);}
                }
                rc=buf;
            }
            else{rc=obj.value;}
            break;
        case "checkbox":rc=obj.value;break;
        case "text":rc=obj.value;break;
        case "password":rc=obj.value;break;
        case "radio":
            let name=obj.getAttribute("name");
            let radios,limit=5;cnt=0;//ラジオグループ名からラジオボックスを検索する(上位limitまで)
            while(limit > cnt){
                obj=obj.parentNode;
                radios=obj.querySelectorAll(`input[type='radio'][name='${id}']`);
                if(radios.length >1){cnt=limit+1;}
                else{cnt++;}
            }
            for(let i=0;i<radios.length;i++){
                if(radios[i].checked){rc=radios[i].value;i=radios.length;}
            }
            break;
    }
    return rc;
}


/// フォームのコントロール
let Elm_check=function(id,opt=false){       // フォームにエラーがないかチェックする
    // id:element id
    // opt:false=空白はエラーとみなさない,true=空白をエラーとみなす
    // 
    // return {true | false}
    // input-textの場合は成約違反と空白のチェック
    // input-passwordの場合は制約違反が無いか確認する。
    // input-checkboxの場合はチェックされているか否かを返す
    // selectの場合は選択されているか否かを返す
    rc=true;
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    if(obj.tagName.toLowerCase()==="input"){
      switch(obj.getAttribute("type").toLowerCase()){
        case "text":rc=obj.validity.valid;  // 成約チェック
            if(opt==true && obj.value === ""){rc=false;} //opt=trueの時は空白チェック
            break;
        case "password":rc=obj.validity.valid;
            if(opt==true && obj.value === ""){rc=false;}
            break;
        case "checkbox":rc=obj.selected;break;
      }
    }
    if(obj.tagName.toLowerCase()=="select"){
        if(obj.selectedIndex == -1 || obj.value === ""){rc=false;}
    }
    return rc;
}
let Elm_require=function(id,status=true){   // 入力を必須にするまたは必須を解除する
    // status=on or true ->必須
    // status=off or false ->必須解除
    let obj=document.getElementById(id);
    if(status ==="on" ){status=true;}
    if(status ==="off"){status=false;}
    if(status){
      obj.setAttribute("required","required");
    }
    else{obj.removeAttribute("required");}
    obj.checkValidity();
}
let asset_picture_preview=(el)=>{           // 画像添付フォームのプレビュー表示
    //
    // 以下の構成のフォームで画像ファイルを選択した際
    // div id="asset-機能名-root" [data-func="機能名"]
    //   div class=photo_up  ---- 以下テンプレート "asset-tmp-photo"
    //     p class="pic" <-ここに選択した画像のプレビューを表示
    //     label
    //       input [type='file' data-change=''] <-ここでファイルを選択
    //
    // define
    //
    let root=el.target.parentNode.parentNode;         //テンプレートルート
    let preview=root.querySelector(".pic");           //P要素
    let func=Elm_dataset_get(root.parentNode,"func"); // 呼び出し元の機能名(syomei,photo)
 
    //画像の高さを決定(幅の3/4)
    let width=preview.clientWidth;
    let hight=parseInt(width*3/4);
    Elm_style(preview,"height",hight+"px");
    
    //
    // main
    //
    // 添付した画像データをプレビュー領域に反映
    let fr=new FileReader();
    fr.onload=(()=>{Elm_style(preview,"backgroundImage",`url(${fr.result})`);});
    fr.readAsDataURL(el.target.files[0]);
    
    // ファイルを添付したフォームのchangeデータセットをtrueにする
    Elm_dataset_set(el.target,"change","true");
    //
    // end
    //
    // 上位要素の高さを調整
    {
     let box=root.parentNode.parentNode;
     let h=Elm_sumHight(box);
     Elm_style(box,"height",`min(80vh,${h}px)`);
    }
 
    // 全ての添付ファイルが選択されたら送信ボタンを活性化する
    let f=0;
    for(obj of document.getElementById("asset-"+func+"-root").querySelectorAll('[type="file"]')){
       if(obj.dataset["change"]==="false"){f=1;}
    }
    if(f==0){
       Elm_active("asset_"+func+"_submit");
    }
}
let Elm_select_add=function(id,data){       // selectにoptionを追加する
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    let opt
    for(key in data){
        opt=document.createElement("option");
        Elm_attribute(opt,"value",key);
        Elm_text(opt,data[key]);
        obj.appendChild(opt);
    }


}

/// ブロック・要素
let Elm_hide=function(id){ //要素を非表示にする
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    obj.classList.add("hide");
}     
let Elm_view=function(id){ //要素を表示する
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    obj.classList.remove("hide");
}
let Elm_switch_hide=function(id){ //要素の表示と非表示を反転させる
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    if(obj.classList.contains('hide')==true){obj.classList.remove("hide");}
    else{obj.classList.add("hide");}
}
let Elm_text=function(id,txt){//要素のテキスト(プレーンテキスト)を編集する
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    obj.textContent=txt;
}            
let Elm_html=function(id,txt){//要素のテキスト(html)を編集する
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    obj.innerHTML=txt;}              

/// 要素の属性
let Elm_attribute=function(id,name,value){ //属性を設定
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    obj.setAttribute(name,value);
}

let Elm_style=function(id,typ,val){ //スタイルを変更
    let obj; //idがオブジェクトならそのまま使用。id名なら要素を取得
    if(isObject(id)){obj=id;}
    else{obj=document.getElementById(id);}

    switch(typ){
        case "height":obj.style.height=val;break;
        case "backgroundImage":obj.style.backgroundImage=val;break;
        case "top":obj.style.top=val;break;
    }
}
let Elm_sumHight=function(id){ //直下のブロック要素の高さを合計する
    let obj,style;
    let hi=0;
    if(isObject(id)){obj=id;}
    else{obj=document.getElementById(id);}
    // 要素の直下にあるP、DIV、UL、OLタグの高さを合計する
    for(item of obj.querySelectorAll(":scope > div,:scope > p, :scope > ul,:scope > ol, :scope > li")){
        style=window.getComputedStyle(item);
        hi+=item.offsetHeight+parseInt(style.marginTop.replace(/[a-zA-Z]/g,""))+parseInt(style.marginBottom.replace(/[a-zA-Z]/g,""));;
    }
    return hi;
}

/// データセット
let Elm_dataset_get=function(id,key){ // 値を取得
    /// dataset["key"]から値を取得。キーが存在しない場合は""を返す
    let rc="",obj;
    if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    if(obj.dataset[key] != null){rc=obj.dataset[key];}
    return rc;
}
let Elm_dataset_set=function(id,key,value){ // 値を設定
    /// dataset["key"]に値を設定
    let obj;if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    obj.dataset[key]=value;
}
let Elm_dataset_check=function(id){ //checkstateの値(true/false)を文字列からBoolに変換して返す
    /// dataset["checkstate"]の状態をチェック。
    /// checkstateが存在しない場合はtrue。
    let rt=true;
    let key="checkstate";
    let obj;if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    switch(obj.dataset[key]){
        case "true":rc=true;break;
        case "false":rc=false;break;
    }
    return rc;
}

// ////////////////////////////////////
// アラートメッセージ
// ////////////////////////////////////
// アラート
function artMsg(type="info",title="info",text="",submit="閉じる"){
    // type : { info | warn | error }
    // Boxサイズを決定
    // 100文字まではデフォルトの21vh。20文字超える毎に3vh追加
    // div,br,p,liタグを発見したら1行とみなす
    let texth=21,boxh,buttontop,lines=0;
    if(text.length > 100){
        lines=(Math.ceil(text.length-100)/20);
        lines+=(text.match(/\<br|\<p|\<div|\<li/g)||[]).length;
    }
    // Boxサイズを決定
    texth+=lines*3;
    if(texth>45){texth=45;} //最大45vhまで
    buttontop=13+texth+2;
    boxh=buttontop+7+4;
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
    setTimeout(Elm_style,10,"ar1-bord","height",`${boxh}vh`);
}

function artMsgClose(){
    //閉じる
    Elm_style("ar1-bord","height",0);
    setTimeout(Elm_hide,200,"ar1");
}

// yesno
/// yesnoメッセージを表示
let yesnoMsg=(title,msg,cb,prm)=>{
    // テキストとコールバック関数をセット
    let root=document.getElementById("yesno-top");

    /// タイトルとメッセージを表示
    let elms=root.querySelectorAll('[name="bord"]');
    Elm_text(elms[0],title);
    Elm_html(elms[1],msg);

    /// コールバック関数とパラメタをセット
    elms=root.querySelectorAll(':scope>span');
    elms[0].dataset.cb=cb;
    let str=[];for(let i=0;i<prm.length;i++){str[i]=`'${prm[i]}'`;}
    elms[0].dataset.prm=str.join(',');
    
    /// yes/noリスナーをセット
    elms=root.querySelectorAll('[name="anser"]');
    elms[0].addEventListener("click",yesnoMsg_submit);
    elms[1].addEventListener("click",yesnoMsg_submit);

    // boxを表示(hideになっていると高さの取得ができないので先に表示する)
　　   Elm_view("yesno");

    // boxの大きさを算出
    let higt=24;let style;
    for(let obj of root.querySelectorAll(":scope> div")){
        style=window.getComputedStyle(obj);
        higt+=obj.offsetHeight+parseInt(style.marginTop.replace(/[a-zA-Z]/g,""))+parseInt(style.marginBottom.replace(/[a-zA-Z]/g,""));
    }

    // boxのサイズを変更
    Elm_style("yesno-top","height",higt+"px");
}

/// yesnoメッセージを消してコールバック関数を実行
/// addEventListernerで引数を渡してremoveEventListernerを実行するにはfunction関数で
/// この関数を定義する必要がある。
function yesnoMsg_submit(ev){
    //ボックスを小さくして非表示にする
    Elm_style("yesno-top","height",0);
    setTimeout(Elm_hide,210,"yesno");

    //リスナーを削除する
    let root=document.getElementById("yesno-top");
    let elms=root.querySelectorAll('[name="anser"]');
    elms[0].removeEventListener("click",yesnoMsg_submit);
    elms[1].removeEventListener("click",yesnoMsg_submit);
    
    // callback関数とパラメタを取得
    let cb,prm;
    elms=root.querySelectorAll(":scope>span");
    cb=elms[0].dataset.cb;prm=elms[0].dataset.prm;

    //callback関数を実行(ansr,prm);
    let ansr=ev.currentTarget.dataset.val;
    Function(`${cb}('${ansr}',[${prm}])`)();
}

// テキストメッセージ
// textMsg(id,type,msg);
// 指定したIDにinfo,warn,errのメッセージを表示する
let textMsg=(id,typ,msg)=>{
    let target=document.getElementById(id);
    switch(typ){
        case "info":target.style.color="#66BB6A";break
        case "warn":target.style.color="#fbc02d";break
        case "err":target.style.color="#d84315";break
    }
    Elm_text(id,msg);
}
// ////////////////////////////////////
// チャンネルの制御
// ////////////////////////////////////
function changech(ch){
    const items=document.querySelectorAll(".channel");
    for(let i=0;i<items.length;i++){
        if(items[i].getAttribute("id") == ch){
            items[i].classList.remove("hide");
            switch(ch){
                case "ch2":ownr_const();
            }
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
// ////////////////////////////////////
/// ///////////////
/// 2つのパスワード入力欄にエラーが無く一致する場合にtrueを返す
/// return : { true | false }
/// usage  : pwdcheck(id1,id2)
///          id1,id2 : パスワード入力欄のID。パスワード自体ではない点に注意
/// ex     : pwdcheck("pwd1","pad2")
// ////////////////
let pwdcheck=(id1,id2)=>{
    let rt=true;
    if(! document.getElementById(id1).validity.valid){rt=false;}
    if(! document.getElementById(id2).validity.valid){rt=false;}
    if(document.getElementById(id1).value !== document.getElementById(id2).value){rt=false;}
    return rt;
}
/// ///////////////
// パスワードが一致しない場合のエラー表示
/// 指定したidにパスワードチェックエラーを表示させる
/// 片方の入力が完了していない場合はエラーを表示しない
/// return : なし。指定したtxtidへメッセージを表示
/// usage  : pwderr(id1,id2,txtid)
///          id1,id2 : パスワード入力欄のID。パスワード自体ではない点に注意
///          txtid   : パスワードが一致しない場合にメッセージを出力する先のid
/// ex     : pwdcheck("pwd1","pad2")
// ////////////////
let pwderr=(id1,id2,txtid)=>{
    // 既にエラー判定がされれている前提。
    // 片方がまだ未入力の場合はエラー扱いとしない。両方入力されていた場合はエラーを表示する
    if(document.getElementById(id1).value.length >0 && document.getElementById(id2).value.length >0){
        Elm_text(txtid,"パスワードが一致しません");
    }
}

// ////////////////////////////////////
// オートコンプリート
// ファイルから読み込んだテーブルから変換予測データを作成してtextフォームに割り当てる
// usage:fAutocomlete(fileid,id)
//   fileid:ファイル名の.aryを抜いた部分
//   id    :予測変換を埋め込む要素のid
// ////////////////////////////////////
let fAutocomlete=((fileid,id)=>{
    // fileid:ファイル名
    // return:promice
    // この処理でMakerの値が書き換わる
    // バインド
    let elems = document.querySelectorAll('#'+id);
    let instances = M.Autocomplete.init(elems);
    let instance=M.Autocomplete.getInstance(elems[0]);
  
    // 設定ファイルを読み込み
    if(fileid!==""){ //ファイルが指定されている場合
        let ary=[];
        let data=readFile("data/"+fileid+".ary");
        return data.then((recv)=>{
        ary=(new Function("return"+recv))();
        instance.updateData(ary);
        });
    }else{ //リセットする場合
        instance.updateData([]);
    }
  });

