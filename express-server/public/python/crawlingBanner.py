import requests
from bs4 import BeautifulSoup as bs

headers = {
    'User-Agent' : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    'Accept-Language' : "ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3"
}

def getBanner():
    url = "https://www.coupang.com"
    bannerList = []
    data = requests.get(url, headers= headers)
    if data.status_code == 200 :
        soup = bs(data.content, "html.parser")

        a = soup.select("div.main-today__img-container a")
        img = soup.select("section.main-today img.main-today__bg")

        for i in range(len(a)):
            bannerList.append({
                "href" : a[i]['href'],
                "img" : img[i]['data-src'] if img[i].get('src') == None else img[i]['src'],
                "width" : img[i]['width'],
                "height" : img[i]['height']
            })

        print(bannerList)
    else :
        print("Error excuted : banner crawling Intenal error")




if __name__ == "__main__":
    getBanner()