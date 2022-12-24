// ////////////////////////////////////////////////////////////////////////////
// 資産登録画面
// ////////////////////////////////////////////////////////////////////////////

//
// 新規資産の登録
//

// ////////////////////////////////////
// 新規登録画面
// ////////////////////////////////////
// AddAsset = new cSubFunction("ch1-2-sub10");

//###############################
//## 画面を作成
//###############################

// # フォーム作成
let func_asset_action_add=function(){
   //
   // preprocess
   //
   // ファビコンをクローズ
   gmAsset_action.close();

   // 全ての入力項目を初期化
   Elm_disable("asset_add_submit");        //送信ボタンを無効化
   Elm_value("asset-new-maker","");        //メーカーを初期化
   Elm_value("asset-new-model","");        //メジャーモデルを初期化
   Elm_value("asset-new-sup","");          //マイナーモデルを初期化

   // カテゴリーを選択する前の全項目を非表示にする
   for(obj of AddAsset.getChRoot().querySelectorAll('[name="asset-act')){Elm_hide(obj);}

   //
   // main
   //
   // カテゴリーリストを作成
    /// define
    let select_category=document.getElementById("asset-new-category");  //selectタグ
    let template=document.getElementById("asset-new-category-temp");    //templateタグ
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
    select_category.selectedIndex=-1;

    // materialにバインド
    let asset_category_elems = document.querySelectorAll('#asset-new-category');
    M.FormSelect.init(asset_category_elems);
    M.FormSelect.getInstance(asset_category_elems[0]);

   // メモ欄に入力文字数のカウンターを追加
   items= document.querySelectorAll('#asset-new-memo');
   M.CharacterCounter.init(items[0]);M.CharacterCounter.init(items[0]);

   // 表示
   asset_action_add_listener("create");   //リスナーを登録
   AddAsset.open();
}

//###############################
//## フォーム
//###############################
// # カテゴリーをチェックしてメーカーの予測変換を編集
// # メーカーの変更を検出してモデルの予測変換を編集

// # 入力内容をチェックして送信フォームをアクティブ化

// # 送信
let asset_add_up_run=()=>{
   asset_action_add_listener("remove"); //リスナーを初期化
   AddAsset.close(); //close
}
// # キャンセル
asset_add_up_close=()=>{
   AddAsset.close(); //close
   asset_action_add_listener("remove"); //リスナーを初期化
}
////////////////////////////////////////
// リスナー
////////////////////////////////////////
//###############################
//## リスナーを登録/解除
//###############################
// #　登録と解除
let asset_action_add_listener=(act)=>{
   // act { "create" | "remove" }
   if(act==="create"){
      document.getElementById("asset-new-maker-help").addEventListener("click",eventfunc_asset_new_maker_help); //ヘルプ
      document.getElementById("asset-new-category").addEventListener("change",eventfunc_asset_new_category); //カテゴリを変更
      document.getElementById("asset-new-maker").addEventListener("change",eventfunc_asset_new_maker); //メーカーを変更
      document.getElementById("asset-new-model").addEventListener("change",eventfunc_asset_new_model); //メジャーモデルを変更
   }
   else{
      document.getElementById("asset-new-maker-help").removeEventListener("click",eventfunc_asset_new_maker_help);
      document.getElementById("asset-new-category").removeEventListener("change",eventfunc_asset_new_category); //カテゴリを変更
      document.getElementById("asset-new-maker").removeEventListener("change",eventfunc_asset_new_maker); //メーカーを変更
      document.getElementById("asset-new-model").removeEventListener("change",eventfunc_asset_new_model); //メジャーモデルを変更

      // カテゴリーリストを初期化
      let select_category=document.getElementById("asset-new-category");
      let options=select_category.querySelectorAll("option");
      for(i=1;i<options.length;i++){options[i].parentNode.removeChild(options[i]);}
   }
}

//###############################
//## イベント関数
//###############################
// # ヘルプ
let eventfunc_asset_new_maker_help=()=>{
   ArtMsg.open(type="info",title="メーカー名等の入力",text=`メーカー名、メジャーモデル、マイナーモデルは以下の要領で入力して下さい。<p class="img"><img src="./icon/asset-new-maker.jpg"/></p><br/>`,submit="閉じる");
}

// # カテゴリ変更
let eventfunc_asset_new_category=function(el){
   // カテゴリーが変化し、なおかつindex-1意外なら他の項目も表示
   if(document.getElementById("asset-new-category").selectedIndex != -1){
    for(obj of AddAsset.getChRoot().querySelectorAll('[name="asset-act')){Elm_view(obj);}
   }

   // カテゴリを選択した際に表示項目を変更してメーカーを編集
    {
     if(el.target.value==="Roadbike"){       // 自転車の場合
       Elm_require("asset-new-bouhan",true); ///防犯登録必須にする
       Elm_view("asset-bind-new-bouhan");    ///防犯登録を表示
     }
     else{
      Elm_require("asset-new-bouhan",false); ///防犯登録必須にしない
      Elm_hide("asset-bind-new-bouhan");     ///防犯登録を非表示
     }
     let maker=fAutocomlete(el.target.value,"asset-new-maker"); //メーカーの予測変換候補を編集
     Elm_value("asset-new-maker","");        //メーカーを初期化
     Elm_value("asset-new-model","");        //メジャーモデルを初期化
     Elm_value("asset-new-sup","");          //マイナーモデルを初期化
    }
    //個体番号入力欄の表示のラベルを変更
      Elm_text("asset-new-serial-label",gCategorys[el.target.value]["selial"]);

   // boxサイズを変更
   AddAsset.resize(); 
 
    //検索ボタンの表示を変更
 }

 // # メーカーを変更
 let eventfunc_asset_new_maker=function(){
   // メーカーの入力内容を予測変換に寄せる
   // カテゴリー、メーカーからモデルリストを取得してモデルの予測変換を作成する
   input_change_maker("asset-new-category","asset-new-maker","asset-new-model");
 }

// # モデルを変更
let eventfunc_asset_new_model=function(){
   // モデルの入力内容を予測変換に寄せる
   input_compandchoice("asset-new-model");
   // マイナーモデルを初期化する
   Elm_value("asset-new-sup","");
}

