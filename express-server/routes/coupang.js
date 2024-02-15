var express = require('express');
var router = express.Router();

var ChildProcess = require("child_process")
const iconv = require('iconv-lite')
// 한글 깨짐 방지를 위한 decoder
const fs = require("fs")

router.get("/home", (req, res) => {
    const python = ChildProcess.spawnSync('python', ["./public/python/crawlingBanner.py"])
    var result = iconv.decode(python.stdout, 'euc-kr')

    var banner_list = result.split('}')
    banner_list.pop()
    for(var i = 0; i< banner_list.length; i++) {
        banner_list[i] = banner_list[i] + '}'
        if(i == 0) {
            banner_list[i] = banner_list[i].slice(1)
        } else {
            banner_list[i] = banner_list[i].slice(2)
        }
        banner_list[i] = JSON.parse(banner_list[i].split("'").join('"'))
    }

    res.render("home", {
        banner : banner_list
    })
})

router.post("/search", (req, res) => {
    const url = `https://www.coupang.com/np/search?component=&q=${req.body.search_word}&channel=user`
    const python = ChildProcess.spawnSync('python', ['./public/python/crawlingProduct.py', url])
    var result = iconv.decode(python.stdout, 'euc-kr')
    // utf-8은 한글 파일 깨짐

    var product_list = result.split('}')
    product_list.pop()
    for(var i = 0; i< product_list.length; i++) {
        product_list[i] = product_list[i] + '}'
        if(i == 0) {
            product_list[i] = product_list[i].slice(1)
        } else {
            product_list[i] = product_list[i].slice(2)
        }
        product_list[i] = product_list[i].split("False").join("false")
        // python False 값 => JS false 값으로 변경
        product_list[i] = product_list[i].split("True").join("true")
        // python True 값 => JS true 값으로 변경
        product_list[i] = JSON.parse(product_list[i].split("'").join('"'))
        // {'Hello':...} 였던 문자열을 {"Hello":...}로 변경해 JSON.parse
    }

    // 리뷰 요약 json 파일 불러오기
    const fileList = ["sample.json"]
    for(var i = 0; i < product_list.length; i++) {
        for(var j = 0; j< fileList.length; j++) {
            const File = fs.readFileSync("./public/python/summary_review/result/"+fileList[j])
            const fileData = JSON.parse(File)
            if(product_list[i]["product_id"] in fileData) {
                product_list[i]["review_info"] = fileData[product_list[i]["product_id"]];
                // 리뷰 data 추가
                const list =["1","2","3","4","5"]
                for(var l in list) {
                    if(l in product_list[i]["review_info"]["star_count"]) {
                        
                    } else product_list[i]["review_info"]["star_count"][l] = 0
                }
                break;
            }
        }
    }

    res.render("products", {
        products : product_list
    })
    // res.send(product_list)
})

module.exports = router;

