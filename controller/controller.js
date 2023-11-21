import User from "../model/User.js";
import bcrypt from "bcrypt";
import axios from "axios";
import cheerio from "cheerio";
import fs from "fs/promises";
import { statSync, existsSync, writeFileSync, writeFile } from "fs";
export const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailExists = User.exists({ email });
    const encryptedPassword = bcrypt.hashSync(password, 10);

    if (emailExists)
      return res.status(400).json({ messege: "User already exists" });

    const newUser = User.create({ email, password: encryptedPassword });

    console.log({ "User created": newUser });

    res
      .status(201)
      .json({
        messege: "Member registration completed successfully",
        user: newUser,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ messege: "An error occurred while processing your request" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({
          messege: "No Users found with the email & password you provided",
        });

    const checkPassWord = await bcrypt.compare(password, user.password);

    if (!checkPassWord)
      return res.status(401).json({ messege: "password please try again" });

    res.status(200).json({ messege: "Succeesfully loged in" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ messege: "An error occured while processing your request" });
  }
};


class web_Scraper{
    constructor(name){
        this.name = name;
    }

    getHtml = (url) => {
       return new Promise(async (resolve, reject) => {
         try {
           resolve(await axios.get(url));
         } catch (error) {
           reject(error);
         }
       });
     };
      get_glasses_Html = async (url,bodyList,img_selector,name_selector,subtitle_selector,arr = [url,bodyList,img_selector,name_selector,subtitle_selector]) => {
       try{
            arr.forEach(element=>{
                if(typeof(element) != String) return "All the parameter's must be A String";
            })
           
           let glasses_List = [];
           await this.getHtml(url).then((html) => {
             const $ = cheerio.load(html.data);
             const $bodyList = $(bodyList);
         
             $bodyList.map((i, element) => {
               glasses_List[i] = {
                 img_url: $(element).find(img_selector).attr("src"),
                 glasses_name: $(element).find(name_selector).text(),
                 subtitle: $(element).find(subtitle_selector).text(),
               };
             });
           });
       return await glasses_List;
       }catch(error){
            console.error(error);
           return "An errror occured While getting the html";
       }
     };

     save_to_json = async (url,page_number,file_path) =>{
         const arr = [];
         try {
            fs.stat(file_path,(err,stats)=>{
                console.log(stats.size)
                if(err){
                    console.error('Error occurred while checking file:',err);
                    return "Error occurred while checking file";
                }else{
                    if(stats.size !== 0) return "File is Not Empty"
                }
            });

            for(let i=1; i<=page_number; i++){
                    await this.get_glasses_Html(url+`&page=${i}`, "ul.list > li",".thumb > img",".v2 > dt",".v2 > .title").then(array=>{
                        arr.push(array[i]);  
                        console.log(url+`&page=${i}`);
                    })
                  
                }
                const jsonString = JSON.stringify(arr, null, 2); 
                fs.writeFile(file_path,jsonString, "utf8");
                console.log("File was successfully saved.");
        }catch(error) {
            console.error("Error writing file", error);
        }
   } 

}

const rounz = new web_Scraper;
// rounz.name = "Rounz";
// console.log(rounz.name);
// const a = async () =>{
//     const url = process.env.ROUNZ_REGULAR_GLASSES_URL
//     rounz.save_to_json(url,3,rounz.name,"rounz_glasses.json");
// }   

// a()

    rounz.get_glasses_Html(process.env.ROUNZ_REGULAR_GLASSES_URL, "ul.list > li",".thumb > img",".v2 > dt",".v2 > .title").then(array=>{
        rounz.save_to_json(process.env.ROUNZ_REGULAR_GLASSES_URL,434,"./json/rounz_glasses.json");
        // console.log(array);
    });

export const get_regular_glasses = async (req, res) => {

//   res.status(200).json({ type: "Array", array: arr });
};


