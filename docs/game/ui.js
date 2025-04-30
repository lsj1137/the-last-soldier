import { BASE_URL } from "./constants.js";
import { getScore } from "./properties.js";
import { selectLevelUpOptions, chooseSkill } from "./skills.js";

function showLevelUpOptions() {
    let selected = selectLevelUpOptions();
    const wrapper = document.getElementById("skillCards");
    wrapper.innerHTML = "";
    selected.forEach(skill => {
        const card = document.createElement("div");
        card.className = "skill-card";
        card.innerHTML = `
            <img class="skill-icon" src="${skill.icon}" width="64" height="64" /><br />
            <p class="skill-dis">${skill.dis}</p>
            <strong class="skill-name">${skill.name}</strong>
        `;
        card.onclick = () => chooseSkill(skill);
        wrapper.appendChild(card);
    });

    document.getElementById("levelUpUI").style.display = "block";
}

function hideLevelUpOptions() {
    document.getElementById("levelUpUI").style.display = "none";
}

function getScores() {
    const wrapper = document.getElementById("scores");
    wrapper.innerHTML = "";
    // 점수 불러오기
    const response = fetch(`${BASE_URL}/scoreboard`)
    .then(response => response.json())
    .then((scores)=>{
        console.log(scores);
        scores.forEach((score, index) => {
            const row = document.createElement("li");
            row.className = "rank-row";
            row.innerHTML = `
                <p class="ranking">${index+1}</p>
                <p class="name">${score.name}</p>
                <p class="score">${score.score}</p>
            `;
            wrapper.appendChild(row);
        })}
    );
}

function showGameOverScreen() {
    document.getElementById("finalScore").textContent += getScore().toString();
    getScores();
    const button = document.getElementById("submitButton");
    button.textContent = "점수 등록";
    button.disabled = false;
    document.getElementById("gameOverUI").style.display = "flex";
}


function submitScore(event) {
    event.preventDefault();
    const name = document.getElementById("nameInput").value;
    const body = {name, score: getScore()};
    const response = fetch(`${BASE_URL}/new-score`, {
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        method:"post",
    })
    .then(response => response.json())
    .then(()=>{
        const button = document.getElementById("submitButton");
        button.textContent = "등록 완료";
        button.disabled = true;
    })
    .then(()=>getScores())
    .catch(()=>{
        showToast("점수 등록에 실패했습니다.");
    });
}

function showToast(content) {
    const toastElement = document.getElementById("toast");
    toastElement.textContent = content;
    toastElement.style.opacity = 1;
    setTimeout(()=>{
        toastElement.style.opacity = 0;
    }, 2000);
}

export { showLevelUpOptions, hideLevelUpOptions, showGameOverScreen, submitScore };
