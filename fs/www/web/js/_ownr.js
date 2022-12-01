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
     // 個体番号入力欄の初期値を設定(最初の1件のみ)
     if(i==0){i++;Elm_text("ownr_bind_selial_label",gCategorys[key]["selial"]);}

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
}

///////////////////////////////////////
// イベント関数
///////////////////////////////////////
/// カテゴリーを選択際の動作
let ownr_select_category=function(el){
  let katamei;
   // 照合方法の選択欄を変更
   // 通常は型名。自転車の場合は防犯登録番号か車体番号
   {
    if(el.target.value==="Roadbike"){
      Elm_hide("ownr_bind_others");   //型名入力欄を非表示
      Elm_view("ownr_bind_Roadbike"); //防犯登録 or 車体番号を表示
    }
    else{
      Elm_hide("ownr_bind_Roadbike"); //防犯登録 or 車体番号を非表示
      katamei=own_autocomplete(el.target.value);//予測変換リストを更新
      katamei.then(Elm_view("ownr_bind_others"));   //型名入力欄を表示
    }
   }
   //個体番号入力欄の表示のラベルを変更
   Elm_text("ownr_bind_selial_label",gCategorys[el.target.value]["selial"]);
}

/// オートコンプリートのリストを編集
let own_autocomplete=((id)=>{
  // バインド
  let ownr_model_elems = document.querySelectorAll('#ownr_model');
  let ownr_model_instances = M.Autocomplete.init(ownr_model_elems);
  let ownr_model_instance=M.Autocomplete.getInstance(ownr_model_elems[0]);

  // 設定ファイルを読み込み
  let data=readFile("data/"+id+".ary");
  let Model=[];
  return data.then((recv)=>{
    Model=(new Function("return"+recv))();
    ownr_model_instance.updateData(Model);
  });
});
   
// 検索ボタンを押した場合の動作
let ownr_search=()=>{
  // フォームの値を取得して検索を実行
}

// フォームの値が変わったら検索ボタンを有効にするか判断する
let ownr_check_search=()=>{
  // 自転車の場合
  // どちらかのラジオボックスが必ず選択されているので個体番号が入力されているかのみ確認して問題なければ検索ボタンを活性化する
  // 自転車以外の場合
  // 型名と個体番号が入力されていることを確認して問題なければ検索ボタンを活性化する
  let rc=0;
  if(document.getElementById("ownr_category").value==="Roadbike"){ //自転車の場合
    // チェック不要
  }
  else{ // 自転車以外の場合
    //型名が入力されていることを確認
    let buf=document.getElementById("ownr_model").value;
    if(( buf.match( / /g ) || [] ).length == buf.length){rc=2;}
  }
  if(! document.getElementById("ownr_bind_selial").validity.valid || document.getElementById("ownr_bind_selial").value.length ==0 ){rc=1;}
  // ボタンの状態を変更
  if(rc==0){Elm_active("ownr-search");}else{Elm_disable("ownr-search");}
}

// ///////////////////////
// イベントリスナー
// ///////////////////////
document.getElementById("ownr_category").addEventListener("change",(el)=>{ownr_select_category(el)});
document.getElementById("ownr-search").addEventListener("click",()=>{ownr_search();})
let ownr_evlist=["ownr_category","ownr_model","ownr_bind_selial"];
for(let i=0;i<ownr_evlist.length;i++){
  document.getElementById(ownr_evlist[i]).addEventListener("change",()=>{ownr_check_search();})
}
let ownr_radios=document.querySelectorAll(`input[type='radio'][name='ownr_radio1']`);
for(let obj of ownr_radios){ //ラジオボタン
  obj.addEventListener("change",()=>{ownr_check_search();})
}
