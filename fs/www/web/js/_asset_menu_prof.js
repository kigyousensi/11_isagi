////////////////////////////////////////
// カードメニュー項目のアクション(証明書類の送付)
////////////////////////////////////////
// 証明書類の送付画面を表示 /////////
let asset_prof_item=(e)=>{
   //
   // preprocess
   //
   asset_card_menu_close(e.parentNode);//カードメニューを閉じる

   //
   // define
   //
   let rootnode=e.parentNode.parentNode.parentNode;   // card
   let assetid=rootnode.dataset.assetid;              // assetid
   let type=rootnode.dataset.type;                    // 資産タイプ(1=ロードバイク)

   //
   // main
   // 
   //証明書類送付フォームを表示
   asset_syomei_createform(assetid,type);          //ファイル添付フォームを作成
   Elm_view("ch1-2-sub3");
}

// 証明書類を送付 //////////////////////
let asset_syomei_up_run=()=>{
   // assetidと画像データを推進
}

// 証明書類の送付をキャンセル //////////
let asset_syomei_up_close=()=>{
   // 表示を消す
   Elm_hide("ch1-2-sub3");
}

// テンプレートから画像添付フォームを作成
let asset_syomei_createform=(assetid,type)=>{
   //
   // preprocess
   //
   // 画像の添付フォームを全てリセット(削除)
   for(obj of document.getElementById("asset-syomei-root").querySelectorAll(":scope> div")){
      obj.parentNode.removeChild(obj);
   }
   // 送信ボタンを無効化
   Elm_disable("asset_syomei_submit");

   //
   // define
   //
   let root=document.getElementById("asset-syomei-root"); 　// この下にテンプレートを追加していく
   let tmp=document.getElementById("asset-tmp-photo");      // テンプレートを取得
   let node,items,cols=[];                                  //ループ用変数

   //
   // main
   //
   // 資産タイプで表示するフォームの数を変える
   switch(type){
      case "1" :cols=["防犯登録カード(防犯登録番号と車体番号が記載されているもの)","車体(防犯登録番号)","車体(車体番号"];
            break;
      default:cols=["製品の本体(型名)","製品の本体(製造番号)"];
   }
   for(let i=0;i<cols.length;i++){
      // テンプレートのクローンノードを作成
      node=tmp.content.cloneNode(true);

      // 説明文を記載
      items=node.querySelector("span");
      items.textContent=cols[i];

      // リスナーを登録
      items=node.querySelector("input");
      items.addEventListener("change",asset_syomei_preview);

      // 子ノードを作成
      root.appendChild(node);
   } 
}

// プレビューを表示 //////////////////////
let asset_syomei_preview=(el)=>{
   //
   // define
   //
   let root=el.target.parentNode.parentNode;     //テンプレートルート
   let preview=root.querySelector(".pic");        //P要素

   //画像の高さを決定(幅の3/4)
   let width=preview.clientWidth;
   let hight=parseInt(width*3/4);
   preview.style.height=hight+"px";
   
   //
   // main
   //
   // 添付した画像データをプレビュー領域に反映
   let fr=new FileReader();
   fr.onload=(()=>{preview.style.backgroundImage=`url(${fr.result})`;});
   fr.readAsDataURL(el.target.files[0]);
   
   // ファイルを添付したフォームのchangeデータセットをtrueにする
   el.target.dataset["change"]="true";
   //
   // end
   //
   // 上位要素の高さを調整
   {
    let box=root.parentNode.parentNode;
    let h=120;
    for(obj of box.querySelectorAll(":scope>div")){
       h+=obj.offsetHeight;
    }
    box.style.height=`min(80vh,${h}px)`;
   }
   // 全ての添付ファイルが選択されたら送信ボタンを活性化する
   let f=0;
   for(obj of document.getElementById("asset-syomei-root").querySelectorAll('[type="file"]')){
      if(obj.dataset["change"]==="false"){f=1;}
   }
   if(f==0){
      Elm_active("asset_syomei_submit");
   }
 }

