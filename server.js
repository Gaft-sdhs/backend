// 필요한 모듈 가져오기
import dotenv from "dotenv/config"; // 환경 변수 설정을 위한 dotenv
import express from "express"; // Express 웹 프레임워크
import cors from "cors"; // CORS(Cross-Origin Resource Sharing) 미들웨어
import helmet from "helmet"; // 보안 관련 HTTP 헤더 설정을 위한 미들웨어
import bodyParser from "body-parser"; // 요청 본문 구문 분석을 위한 미들웨어
import session from 'express-session'; // 세션 관리를 위한 미들웨어
import MongoStore from "connect-mongo"; // MongoDB 세션 저장소 설정을 위한 미들웨어
import { appendFile } from "fs"; // 파일 추가 작업을 위한 모듈
import "./controller/glasses_controller.js";
import './database/database.js'
import router from "./router/router.js";
import fs from "fs"
const server = express(); // Express 애플리케이션 생성

// 요청 본문 구문 분석을 위한 미들웨어 설정
server.use(bodyParser.json()); // JSON 요청 본문 구문 분석
server.use(bodyParser.urlencoded({ extended: true })); // URL 인코딩된 요청 본문 구문 분석

// CORS (Cross-Origin Resource Sharing) 설정
server.use(cors({
    origin: 'https://localhost:3000', // 허용할 원본 주소
    methods: ['GET', 'POST', 'OPTIONS'] // 허용할 HTTP 메서드
}));

// 세션 설정
server.use(session({
    secret: process.env.SESSION_SECRET, // 세션 암호화를 위한 비밀 키 설정
    resave: true, // 세션의 변경 사항이 없더라도 세션을 다시 저장할 것인지 여부
    saveUninitialized: false, // 초기화되지 않은 세션을 저장할 것인지 여부
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }) // 세션 데이터를 MongoDB에 저장하기 위한 설정
}));
server.use(helmet());
server.use("/",router);

server.set("port", process.env.PORT);


// 서버 시작
server.listen(server.get('port'), () => {  
    console.log(`server is running on port ${process.env.PORT}`);
});



// 에러 처리
server.on('error', err => {
    console.error(err);
});
