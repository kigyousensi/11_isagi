// ////////////////////////////////////////////////////////////////////////////
// 所有者確認画面
// ////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////
// 初期化
///////////////////////////////////////
//////////////////////////
// チャンネルの初期化
//////////////////////////
let ownr_const=()=>{
  //ヘッダー画像の動作
  let header=document.querySelector(".ownr-head");
  header.style.transitionDuration="0s";
  setTimeout(()=>{
    header.style.backgroundPosition="right 0 bottom 0";
    setTimeout(()=>{
      header.style.transitionDuration="2s";
      header.style.backgroundPosition="right 20% bottom 20%";
      header.style.transitionDuration="0s";
    },1000);
  },100);

  setTimeout(()=>{
    header.style.transitionDuration="2s";
    header.style.backgroundPosition="right 20% bottom 20%";
    header.style.transitionDuration="0";
  },1000);
}

let ownr_init=function(){
  //////////////////////////
  // カテゴリーリストを作成
  //////////////////////////
   /// define
   let select_category=document.getElementById("ownr_category");  //selectタグ
   let template=document.getElementById("ownr_category_list");    //templateタグ
   let node;    //テンプレートをコピーして作成するノード
   let option;  //テンプレート内のoptioオブジェクト

   /// OptionタグをgCategorys配列から作成
   for(let key in gCategorys){
     // Optionタグを作成
     node=template.content.cloneNode(true);
     option=node.querySelector("option");
     Elm_text(option,gCategorys[key]["name"]);
     Elm_attribute(option,"value",key);
     Elm_dataset_set(option,"icon","icon/"+gCategorys[key]["img"]);
     select_category.appendChild(node);
   }
   /// カテゴリ選択リストにUIインスタンスをバインド
   let ownr_category_elems = document.querySelectorAll('#ownr_category');
   M.FormSelect.init(ownr_category_elems);
   M.FormSelect.getInstance(ownr_category_elems[0]);

  //////////////////////////
  // カテゴリの選択をリセットする
  //////////////////////////
  document.getElementById("ownr_category").selectedIndex=-1;
  Elm_text("ownr_bind_selial","");
}

///////////////////////////////////////
// イベント関数
///////////////////////////////////////
///////////////////
/// カテゴリーを選択した際の動作
///////////////////
let ownr_select_category=function(el){
  let maker;
   // 表示する入力欄
   // 自転車
   //   個体識別方法選択欄
   // 　防犯登録　・・・個体番号のみ
   //   車体番号　・・・Elm_requireメーカー、型名、個体番号
   // 自転車以外
   //   メーカー、型名、個体番号
   {
    if(el.target.value==="Roadbike"){ // 自転車の場合
      Elm_radio_select("ownr_radio1","bn");//防犯登録を強制的に選択
      Elm_view("ownr_bind_Roadbike"); //防犯登録 or 車体番号の選択肢を表示
      Elm_hide("ownr-bind-product");  //製品関連を非表示にして入力の必須を解除
      Elm_require("ownr_maker",false); ///メーカー
      Elm_require("ownr_model",false); ///型名
      Elm_text("ownr_bind_selial_label","防犯登録番号(ハイフンと()は入力不要)");
    }
    else{
      Elm_hide("ownr_bind_Roadbike"); //防犯登録 or 車体番号を非表示
      Elm_view("ownr-bind-product");  //製品関連を表示して入力を必須にする
      Elm_require("ownr_maker",true);  ///メーカー
      Elm_require("ownr_model",true);  ///型名
      //個体番号入力欄の表示のラベルを変更
     Elm_text("ownr_bind_selial_label",gCategorys[el.target.value]["selial"]);
    }
    maker=fAutocomlete(el.target.value,"ownr_maker"); //メーカーの予測変換候補を編集
    Elm_value("ownr_maker","");       //メーカーを初期化
    Elm_value("ownr_model","");       //型名を初期化
   }
     Elm_view("ownr_selial");//個体番号

   //検索ボタンの表示を変更
   ownr_check_search();
}

