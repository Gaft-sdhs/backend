import fs from "fs";
import axios from "axios";
import cheerio from "cheerio";

// 웹 스크래퍼 클래스 정의
class web_Scraper {
  constructor(name) {
    this.name = name;
  }

  // HTML 가져오기
  getHtml = (url) => {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await axios.get(url));
      } catch (error) {
        reject(error);
      }
    });
  };

  // 안경 정보 가져오기
  get_glasses_Html = async (url, bodyList, img_selector, name_selector, subtitle_selector, price_selector) => {
    try {
      const arr = [url, bodyList, img_selector, name_selector, subtitle_selector, price_selector];
      if (!arr.every(element => typeof element === 'string')) {
        throw new Error("All the parameters must be strings");
      }
  
      const glasses_List = [];
      const html = await this.getHtml(url);
      const $ = cheerio.load(html.data);
      const $bodyList = $(bodyList);
  
      for (let i = 0; i < $bodyList.length; i++) {
        const element = $bodyList[i];
        // const rating_link = "https://rounz.com/" + $(element).find("a").attr("href");
        // const secondBody = ".top";
        // const rating_selector = " em > span";
        
        console.log(i);
        
        const glasses_name_split = $(element).find(name_selector).text().trim().split(' ');
  
        if ($(element).find(price_selector).text().trim() !== "" && element !== null && $(element).find("i").text().trim() > 5000) {
          glasses_List[i] = {
            img_url: ($(element).find(img_selector).attr("src") || $(element).find(img_selector).attr("href")),
            company: glasses_name_split[0],
            glasses_name: $(element).find(name_selector).text().trim(),
            subtitle: $(element).find(subtitle_selector).text().trim(),
            price: $(element).find(price_selector).text().trim(),
            link: "https://rounz.com/" + $(element).find("a").attr("href"),
            rating: (Math.random() * (5 - 4) + 4).toFixed(1),
          };
        }
      }
  
      return glasses_List.filter(Boolean);
    } catch (error) {
      console.error(error);
      return "An error occurred while getting the HTML";
    }
  };
  

  // JSON 파일로 저장
  save_to_json = async (url, page_number, file_path) => {
    const arr = [];
    try {
      for(let i=1; i<=page_number; i++){
              await this.get_glasses_Html(url+`&page=${i}`, "ul.list > li",".thumb > img",".v2 > dt",".v2 > .title",".v2 > dd > em > em > strong").then(array=>{
                  array.forEach(element=>{
                    arr[i] = element;
                  });
                  // console.log(url+`&page=${i}`);
              })

          }
      console.log(arr);
      const jsonString = JSON.stringify(arr, null, 2);
      
      fs.writeFileSync(file_path,jsonString,'utf8');
      console.log("File was successfully saved.");
    } catch (error) {
      console.error("Error writing file", error);
    }
  };
}

// rounz 웹 스크래퍼 초기화
const initialize_rounz = () =>{
  const rounz = new web_Scraper();
  
  fs.readFile("json/rounz_glasses.json", "utf8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return;
      }
  
      if(!data){
          console.log(data.length);
          rounz
           .get_glasses_Html(
            process.env.ROUNZ_REGULAR_GLASSES_URL,
            "ul.list > li",
            ".thumb > img",
            ".v2 > dt",
            ".v2 > .title",
            ".v2 > strong"
          )
          .then((array) => {
            rounz.save_to_json(
              process.env.ROUNZ_REGULAR_GLASSES_URL,
              400,
              "json/rounz_glasses.json"
            );
        });      
      }
  });
}

initialize_rounz(); // rounz 웹 스크래퍼 실행