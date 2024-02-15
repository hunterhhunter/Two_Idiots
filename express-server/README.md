NodeJS Express Test repository


쿠팡 상품 검색

홈페이지 : 쿠팡 검색 기능
-> 검색에 따른 쿠팡 상품들을 가져와야되잖아

방식 : 사용자가 우리 서버에 쿠팡 상품 검색 요청 -> 우리 서버는 쿠팡 서버에 상품 검색 요청 -> 결과 html을 string 받아와서 데이터 추출(이미지 주소, 상품 페이지 url, 상품 id)
-> 데이터 가공 후 우리 서버가 사용자에게 검색 페이지 제공

-> 상품 페이지에 대한 url ->
-> https://www.coupang.com/np/search?component=q=하이&channel=user



특정 페이지 html 소스 가져오기


const request = new XMLHttpRequest();
const url = 'https://localhost:8080/test'; // 소스 가져올 페이지 

request.open('GET', url, true);
request.onload = function () {
var htmlText = request.responseText;
}

console.log(htmlText);