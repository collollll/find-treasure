// 🔅요소 가져오기
let result = document.querySelector("#result");
let chance = document.querySelector("#chance");
let user = document.querySelector("#user");
let playBtn = document.querySelector("#play");
let resetBtn = document.querySelector("#reset");
let imgBox = document.querySelector("img");
let answer = document.querySelectorAll("#answer li");
let wheel = document.querySelector(".wheel");

let count = 5;
let coumputerNum;
let history = [];
console.log(history);

// 🔅남은 횟수
let heart = '<img src="img/heart.png">';
chance.innerHTML = heart.repeat(count);

// 🔅랜덤 숫자 만들기
function randomNum() {
  coumputerNum = Math.floor(Math.random() * 100 + 1);
  console.log(coumputerNum);
}
randomNum();

// 🔅비어있는 점 찍기
let dotBox = document.querySelector("#dots");

let dotCount = 100;
let body = document.body;
let width = dotBox.clientWidth;
let height = dotBox.clientHeight;

let points = [];
for (let i = 0; i < dotCount; i++) {
  let x = Math.floor(Math.random() * (width - 4));
  let y = Math.floor(Math.random() * (height - 4));
  points.push({ x, y });
}

points.forEach((pos, i) => {
  let dot = document.createElement("div");
  dot.classList.add("dot");
  dot.style.left = `${(pos.x / width) * 100}%`;
  dot.style.top = `${(pos.y / height) * 100}%`;
  dot.dataset.index = i + 1;
  dotBox.appendChild(dot);
});

// 🔅입력한 숫자에 맞는 dot에 효과 적용
function matching(userNum) {
  let dot = dotBox.querySelector(`.dot[data-index="${userNum}"]`);

  dot.classList.add("active");
  if (userNum != coumputerNum) {
    setTimeout(() => {
      dot.classList.remove("active");
      dot.classList.add("miss");
    }, 1500);
  }
}

// 🔅play 함수 만들기
let userNum;

function play() {
  userNum = user.value;
  console.log(userNum);

  // 🔅입력한 숫자가 범위에 맞는지 확인
  if (userNum < 1 || userNum > 100) {
    result.innerHTML = "<span>1부터 100까지의 숫자를 입력해주세요</span>";
    return;
  }

  // 입력받은 값이 숫자가 아니라면
  if (isNaN(userNum)) {
    result.innerHTML = "<span>숫자를 입력해주세요</span>";
    return;
  }

  // 🔅↓↓ 아래 파트 이전에 history에 내가 입력한 값과 같은게 있는지 확인을 먼저 해야함
  if (history.includes(userNum)) {
    result.innerText = "이미 입력한 숫자입니다. 다른 숫자를 입력해주세요.";
    user.value = "";
    return;
  }

  // 🔅이전에 입력했던 숫자를 다시 입력한 경우, 숫자를 다시 입력할 수 있도록 return
  history.push(userNum);
  console.log(history);

  // 🔅입력한 숫자와 랜덤 숫자를 비교
  if (userNum < coumputerNum) {
    gsap.to(wheel, { rotate: "+=360deg", duration: 1 });
    result.classList.remove("upDown");
    result.textContent = "보물 찾는중...";
    gsap.fromTo(result, { opacity: 0, y: 80 }, { opacity: 1, y: 0 });
    matching(userNum);
    if (count > 1) {
      setTimeout(() => {
        if (count > 0) {
          result.innerHTML = "이런 꽝이잖아! <br> 더 멀리 나가보자";
        }
      }, 1200);
    }
  } else if (userNum > coumputerNum) {
    gsap.to(wheel, { rotate: "+=360deg", duration: 1 });
    result.classList.remove("upDown");
    result.textContent = "보물 찾는중...";
    gsap.fromTo(result, { opacity: 0, y: -80 }, { opacity: 1, y: 0 });
    matching(userNum);
    if (count > 1) {
      setTimeout(() => {
        if (count > 0) {
          result.innerHTML = "이런 꽝이잖아! <br> 더 가까이에 있나본데...";
        }
      }, 1200);
    }
  } else if (userNum == coumputerNum) {
    gsap.to(wheel, { rotate: "+=360deg", duration: 1 });
    result.classList.remove("upDown");
    result.textContent = "보물 찾는중...";
    matching(userNum);
    setTimeout(() => {
      find();
    }, 1000);
  } else {
    result.innerHTML = "<span>숫자를 입력해주세요</span>";
  }

  // 🔅입력받은 값을 화면에 띄움
  answer[5 - count].textContent = user.value;
  user.value = "";

  // 🔅찬스를 1씩 감소시킴
  count--;
  chance.innerHTML = heart.repeat(count);

  if (count < 1) {
    if (userNum == coumputerNum) return;

    playBtn.disabled = true;
    user.disabled = true;
    text = "GAMEOVER";
    result.innerHTML = `<span>${text}</span>`;

    setTimeout(() => {
      let over = text.split("");
      let over2 = [];
      over.forEach((letter) => {
        over2.push(`<span>${letter}</span>`);
      });
      console.log(over2);

      result.innerHTML = over2.join("");

      let spans = result.querySelectorAll("span");

      spans.forEach((letter, index) => {
        setTimeout(() => {
          letter.classList.add("fall");
        }, 200 + index * 200);
      });
      setTimeout(() => {
        result.innerHTML = `정답 : ${coumputerNum}<br>다시 보물찾기에 도전해볼까?`;
        resetBtn.classList.add("alarm");
      }, 2500);
    }, 1000);
  }
}