///////////////////
/// 照合方法を選択した際の動作
///////////////////
let ownr_check_radio=(()=>{
  if(Elm_get("ownr_radio1")==="bn"){ //防犯登録
    Elm_hide("ownr-bind-product");  //製品関連を非表示
    Elm_require("ownr_maker",false); ///メーカー
    Elm_require("ownr_model",false); ///型名
    Elm_text("ownr_bind_selial_label","防犯登録番号(ハイフンと()は入力不要)");
  }
  else{ //車体番号
    Elm_view("ownr-bind-product");  //製品関連を表示
    Elm_require("ownr_maker",true);  ///メーカー
    Elm_require("ownr_model",false); ///型名
    Elm_text("ownr_bind_selial_label","車体番号");
  }
  ownr_check_search();
});

///////////////////
// メーカーを変更した場合の動作
///////////////////
// # メーカー名の補完とモデルの予測変換を作成
let ownr_change_maker=(()=>{
  input_change_maker("ownr_category","ownr_maker","ownr_model");
  ownr_check_search(); // 入力内容を確認して照会ボタンをアクティブ化
});

///////////////////
// モデルを変更した場合
///////////////////
let ownr_change_model=()=>{
  //大文字小文字の差異を吸収して予測変換文字に寄せる
  let model=Elm_get("ownr_model").replace(/ *$/,"");
  let chk=txcompkey(model,document.getElementById("ownr_model").M_Autocomplete.options.data);//モデル予測リストの内容と比較
  if(chk !== "" && chk !== model){Elm_value("ownr_model",chk);}
  // 入力内容を確認して照会ボタンをアクティブ化
  ownr_check_search(); 
}
///////////////////
// 検索ボタンを押した場合の動作
///////////////////
let ownr_search=()=>{
  // フォームの値を取得して検索を実行
  ///リスナーをすべてオフ
  let cards=document.querySelectorAll("ownr-card");
  let imgs=[];
  for(let obj of cards){
    imgs=obj.querySelectorAll("card-detail");
    for(let itm of items){
      //itm.removeEventListener("click");
    }
  }
  ///[カテゴリ,メーカー,型名,自転車の照合方法,個体番号]
  let data=[];
  data["category"]=Elm_get("ownr_category");
  data["maker"]=Elm_get("ownr_maker");
  data["model"]=Elm_get("ownr_model");
  data["method"]=Elm_get("ownr_radio1");
  data["selial"]=Elm_get("ownr_bind_selial");
  
  // 検索
  /// 前回の検索結果を非表示
  Elm_text("ownr_serched_msg","");

  /// wait表示
  Elm_view("ownr-preload");
  let ajaxcall=new Promise((resolve_func)=>{
    let rt=[];
    if(data["maker"] ==="GIANT"){
      rt=[
        {"maker":"GIANT","model":"TCR","sup":"XL","twitter":"YNekohige","instagram":"finefennec","serial":"A0000001","comment":"かーまーど〜　かーまーど〜　せーとのうーみは　おか〜さん　さぬきのやまは〜　おと〜さん","caution":"false","assetid":"X1000001"}
      ];
    }
    else{
      rt=[
        {"maker":"GIANT","model":"TCR","sup":"SL1","twitter":"YNekohige","instagram":"","serial":"A0000001","comment":"いつもの　よおーに　まくーがあ〜き〜　こーいーの〜　う〜た　うったうわったあしにっ　とーどいたー　しんらんせんは〜　くーろーいー　ふちーどり〜が〜　ありましーたー","caution":"false","assetid":"X1000001"},
        {"maker":"GIANT","model":"TCR","sup":"SL2","twitter":"","instagram":"finefennec","serial":"A0000001","comment":"きゃっわいった〜　かみをっ　かーらーまーせぇぇぇぇ　あっなたっほゥ〜　つぅれぇてぇく↑ぅのぅさ〜","caution":"true","assetid":"X1000002"}
      ];
    }
    setTimeout(resolve_func,2000,rt);
  });
  
  // 検索結果を元にカードを作成
  ajaxcall.then((recv)=>{
    // waitを非表示
    Elm_hide("ownr-preload");

    // 既存の結果を削除
    let olds=document.querySelectorAll(".ownr-card");
    for(let obj of olds){obj.remove();}
    
    // 結果の件数を表示
    let tx=recv.length+"件";
    if(recv.length>1){tx=`${tx} &gt;&gt;<a onclick="ownr_serched_msg()">複数の結果が表示される場合</a>`}
    Elm_html("ownr_serched_msg","検索結果 : "+tx);

    // 1件づつカードを作成 
    for(let i=0;i<recv.length;i++){create_ownr_card(recv[i]);}
  });
}

