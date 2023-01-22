// ////////////////////////////////////////////////////////////////////////////
// 全画面共通
// ////////////////////////////////////////////////////////////////////////////

//
// テキストの変換やオブジェクトの編集
//

// ////////////////////////////////////
// ファイルio
// ////////////////////////////////////

//###############################
//## テキストファイル
//###############################

// # テキストファイルを読み込む
function readFile(filepath){
    // /からの相対パスでファイル名を指定して内容を読み込む
    // / usge readFile(filepath)
    // /    filepath    : /からの相対パス ex)'./data/file.txt'
    // /    return      : promise
    let data=[];
    let ajax=new cAjax(filepath);
    ajax.setPosttype('GET');
    let callajax=ajax.send(data,'text');
    return callajax;
}

// ////////////////////////////////////
// テキスト編集
// ////////////////////////////////////
//###############################
//## サニタイズ
//###############################

// # テキスト→HTMLへ変換
function TxToHtml(str){
    // / usage  : TxToHtml($str)
    // / return : {サニタイズ後の文字}
    return String(str).replace(/&/g,"&amp;")
    .replace(/"/g,"&quot;")
    .reprace(/'/g,"&#39;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
}

// # HTML→フォームへ変換
function HtmlToForm(str){
    // / usage  : HtmlToForm($str)
    // / return : {変換後の文字}
    return String(str).replace(/&amp;/g,"&")
    .replace(/&quot;/g,'\"')
    .replace(/&#39;/g,"\'")
    .replace(/&lt;/g,"<")
    .replace(/&gt;/g,">")
}

// # HTML→テキストへ変換 (通常は使わない)
function HtmlToTx(str){
    // / usage  : HtmlToTx($str)
    // / return : {変換後の文字列}
    return String(str).replace(/&amp;/g,"&")
    .replace(/&quot;/g,'"')
    .replace(/&#39;/g,"'")
    .replace(/&lt;/g,"<")
    .replace(/&gt;/g,">")
}

//#################################
//## 要素の判断
//#################################

// # 空白の判断
function isNull(value){
    // 文字列が空白、null、undefinedその他のエラーだった場合はtrueを返す
    // / usage isNull(str value)
    // /    value : 判断する文字列
    // / return { true | false } true=空白/null/undefined
    let rt=false;
    if(!value || value.length==0 || value === null || value === undefined){rt=true;}
    return rt;
}

// # オブジェクトの判断
function isObject(value){
    // 文字列がオブジェクトならtrueを返す
    // / usage isNull(str value)
    // /    value : 判断する文字列
    // / return { true | false } true=オブジェクト
    return value !== null && typeof value === 'object';
}
// ////////////////////////////////////
// 乱数
// ////////////////////////////////////

//###############################
//## テキスト
//###############################

// # ランダムな文字列を作成する
function fRnd(num=6){
    // 指定した文字数のランダムな文字列を作成する
    // / usage fRmd(int num)
    // /    num : 文字数
    // / return 文字列

  let result = '';
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// ////////////////////////////////////
// 配列
// ////////////////////////////////////

//###############################
//## 連想配列
//###############################
/// ///////////////
/// 連想配列の中に特定のキーが存在するか確認する
/// return : {"" | 一致した配列のキー}

/// ///////////////
// # キーが存在するか確認する
function txcompkey(key,ary){
  // / usage txcompkey(str key,{} ary)
  // /  key: 検索するキー
  // /  ary: 検索対象の連想配列
  // / return {"" | key}
  let rc="";
  for (k in ary){
    if(k === key || k.toLowerCase() === key.toLowerCase()){rc=k;}
  }
  return rc;
}

// ////////////////////////////////////
// 要素の制御
// ////////////////////////////////////
//###############################
//## タグ、フォーム共通
//###############################
// # 取得
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
        case "email":rc=obj.value;break;
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

// # 表示
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

// # 属性
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

// # データセット
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

// # 演算
let Elm_sumHight=function(id){ //直下のブロック要素の高さを合計する
    let obj,style;
    let hi=0;
    if(isObject(id)){obj=id;}
    else{obj=document.getElementById(id);}
    // 要素の直下にあるP、DIV、UL、OLタグの高さを合計する
    for(item of obj.querySelectorAll(":scope > div,:scope > p, :scope > ul,:scope > ol, :scope > li")){
            style=window.getComputedStyle(item);
            if(item.offsetHeight > 0){
              hi+=item.offsetHeight+Math.ceil(parseFloat(style.marginTop.replace(/[a-zA-Z]/g,""))+parseFloat(style.marginBottom.replace(/[a-zA-Z]/g,"")));
            }
    }
    return hi;
}

//###############################
//## タグ
//###############################
let Elm_text=function(id,txt){//要素のテキスト(プレーンテキスト)を編集する
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    obj.textContent=txt;
}            
let Elm_html=function(id,txt){//要素のテキスト(html)を編集する
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    obj.innerHTML=txt;
}

//###############################
//## フォーム共通
//###############################
let Elm_value=function(id,txt){         // フォームの値を設定する
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    obj.value=txt;
}
let Elm_check=function(id,opt=false){   // フォームにエラーがないかチェックする
    // / usage Elm_check( id/obj id, bool opt)
    // /    id  :要素のidまたはオブジェクト
    // /    opt : { true | false } true=空白をエラーとみなす
    // / return {true | false}
    //
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

//###############################
//## input
//###############################
// # 活性化/非活性化
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

//###############################
//## input password
//###############################
// #　パスワードチェック
let pwdcheck=(id1,id2)=>{
    // 2つのpassword要素が正しく入力され、かつ一致しているかチェックする
    // / usage pwdcheck(id1,id2)
    // /    id1: 1つめの要素のidまたはオブジェクト
    // /    id2: 2つめの要素のidまたはオブジェクト
    // return { true | false }

    let rt=true,obj1,obj2;
    if(isObject(id1)){obj1=id1;}else{obj1=document.getElementById(id1);}
    if(isObject(id2)){obj2=id2;}else{obj2=document.getElementById(id2);}

    if(! obj1.validity.valid){rt=false;}
    if(! obj2.validity.valid){rt=false;}
    if(obj1.value !== obj2.value){rt=false;}
    return rt;
}

// # パスワードが一致しない場合のエラー表示
let pwderr=(id1,id2,txtid)=>{
    // / usage pwderr(id1,id2,txtid)
    // /  id1,id2 : パスワード入力欄
    // /  txtid   : メッセージを出力する先
    //
    // / 既にエラー判定がされれている前提。
    // / 片方がまだ未入力の場合はエラー扱いとしない。両方入力されていた場合はエラーを表示する
    let obj1,obj2,obj3;
    if(isObject(id1)){obj1=id1;}else{obj1=document.getElementById(id1);}
    if(isObject(id2)){obj2=id2;}else{obj2=document.getElementById(id2);}
    if(isObject(txtid)){obj3=txtid;}else{obj3=document.getElementById(txtid);}
    if(obj1.value.length >0 && obj2.value.length >0){
        Elm_text(obj3,"パスワードが一致しません");
    }
}

//###############################
//## radio
//###############################
// # 選択
let Elm_radio_select=function(grp,val){ //ラジオボックスにチェックを付ける
    let radios=document.querySelectorAll(`input[type='radio'][name='${grp}']`);
    for(let i=0;i<radios.length;i++){
        if(radios[i].value===val){radios[i].checked=true;i=radios.length;}
    }
}

//###############################
//## select
//###############################
// # 選択
let Elm_select_key=function(id,key){ //keyが一致するリストを選択する
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    for(let i=0;i<obj.options.length;i++){
        if(obj.options[i].value===key){obj.options[i].selected=true;}
    }
}
// * 追加
let Elm_select_add=function(id,data){ // selectにoptionを追加する
    // / usage Elm_select_add ( id/obj id,{} data)
    // /  id : selectのidまたはオブジェクト
    // / data: {value:テキスト}
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    let opt
    for(key in data){
        opt=document.createElement("option");
        Elm_attribute(opt,"value",key);
        Elm_text(opt,data[key]);
        obj.appendChild(opt);
    }
}

//###############################
//## チェックボックス
//###############################
// on/off
let Elm_checkbox_set=function(id,val="off"){ //チェックボックスをon/offする
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    if(
         (typeof(val) === "string" && (val.toLowerCase() === "on" || val.toLowerCase() === "true")) ||
         (typeof(val) === "boolean" && val === true)
      ){obj.checked=true;}
    else{obj.checked=false;}
}

// ////////////////////////////////////
// 画像
// ////////////////////////////////////
// # プレビュー
let picture_preview=(id,url)=>{
    // 画像添付フォームで添付した画像をプレビュー領域に表示する
    // / rootの下にあるpic領域に添付した画像を表示
    // / usage picture_preview(id/obj id)
    // /    id : 以下の構造のroot要素
    // /            div id="asset-機能名-root" [data-func="機能名"] <-ここのひとつ上の高さも変える
    // /              div class=photo_up  ---- 以下テンプレート "asset-tmp-photo" <-ここがroot
    // /                p class="pic" <-ここに選択した画像のプレビューを表示
    // /                   label
    // /                        input [type='file' data-change=''] <-ここでファイルを選択
    // /    url  : ファイルのurl

    //
    // define
    //
    let obj; if(isObject(id)){obj=id;}else{obj=document.getElementById(id);}
    let preview=obj.querySelector(".pic");  // p要素
 
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
    fr.readAsDataURL(url);
    
    //
    // end
    //
    // 上位要素の高さを調整
    {
     let box=obj.parentNode.parentNode;
     let h=Elm_sumHight(box);
     Elm_style(box,"height",`min(80vh,${h}px)`);
    }

}

// ////////////////////////////////////
// 予測変換
// ////////////////////////////////////
 // # カテゴリを基にメーカー入力欄に予測変換リストを適用する

 // # カテゴリ、メーカー入力欄の値を基に、モデル入力欄に予測変換リストを適用する
 let input_change_maker=(cateid,makerid,modelid)=>{
    // 空白でなければフォームからメーカー名を取得する。
    // メーカー名は大文字/小文字の差異を吸収して予測変換のメーカー名に置き換える
    // その後空白を_に変換して小文字し、モデル予測変換ファイル名を作成する
    let catgory,maker,model,chk;
    if(Elm_check(makerid,true)){
      catgory=Elm_get(cateid);
      maker=Elm_get(makerid).replace(/ *$/,"");
      //メーカーリストの中から選択された場合はモデルの予測変換リストを更新
      if(input_compandchoice(makerid)){ // 入力した値が予測変換リストと一致(校正済み)
        // カテゴリとメーカー名からモデル予測変換ファイル名を作成する
        maker=maker.replace(/ *$/,"");
        maker=maker.replace(" ","_");
        model=fAutocomlete(catgory+"_"+maker.toLowerCase(),modelid);
      }
      else{model=fAutocomlete("",modelid);}
      //型名を初期化
      Elm_value(modelid,"");
    }
 }

 // # フォームの入力内容を予測変換に寄せる
 let input_compandchoice=function(id){
    // / usage input_compandchoice(str id)
    // /    id : inputフォームのid
    // / return { true | false }
    // /    true  入力内容が予測変換と一致したか予測変換に寄せた
    // /    false 入力内容が予測変換に存在しなかった
    let rc=false;
   //大文字小文字の差異を吸収して予測変換文字に寄せる
   let income=Elm_get(id).replace(/ *$/,"");    //空白を排除する
   let chk=txcompkey(income,document.getElementById(id).M_Autocomplete.options.data);//モデル予測リストの内容と比較
   if(chk !== ""){Elm_value(id,chk);rc=true;} //一致する場合はフォームの内容を予測変換リストで上書き
   return rc;
 }

// ////////////////////////////////////
// Materializeフレームワークの制御
// ////////////////////////////////////
//###############################
// オートコンプリート
//###############################

// ////////////////////////////////////
let fAutocomlete=((fileid,id)=>{
    // ファイルから読み込んだテーブルから変換予測データを作成してtextフォームに割り当てる
    // / usage:fAutocomlete(fileid,id)
    // /  fileid:ファイル名の.aryを抜いた部分
    // /  id    :予測変換を埋め込む要素のid
    // / return:promice
    //
    // / データファイルはdata/ディレクトリに保存している前提

    // バインド
    let elems = document.querySelectorAll('#'+id);
    let instances=M.Autocomplete.init(elems);
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

