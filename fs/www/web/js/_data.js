// カテゴリーリスト
// 所収者の検索で使用
let gCategorys={
   "Roadbike":{name:"自転車",img:"Roadbike.png","selial":"防犯登録番号","type":1},
   "kaden":{name:"家電品",img:"kaden.png","selial":"製造番号","type":2}
};

// 保険会社とサービス
let gInsurances=[];
gInsurances['bridegestone1']='BRIDEGESTONE 自転車盗難補償';
gInsurances['giant1']='GIANT RIDE LIFE CARE PROGRAM';
gInsurances['ジャパン少額短期保険1']='J:ジャパン少額短期保険 ちゃりぽ';
gInsurances['panasonic1']='Panasonic ガチガチロック・ツインロックシリーズ 盗難補償';
gInsurances['panasonic2']='Panasonic 電動アシスト自転車 盗難補償';
gInsurances['sbi日本小短1']='SBI日本小短 みんなのスポーツサイクル保険';
gInsurances['unifa1']='Unifa Cycle Charm';
gInsurances['yamaha1']='YAMAHA 製品保証登録兼盗難保険登録';
gInsurances['zutto ride1']='Zutto Ride ずっと自転車盗難車両保険';
gInsurances['other']='other その他';

// 資産タイプ毎の証明書類
let gAssetTypes=[];
 gAssetTypes["default"]=["製品の本体(型名)","製品の本体(製造番号)"];//default
 gAssetTypes["Roadbike"]=["防犯登録カード<br/>店舗で防犯登録した際に発行される証明書","車体1<br/>防犯登録番号の記載部分","車体2<br/>車体番号の記載部分"];//自転車

