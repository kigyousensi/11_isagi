// /////////////////////////////////////////////////
// ajaxコール用クラス ES6対応
// usage :
//  cAjax(url)
//    url : コール先プログラム
//  .send(data,type)
//    data : {連想配列 | 'none'}
//           送信するデータ。送信するデータが無い場合は'none'を指定する
//    type : {text | xml | json}
//           受信するデータ形式。コール先のプログラムの仕様による。
//  .setPosttype(posttype)
//    posttype : { 'POST' | 'GET' } default... 'POST'
//           送信する形式
//  .setAsynctype(asynctype)
//    asynctype: { true | false } default... 'true'
//           非同期で送信するか
// ex)
// let data[];data={key1:'data1',key2:'data2'}; //データは事前に連想配列で定義しておく
// let ajax=new cAjax("/app/test.php");          //ajax用のオブジェクトを作成
// （同期の場合)
// ajax.setAsynctype(false);                //同期モードに変更
// ajax.send(data,'json');                      //データを送信(この場合はjsonで結果を受け取る)
// console.log(ajax.getResult());               //結果をコンソールに表示
// (非同期の場合：デフォルト)
// let callajax=ajax.send(data,'json');             //データを送信(この場合はjsonで結果を受け取る)
// callajax.then((recv)=>{console.log(recv)}    //受信したデータをrecvに受取り、コンソールに表示
//
// /////////////////////////////////////////////////

class cAjax
{
   constructor(url)
   {
      this.url=url;
      this.request=this.CreateAjaxRequest();
      this.posttype='POST';         // get/postの設定
      this.asynctype=true;          // trueなら非同期
      this.iframeon=false;          // trueならiframeへの埋め込み可
      this.contenttype=1;           // 1:application/x-www-form-urlencoded,2:
      this.result="";
   }

   CreateAjaxRequest()
   {
     let ajaxRequest;
     try {ajaxRequest = new XMLHttpRequest();}
     catch(trymicrosoft){try{ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");}catch(failed){ajaxRequest=null;}}
     return ajaxRequest;
   }

   setPosttype(posttype){this.posttype=posttype;}
   setAsynctype(asynctype){this.asynctype=asynctype;}
   setIframeOn(iframeon){this.iframeon=iframeon;}
   getResult(){return this.result;}
   send(data,recvtype)
   {
    let self=this;
    //文字列の生成
    let str=null;;
    if(data != 'none'){//送信する文字列を生成
      let buf="";
      for (let key in data){buf=key+"="+escape(data[key]);if(str==null){str=buf}else{str+="&"+buf};}
    };
    //非同期リクエストの場合はPromiseを返す
    if(this.asynctype==true){
     return new Promise(function(resolve){
       //レスポンス関数を定義する
       let ajaxcallback=function()
       {
          let recv;
          if((self.request.readyState == 4) && (self.request.status == 200))
          {
	        	if(recvtype=="text"){recv=eval("(self.request.responseText)");}
        		if(recvtype=="xml") {recv=eval("(self.request.responseXML)");}
		        if(recvtype=="json"){recv=eval('('+self.request.responseText+')');}
             resolve(recv);
          }
       };
       self.request.onreadystatechange = ajaxcallback;

       //リクエスト
       //リクエストヘッダを生成
       {
         self.request.open(self.posttype,self.url,self.asynctype);
         if(self.iframeon==true)
             {self.request.setRequestHeader("X-Frame-Options","SAMEORIGIN");}
         else{self.request.setRequestHeader("X-Frame-Options","DENY");}
         self.request.setRequestHeader("X-Frame-Options","DENY");
         self.request.setRequestHeader("X-Requested-With","XMLHttpRequest");
         if(self.posttype=='POST'){self.request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");}
       }
       {//リクエスト送信
         self.request.send(str);
       }
     });
    }
    //同期リクエストの場合は結果をそのまま返す
    if(this.asynctype==false){
      let ajaxcallback=function(){ // レスポンス関数を定義する
         let recv;
         if((self.request.readyState == 4) && (self.request.status == 200)){
           if(recvtype=="text"){recv=eval("(self.request.responseText)");}
           if(recvtype=="xml") {recv=eval("(self.request.responseXML)");}
           if(recvtype=="json"){recv=eval('('+self.request.responseText+')');}
           self.result=recv;
         }
      };
      {//リクエストヘッダを生成
        self.request.open(self.posttype,self.url,self.asynctype);
        if(self.iframeon==true)
            {self.request.setRequestHeader("X-Frame-Options","SAMEORIGIN");}
        else{self.request.setRequestHeader("X-Frame-Options","DENY");}
        self.request.setRequestHeader("X-Frame-Options","DENY");
        self.request.setRequestHeader("X-Requested-With","XMLHttpRequest");
        if(self.posttype=='POST'){self.request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");}
        self.request.onreadystatechange = ajaxcallback;
      }
      {//リクエスト送信
        self.request.send(str);
      }
    }
   }
}
