// ////////////////////////////////////////////////////////////////////////////
// 所有者確認画面
// ////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////
// 初期化
///////////////////////////////////////
let ownr_init=function(){
  //////////////////////////
  // カテゴリーリストを作成
  //////////////////////////
  /// カテゴリ選択リストにUIインスタンスをバインド
  let ownr_category_elems = document.querySelectorAll('#ownr_category');
  let ownr_category_instances = M.FormSelect.init(ownr_category_elems);
  let ownr_category_instance = M.FormSelect.getInstance(ownr_category_elems[0]);

   /// define
   let select_category=document.getElementById("ownr_category");  //selectタグ
   let template=document.getElementById("ownr_category_list");    //templateタグ
   let node;    //テンプレートをコピーして作成するノード
   let option;  //テンプレート内のoptioオブジェクト
   let i=0;

   /// OptionタグをgCategorys配列から作成
   for(let key in gCategorys){
     // Optionタグを作成
     node=template.content.cloneNode(true);
     option=node.querySelector("option");
     option.textContent=gCategorys[key]["name"];
     option.setAttribute("value",key);
     option.setAttribute("data-icon","icon/"+gCategorys[key]["img"]);
     select_category.appendChild(node);
   }

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
    }
    else{
      Elm_hide("ownr_bind_Roadbike"); //防犯登録 or 車体番号を非表示
      Elm_view("ownr-bind-product");  //製品関連を表示して入力を必須にする
      Elm_require("ownr_maker",true);  ///メーカー
      Elm_require("ownr_model",true);  ///型名
    }
    maker=fAutocomlete(el.target.value,"ownr_maker"); //メーカーの予測変換候補を編集
   }
   //個体番号入力欄の表示のラベルを変更
     Elm_text("ownr_bind_selial_label",gCategorys[el.target.value]["selial"]);
     Elm_view("ownr_selial");//個体番号

   //検索ボタンの表示を変更
   ownr_check_search();
}

///////////////////
/// 照合方法を選択した際の動作
///////////////////
let ownr_check_radio=(()=>{
  if(Elm_get("ownr_radio1")[1]==="bn"){ //防犯登録
    Elm_hide("ownr-bind-product");  //製品関連を非表示
    Elm_require("ownr_maker",false); ///メーカー
    Elm_require("ownr_model",false); ///型名
    Elm_text("ownr_bind_selial_label","防犯登録番号(ハイフンとは入力不要)");
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
let own_change_maker=(()=>{
  // 空白でなければメーカー名を取得し、空白を_に変換して小文字にする
  // カテゴリとメーカー名からモデルの予測変換ファイル名を作成
  let cat,maker,model;
  if(Elm_check("ownr_maker")){
    cat=Elm_get("ownr_category")[1];
    maker=Elm_get("ownr_maker")[1];
    //メーカーリストの中から選択された場合はモデルの予測変換リストを更新
    /// 入力値からファイル名を指定してモデル入力欄の予測変換リストを更新する
    /// メーカーリストkeysと入力値が一致している場合のみ本処理を行う。
    /// (この判断が無いと存在しない定義ファイルを読むためのhttp callが発生してしまう)
    /// 入力値が一致しない場合はモデルの予測変換リストをリセットする
    if(txcompkey(maker,document.getElementById("ownr_maker").M_Autocomplete.options.data)){
      maker=maker.replace(/ *$/,"");
      maker=maker.replace(" ","_");
      model=fAutocomlete(cat+"_"+maker.toLowerCase(),"ownr_model");
    }
    else{model=fAutocomlete("","ownr_model");}
  }
  ownr_check_search();
});

///////////////////
// 検索ボタンを押した場合の動作
///////////////////
let ownr_search=()=>{
  // フォームの値を取得して検索を実行
  //[カテゴリ,型名,自転車の照合方法,個体番号]
  // 検索結果を元にカードを作成
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
   if(Elm_get("ownr_category")[1]==="Roadbike"){ // 自転車の場合
     if(Elm_get("ownr_radio1")[1]==="bn"){       /// 防犯登録の場合
       //個別の確認項目なし
     }
     else{ /// 車体番号の場合
       if(! Elm_check("ownr_maker")){rc=1;}
       if(! Elm_check("ownr_model")){rc=2;}
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
document.getElementById("ownr_category").addEventListener("change",(el)=>{ownr_select_category(el)});
document.getElementById("ownr-search").addEventListener("click",()=>{ownr_search();});
document.getElementById("ownr_maker").addEventListener("change",()=>{own_change_maker();});
let ownr_evlist=["ownr_maker","ownr_model","ownr_bind_selial"];
for(let i=0;i<ownr_evlist.length;i++){
  document.getElementById(ownr_evlist[i]).addEventListener("change",()=>{ownr_check_search();})
}
let ownr_radios=document.querySelectorAll(`input[type='radio'][name='ownr_radio1']`);
for(let obj of ownr_radios){ //ラジオボタン
  obj.addEventListener("change",()=>{ownr_check_radio();})
}
