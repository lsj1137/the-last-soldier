// server.js
const https = require('https');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db.js');
const Score = require('./models/Score.js');

const app = express();
const port = 8001;

app.use(cors());
app.use(express.json());

sequelize.sync() // 테이블 없으면 만들어줌
    .then(() => {
        console.log('DB 연결 성공!');
    })
    .catch(err => {
        console.error('DB 연결 실패:', err);
    });
 
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// 점수 조회
app.get('/scoreboard', async (req, res) => {
    const scores = await Score.findAll().then((queryResult)=>{
        return queryResult.sort((a,b)=>b.score-a.score).slice(0, 10);
    });
    res.json(scores);
});

// 점수 등록
app.post('/new-score', async (req, res)=>{
    console.log(req.body);
    const { name, score } = req.body;
    if (score===undefined || score===null) {
        return res.status(400).send('점수 없음');
    }
    try {
        const savedData = await Score.create({ name, score });
        res.json(savedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.listen(port, '0.0.0.0',() => {
    console.log(`서버가 포트 ${port}번에서 실행 중!`);
});