// カードの画像かタイトルを選択したら詳細を表示/非表示に切り替える
let setOwnrCardDetail=(el)=>{
    // card-info領域の高さを算出
    let tgt=el.parentElement.parentElement.querySelectorAll(".card-info");
    let higt=0;let style;
    for(let obj of tgt[0].querySelectorAll(":scope> p")){
        let style=window.getComputedStyle(obj);
         higt+=obj.offsetHeight+parseInt(style.marginTop.replace(/[a-zA-Z]/g,""))+parseInt(style.marginBottom.replace(/[a-zA-Z]/g,""));
    }
    setTimeout(()=>{
    if(tgt[0].clientHeight==0){
        tgt[0].style.height=higt+"px";
        tgt[0].style.paddingBottom="24px";
    }
    else{
        tgt[0].style.height=0;
        tgt[0].style.paddingBottom="0";
    }
    },10);
}

// 検索結果が複数ある場合のメッセージ
let ownr_serched_msg=()=>{
  ArtMsg.open(type='warn',title='検索結果が複数ある場合',text='複数の結果が表示される場合は盗品の可能性を疑って下さい。<br/>通常はメーカー、型名、シリアル番号の組み合わせが重複することはありません。メーカーによってはモデルをマイナーチェンジした際にシリアル番号が重複する場合がありますが稀なケースです。');
}
///////////////////
// フォームの値が変わったら検索ボタンを有効にするか判断する
///////////////////
let ownr_check_search=()=>{
  // カテゴリが選択されていること
  // 自転車の場合
  //  防犯登録方式->防犯登録番号のみ入力
  //  車体番号方式->メーカー、モデル、車体番号方式
  // 自転車以外の場合
  // メーカー、型名、製造場号
  let rc=0;
  if(! Elm_check("ownr_category")){rc=4;}
  else{
   if(Elm_get("ownr_category")==="Roadbike"){ // 自転車の場合
     if(Elm_get("ownr_radio1")==="bn"){       /// 防犯登録の場合
       //個別の確認項目なし
     }
     else{ /// 車体番号の場合
       if(! Elm_check("ownr_maker",true)){rc=1;}
       if(! Elm_check("ownr_model",true)){rc=2;}
     }
   }
   else{ // 自転車以外の場合
     if(! Elm_check("ownr_maker")){rc=1;}
     if(! Elm_check("ownr_model")){rc=2;}
   }
   if(! Elm_check("ownr_bind_selial")){rc=3;}
   // ボタンの状態を変更
   if(rc==0){Elm_active("ownr-search");}else{Elm_disable("ownr-search");}
  }
}

// ///////////////////////
// イベントリスナー
// ///////////////////////

// // input & click
document.getElementById("ownr_category").addEventListener("change",(el)=>{ownr_select_category(el)});
document.getElementById("ownr-search").addEventListener("click",()=>{ownr_search();});
document.getElementById("ownr_maker").addEventListener("change",()=>{ownr_change_maker();});
document.getElementById("ownr_model").addEventListener("change",()=>{ownr_change_model();});
let ownr_evlist=["ownr_bind_selial"];
for(let i=0;i<ownr_evlist.length;i++){
  document.getElementById(ownr_evlist[i]).addEventListener("change",()=>{ownr_check_search();})
}
let ownr_radios=document.querySelectorAll(`input[type='radio'][name='ownr_radio1']`);
for(let obj of ownr_radios){ //ラジオボタン
  obj.addEventListener("change",()=>{ownr_check_radio();})
}