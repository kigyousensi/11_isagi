// ////////////////////////////////////////////////////////////////////////////
// 所有者確認画面(結果の表示とカードの制御)
// ////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////
// テンプレートからカードを作成
///////////////////////////////////////
let create_ownr_card=function(data){
  let rslt=document.getElementById("ownr-result-top");
  let tmp=document.getElementById("ownr_result_tmp");
  let node,items,flg;

  flg=0;
    // テンプレートからノードを作成
    node=tmp.content.cloneNode(true);
    { // 画像
     items=node.querySelectorAll('[name="img"]');
     Elm_attribute(items[0],"src","img/"+data["assetid"]+".jpg?"+fRnd());
     Elm_attribute(items[0],"onclick","setOwnrCardDetail(this)"); //カードオープンイベント
    }
    { // メーカー、型名、警告
     items=node.querySelectorAll('[name="product"]');
     Elm_text(items[0],data["maker"]);  //メーカー名
     Elm_text(items[1],data["model"]+" "+data["sup"]);  //型名
     Elm_attribute(items[1],"onclick","setOwnrCardDetail(this)"); //カードオープンイベント
     if(data["caution"]==="true"){      //盗難届が出ている場合
      Elm_view(items[2]);
      Elm_attribute(items[2],"onclick",`ArtMsg.open(type="warn",title="盗難品の可能性があります",text="この動産は所有者によって盗難届が提出されています。<br/>SNSやフリマアプリで購入しようとしている場合は取引の中止を推奨します。<br/><br/>[お願い]<br/>差し支えなければ発見した場所を本来の所有者へ連絡して下さい。所収者のSNSのアカウントへ直接連絡するか、匿名でメッセージを送信できます。",submit="閉じる")`);
     }else{Elm_hide(items[2]);}
    }
    { // twitterの連絡先
     items=node.querySelectorAll('[name="twitter"]');
     if(data["twitter"] !==""){
      Elm_view(items[0]);
      Elm_attribute(items[1],"href","https://twitter.com/"+data["twitter"]);
      Elm_text(items[1],data["twitter"]);
      flg++;
     }
     else{items[0].classList.add("hide");}
    }
    { // instagramの連絡先
     items=node.querySelectorAll('[name="instagram"]');
     if(data["instagram"] !==""){
       items[0].classList.remove("hide");
       items[1].setAttribute("href","https://www.instagram.com/"+data["instagram"]);
       items[1].textContent=data["instagram"];
       flg++;
     }
     else{items[0].classList.add("hide");}
    }
    { //SNS全体の枠
     items=node.querySelectorAll('[name="sns"]');
     if(flg==0){Elm_hide(items[0]);}else{Elm_view(items[0]);}
    }
    { // 車体番号、メモ
     items=node.querySelectorAll('[name="param"]');
     Elm_text(items[0],"車体番号:"+data["serial"]);
     Elm_text(items[1],data["comment"]);
    }
    rslt.appendChild(node);
}