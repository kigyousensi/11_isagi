// ////////////////////////////////////////////////////////////////////////////
// 資産登録画面
// ////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////
// 初期化
///////////////////////////////////////
let asset_const=()=>{
   // オーナーが持っている資産一覧を取得
   let ajaxcall=new Promise((resolve_func)=>{
       let rt=[
         {"assetid":"X1000001","maker":"GIANT","model":"TCR","model-detail":"SL1","regist":"2022-12-10","serial":"K7EK20662","bouhan":"千123456789","comment":"メモ","rel":"true","repsw":"true","repdate":"2022-10-10","repno":"A00001"},
         {"assetid":"X1000002","maker":"Bianchi","model":"SPRINT","model-detail":"DISK","regist":"2022-12-10","serial":"K7EK20663","bouhan":"千123456780","comment":"メモ","rel":"false","repsw":"false","repdate":"2022-10-10","repno":"A00002"}
      ];
       setTimeout(resolve_func,1000,rt);
   });
   ajaxcall.then((recv)=>{
      // テンプレートを取得
      let rslt=document.getElementById("asset-top");
      let tmp=document.getElementById("asset-tmp");
      let node,items,elm,flg;
      // 取得したデータをカードにして表示
      for(let i=0;i<recv.length;i++){
         /// クローンを作成
         node=tmp.content.cloneNode(true);
         /// カードを作成
         { //// 画像
            items=node.querySelectorAll('[name="img"]');
            items[0].setAttribute("src","img/"+recv[i]["assetid"]+".jpg");
            items[0].setAttribute("onclick","setAssetCardDetail(this)");
            //items[0].addEventListener("click",()=>{console.log("ok");});
         }
         { //// 概要
            items=node.querySelectorAll('[name="product"]');
            items[0].textContent=recv[i]["maker"];
            items[1].textContent=recv[i]["model"]+" "+recv[i]["model-detail"];
         }
         { //// 資産情報
            items=node.querySelectorAll('[name="info"]');
            items[0].textContent="資産番号 : "+recv[i]["assetid"]+" ("+recv[i]["regist"]+"登録)";
            items[1].textContent="個体番号 : "+recv[i]["serial"];
         }
         { //防犯登録
            items=node.querySelectorAll('[name="asset-bouhan"]');
            items[0].value=recv[i]["bouhan"];
            items[0].setAttribute("id","asset-bouhan-"+i);
            items[1].setAttribute("for","asset-bouhan-"+i);
            items[2].setAttribute("id","asset-bouhan-help-"+i);
            items[3].setAttribute("id","asset-bouhan-wait"+i);
            
            //コメント
            items=node.querySelectorAll('[name="asset-comment"]');
            items[0].value=recv[i]["comment"];
            items[0].setAttribute("id","asset-comment-"+i);
            M.CharacterCounter.init(items[0]);
            items[1].setAttribute("for","asset-comment-"+i);
            items[2].setAttribute("id","asset-comment-help-"+i);
            items[3].setAttribute("for","asset-comment-wait"+i);
         }
         { //// 盗難届
            //届出日
            items=node.querySelectorAll('[name="asset-repdate"]');
            M.Datepicker.init(items[0],{"format":"yyyy-mm-dd"});
            items[0].value=recv[i]["repdate"];
            items[0].setAttribute("id","asset-repdate-"+i);
            items[1].setAttribute("for","asset-repdate-"+i);
            items[2].setAttribute("id","asset-repdate-help-"+i);
            items[3].setAttribute("id","asset-repdate-wait"+i);
            //盗難届番号
            items=node.querySelectorAll('[name="asset-repno"]');
            items[0].value=recv[i]["repno"];
            items[0].setAttribute("id","asset-repno-"+i);
            items[1].setAttribute("for","asset-repno-"+i);
            items[2].setAttribute("id","asset-repno-help-"+i);
            items[3].setAttribute("id","asset-repno-wait"+i);
         }
         /// イベントリスナーを登録
         /// 表示
         rslt.appendChild(node);
      }
   });
}

let setAssetCardDetail=(el)=>{
    // card-info領域の高さを算出
    let tgt=el.parentElement.parentElement.querySelectorAll(".card-info");
    let higt=0;let style;
    for(let obj of tgt[0].querySelectorAll(":scope> div")){
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

///////////////////////////////////////
// 
///////////////////////////////////////
// ///////////////////////
// css調整
// ///////////////////////
//

// ///////////////////////
// イベントリスナー
// ///////////////////////
