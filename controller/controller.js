import User from "../model/User.js";
import bcrypt from "bcrypt";
import fs from "fs";
import glasses_review from "../model/glasses_review.js";

// 회원가입 처리
export const signUp = async (req, res) => {
  try {
    const { email, password} = req.body; // 클라이언트로부터 이메일과 비밀번호를 받아옵니다.

    console.log(req.body);
    
    const emailExists = await User.exists({ email }); // 이미 존재하는 이메일인지 확인합니다.
    const encryptedPassword = bcrypt.hashSync(password, 10); // 비밀번호를 해싱합니다.

    console.log(emailExists);

    if (emailExists) return res.status(400).json({ message: "User already exists" }); // 이미 등록된 유저일 경우 에러 메시지를 반환합니다.

    const newUser = await User.create({email, password: encryptedPassword }); // 새로운 유저를 생성합니다.

    console.log({ "User created": newUser }); // 새로운 유저가 생성되었음을 로그에 남깁니다.

    res.status(201).json({
      message: "Member registration completed successfully",
      user: newUser,
    }); // 회원가입이 성공했음을 클라이언트에게 응답합니다.
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request" });
  }
};

// 로그인 처리
export const login = async (req, res) => {
  try {
    const { email, password } = req.body; // 클라이언트로부터 이메일과 비밀번호를 받아옵니다.

    const user = await User.findOne({ email }); // 해당 이메일로 유저를 찾습니다.

    if (!user)
      return res.status(400).json({
        message: "No Users found with the email & password you provided",
      }); // 해당 유저가 없을 경우 에러 메시지를 반환합니다.

    const checkPassWord = await bcrypt.compare(password, user.password); // 비밀번호 일치 여부를 확인합니다.

    if (!checkPassWord)
      return res.status(401).json({ message: "password please try again" }); // 비밀번호가 일치하지 않을 경우 에러 메시지를 반환합니다.

      req.session.user = user;
      req.session.isLoggedIn = true;
      res.status(200).json({ message: "Successfully logged in" }); // 로그인이 성공했음을 클라이언트에게 응답합니다.
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request" });
  }
};

// 일정 개수의 안경 정보를 반환하는 함수
export const get_regular_glasses = async (req, res) => {
  try {
    const { length } = req.query; // 클라이언트로부터 받은 길이 정보를 가져옵니다.
    const client_data = []; // 클라이언트에게 전달할 데이터를 담을 배열을 초기화합니다.

    const path = process.cwd() + `/json/rounz_glasses.json`; // JSON 파일 경로를 설정합니다.
    fs.readFile(path, "utf8", (err, data) => { // JSON 파일을 비동기적으로 읽어옵니다.
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ message: "An error occurred while finding the file" });
      }

      if (data.length == 0) {
        return res.status(300).json({ message: "Scraping data" });
      }
      const objects = JSON.parse(data); // JSON 파일의 내용을 객체로 파싱합니다.

      for (let i = 0; i < length; i++) { // 요청받은 길이만큼의 데이터를 가져와 배열에 담습니다.
        if(objects[i] === null){
          i -= 1;
        }else{
          client_data.push(objects[i]);
        }
      }

      console.log(client_data.length); // 전송할 데이터의 길이를 로그에 출력합니다.

      res
        .status(200)
        .json({ type: "Array", length: client_data.length, data: client_data }); // 클라이언트에게 응답을 보냅니다.
      console.log("response sent");
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while sending the data" });
  }
};


// 랜덤한 안경 정보를 반환하는 함수
export const send_random = async (req, res) => {
  const { length } = req.query; // 클라이언트로부터 받은 길이 정보를 가져옵니다.
  const client_data = []; // 클라이언트에게 전달할 데이터를 담을 배열을 초기화합니다.

  const path = process.cwd() + `/json/rounz_glasses.json`; // JSON 파일 경로를 설정합니다.
  fs.readFile(path, "utf8", (err, data) => { // JSON 파일을 비동기적으로 읽어옵니다.
    if (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "An error occurred while finding the file" });
    }

    if (data.length == 0) {
      return res.status(300).json({ message: "Scraping data" });
    }

    const objects = JSON.parse(data); // JSON 파일의 내용을 객체로 파싱합니다.

    for (let i = 1; i <= length; i++) { // 요청받은 길이만큼의 데이터를 랜덤으로 가져와 배열에 담습니다.
      let random_num = Math.floor(Math.random() * 400);
      console.log(random_num);
      if(objects[randum_num] === null){
        i-=1;
      }else{
        client_data.push(objects[random_num]);
      }
    } 

    console.log(client_data);

    res
      .status(200)
      .json({ type: "Array", length: client_data.length, data: client_data }); // 클라이언트에게 응답을 보냅니다.
    console.log("response sent");
  });
};

export const write_review = async(req,res)=>{
  try{
    const {glasses_name,review,img_url,link} = req.body;
    const writer = req.session.user.id
    const new_review = await glasses_review.create({glasses_name,review,img_url,link,writer});
    
    res.status(200).json({"Sucess":new_review});
  }catch(error){
    console.error(error);
    res.status(500).json({"message":"An error occured"});
  }
}


export const get_review = async(req,res)=>{
  const writer = req.session.user.id;

  const new_review = await glasses_review.find({writer});
  
  console.log("user found",new_review);

  res.status(200).send(new_review);
}

