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
let Elm_get=function(id){// フォームから値を取得する。
    // 結果は配列であることに注意
    // 要素が無い場合 [] (length=0)
    // 単一要素の場合 [1,value]
    // 複数要素の場合 [要素数,[要素配列]] ([0,[]]もありえる)
    let rc=[];
    if(document.querySelectorAll("#"+id).length==1){// IDで検索できる場合(通常)
        let obj=document.getElementById(id);
        switch(obj.tagName.toLowerCase()){
            case "input":rc[0]=1;rc[1]=obj.value;
            break;
            case "select":
                //複数選択されている可能性があるためmaltipleを判断
                if(obj.maltiple){
                    let buf=[];
                    for(let i=0;i<obj.length;i++){
                        if(obj[i].selected){buf.push(obj[i].value);}
                    }
                    rc[0]=buf.length;rc[1]=buf;
                }
                else{rc[0]=1;rc[1]=obj.value;}
                break;
        }
    }else{ // radioの場合
        let radios=document.querySelectorAll(`input[type='radio'][name='${id}']`);
        for(let i=0;i<radios.length;i++){
            if(radios[i].checked){rc[0]=1;rc[1]=radios[i].value;i=radios.length;}
        }
    }
    return rc;
}
let Elm_check=function(id,opt=false){ //フォームの値をチェックする
    // id:element id
    // opt:false=空白はエラーとみなさない,true=空白をエラーとみなす
    // return {true | false}
    // text-passwordの場合は制約違反が無いか確認する。
    // text-checkboxの場合はチェックされているか否かを返す
    // selectの場合は選択されているか否かを返す
    rc=true;
    let obj=document.getElementById(id);
    if(obj.tagName.toLowerCase()==="input"){
      switch(obj.getAttribute("type").toLowerCase()){
        case "text":rc=obj.validity.valid;
            if(opt==true && obj.value === ""){rc=false;}
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
let Elm_require=function(id,status=true){ //入力を必須にするまたは必須を解除する
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
let Elm_hide=function(id){document.getElementById(id).classList.add("hide");}          //要素を非表示にする
let Elm_view=function(id){document.getElementById(id).classList.remove("hide");}       //要素を表示する
let Elm_text=function(id,txt){document.getElementById(id).textContent=txt;}            //要素のテキストを編集する
let Elm_html=function(id,txt){document.getElementById(id).innerHTML=txt;}              //要素のテキストを編集する
let Elm_value=function(id,txt){document.getElementById(id).value=txt;}                 //フォームの内容を編集する
let Elm_radio_select=function(grp,val){
    let radios=document.querySelectorAll(`input[type='radio'][name='${grp}']`);
    for(let i=0;i<radios.length;i++){
        if(radios[i].value===val){radios[i].checked=true;i=radios.length;}
    }
};
let Elm_attribute=function(id,name,value){document.getElementById(id).setAttribute(name,value);}//属性を変更
let Elm_style=function(id,typ,val){
    let obj=document.getElementById(id);
    switch(typ){
        case "height":obj.style.height=val;break;
        case "backgroundImage":obj.style.backgroundImage=val;break;
        case "top":obj.style.top=val;break;
    }
}
let Elm_switch_hide=function(el){
    if(el.classList.contains('hide')==true){el.classList.remove("hide");}
    else{el.classList.add("hide");}
}
// ////////////////////////////////////
// アラートメッセージ
// ////////////////////////////////////
// アラート
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
    elms[0].textContent=title;
    elms[1].textContent=msg;

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

// ////////////////////////////////////
// クラスリスナー
// ////////////////////////////////////