// 🔅시작 버튼 눌렀을 때 play 함수를 호출
playBtn.addEventListener("click", play);

// 🔅input을 누르면(=focus) 자동으로 입력한 값이 지워짐
user.addEventListener("focus", () => {
  user.value = "";
});

// 🔅재시작 버튼 눌렀을 때 초기화 되도록 함
resetBtn.addEventListener("click", reset);
function reset() {
  result.textContent = "어디로 가볼까?";
  result.classList.add("upDown");
  count = 5;
  chance.innerHTML = heart.repeat(count);
  user.value = "";
  playBtn.disabled = false;
  user.disabled = false;
  answer.forEach((i, index) => {
    answer[index].textContent = "";
  });
  wheel.style.transform = `rotate(0deg) translateX(-50%)`;

  resetBtn.classList.remove("alarm");

  history.forEach((i) => {
    history.splice(0, i);
  });
  document
    .querySelectorAll(".dot.active")
    .forEach((d) => d.classList.remove("active"));

  randomNum();
  findReset();
}

// 🔅게임방법 모달창
let modalBox = document.querySelector("#modalBox");
let close = document.querySelector(".close");

let isOpen = true;

close.addEventListener("click", () => {
  modalBox.classList.add("no");
  isOpen = false;
  resultUp();
});

// 게임방법 열기
let desImg = document.querySelector("#top > img");
desImg.addEventListener("click", () => {
  modalBox.classList.remove("no");
  isOpen = true;
  resultUp();
});

// result 결과창 보였다 안보였다
function resultUp() {
  result.style.display = isOpen ? "none" : "block";
}

// 설명글에 스크롤 문구 넣기
let desBox = document.querySelector("#modalBox .description > div");
let cursorSc = document.querySelector("#modalBox .cursorSc");
function showScroll(e) {
  if (desBox.scrollHeight > desBox.clientHeight) {
    // console.log("와~");
    cursorSc.style.display = "block";
    cursorSc.style.left = `${e.clientX}px`;
    cursorSc.style.top = `${e.clientY}px`;
  } else {
    cursorSc.style.display = "none";
  }
}
desBox.addEventListener("mousemove", showScroll);
desBox.addEventListener("mouseleave", () => {
  cursorSc.style.display = "none";
});
showScroll();

window.addEventListener("resize", () => {
  if (desBox.scrollHeight <= desBox.clientHeight) {
    cursorSc.style.display = "none";
  }
});

// 🔅정답화면 모달창_find 함수
let treasure = document.querySelector("#modalFind");
let text22 = document.querySelector("#modalFind .inner .in");
let arrow = document.querySelector("#modalFind .inner span");
let home = document.querySelector("#modalFind .home");

let in1 = "저게 뭐지?";
let in2 = "보물을 찾았다!!";
let in3 = "이제 집으로 돌아가자";

let textNum = 0;
let isStart1 = false;
let isStart2 = false;

document.addEventListener("click", handleNext);
document.addEventListener("keydown", handleNext);

let isRunning = false;
function handleNext(e) {
  if (isRunning) return;

  isRunning = true;

  if (isStart2) {
    start3();
  } else if (isStart1) {
    start2();
  } else {
    isRunning = false;
  }
}

function find() {
  gsap
    .timeline()
    .to(treasure, { display: "block" })
    .to(treasure, { opacity: 1, duration: 1.5 })
    .to("#modalFind .inner", { display: "block" })
    .call(() => {
      let typing = setInterval(() => {
        if (textNum < in1.length) {
          let out = in1.charAt(textNum);
          text22.textContent += out;
          textNum++;
        } else {
          clearInterval(typing);
          arrow.classList.add("show");
          isStart1 = true;
          isRunning = false;
        }
      }, 120);
    });
}

function start2() {
  text22.textContent = "";
  textNum = 0;
  arrow.classList.remove("show");

  gsap
    .timeline()
    .to("#modalFind img", { display: "block", scale: 0.5 })
    .to("#modalFind img", { opacity: 1, duration: 1.5, scale: 1 }, 0.3);
  let typing = setInterval(() => {
    if (textNum < in2.length) {
      let out = in2.charAt(textNum);
      text22.textContent += out;
      textNum++;
    } else {
      clearInterval(typing);
      arrow.classList.add("show");
      isStart2 = true;
      isRunning = false;
    }
  }, 120);
}

function start3() {
  text22.textContent = "";
  textNum = 0;
  arrow.classList.remove("show");

  let typing = setInterval(() => {
    if (textNum < in3.length) {
      let out = in3.charAt(textNum);
      text22.textContent += out;
      textNum++;
    } else {
      clearInterval(typing);
      arrow.classList.add("show");
      gsap
        .timeline()
        .to("#modalFind .home", { display: "block" })
        .to("#modalFind .home", { opacity: 1, duration: 1.5 }, 0.2);
      isRunning = false;
    }
  }, 120);
}

home.addEventListener("click", reset);

function findReset() {
  textNum = 0;
  isStart1 = false;
  isStart2 = false;
  text22.textContent = "";
  textNum = 0;
  arrow.classList.remove("show");

  gsap
    .timeline()
    .to("#modalFind .inner", { display: "none" })
    .to("#modalFind img", { display: "none", opacity: 0 })
    .to("#modalFind .home", { display: "none", opacity: 0 })
    .to(treasure, { display: "none", opacity: 0 });

  console.log("리셋됨");
}
