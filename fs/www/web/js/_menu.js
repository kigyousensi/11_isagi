// ////////////////////////////////////////////////////////////////////////////
// スライドメニュー
// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////
// スライドメニューの開閉
// ////////////////////////////////////
function slide_open() { //スライドメニューを開く
    document.getElementById("slide-menu").classList.remove("sidenav-list-close");
    document.getElementById("slide-menu").classList.add("sidenav-list-open");
}
function slide_close(){ //スライドメニューを閉じる
    document.getElementById("slide-menu").classList.remove("sidenav-list-open");
    document.getElementById("slide-menu").classList.add("sidenav-list-close");
} 

// ////////////////////////////////////
// リスナー
// ////////////////////////////////////
document.getElementById('slide-open').addEventListener("click",()=>{slide_open();});    //
document.getElementById('slide-back').addEventListener("click",()=>{slide_close();});   //
document.getElementById('slide-base').addEventListener("click",()=>{changech('ch1-1');}); //
document.getElementById('slide-list').addEventListener("click",()=>{changech('ch1-2');}); //
document.getElementById('slide-ownr').addEventListener("click",()=>{changech('ch2');}); //
document.getElementById('slide-loff').addEventListener("click",()=>{tryLogout();});     //
