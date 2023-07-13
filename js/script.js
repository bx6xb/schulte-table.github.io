// HTML elements
const body = document.querySelector("body");
const startScreen = document.querySelector(".start-screen");
const startScreenBtn = document.querySelector(".start-screen-image");
const settingsScreen = document.querySelector(".settings-screen ");
const restartBtn = document.getElementById("restart-button");
const settingsBtn = document.getElementById("settings-button");
const blackScreen = document.querySelector(".black-screen");
const gameGrid = document.querySelector(".game-field-grid");
const findSection = document.querySelector(".best-score-find");
const findNum = document.querySelector(".best-score-find-num");
const bestRecordValue = document.querySelector(".best-score-time-value");
const closeBtn = document.getElementById("close-btn");
const freezeTimeInput = document.getElementById("freeze-time-input");
const rangeSeconds = document.querySelector(".range-seconds");
const themeInput = document.querySelectorAll("input[name='theme']");
const fieldSizeInput = document.getElementById("field-size-input");
const checkboxInput = document.getElementById("checkbox-input");

// JS variables
const settings = {
  gridHeight: 3,
  gridWidth: 3,
  bestRecord: Infinity,
  freezeTime: 3,
  theme: "bright",
  hints: "off",
  bestRecordConvertedTime: "",
};

let currentNumber = 1;

// Functions
const start = () => {
  blockBtns();
  clearGrid();
  timerStart();
};

const blockBtns = () => {
  restartBtn.classList.add("disabled");
  settingsBtn.classList.add("disabled");
  setTimeout(() => {
    restartBtn.classList.remove("disabled");
    settingsBtn.classList.remove("disabled");
  }, settings.freezeTime * 1000 + 200);
};

const timerStart = () => {
  blackScreen.classList.add("show-flex");
  let time = settings.freezeTime;
  const interval = setInterval(() => {
    if (time <= 0) {
      clearInterval(interval);
      blackScreen.classList.remove("show-flex");
      fillGrid();
    }
    blackScreen.innerHTML = time + "s";
    time = (time - 0.1).toFixed(1);
  }, 100);
};

const arrayRandomFill = (amount) => {
  const array = [];

  while (array.length < amount) {
    const number = Math.floor(Math.random() * (amount - 1 + 1)) + 1;
    if (!array.includes(number)) {
      array.push(number);
    }
  }

  return array;
};

const checkFieldSettings = () => {
  const computedStyle = getComputedStyle(gameGrid);
  const columnsSize = computedStyle.getPropertyValue("grid-template-columns");
  const gridSize = columnsSize.split(" ").length;
  if (gridSize !== settings.gridWidth) {
    let stringFr = "";
    for (let i = 0; i < settings.gridWidth; i++) {
      stringFr += "1fr ";
    }
    gameGrid.style.gridTemplateColumns = stringFr;
    gameGrid.style.gridTemplateRows = stringFr;
  }
};

const fillGrid = () => {
  checkFieldSettings();

  const amountOfFields = settings.gridHeight * settings.gridWidth;
  const arrayOfNums = arrayRandomFill(amountOfFields);

  findSection.classList.add("show");

  const startTime = performance.now();

  arrayOfNums.forEach((value) => {
    const field = document.createElement("div");
    field.classList.add("field");
    if (settings.theme === "dark") {
      field.classList.add("white-border");
    }
    field.innerHTML = value;
    gameGrid.appendChild(field);
    field.addEventListener("click", () => {
      if (currentNumber === value) {
        findNum.innerHTML = ++currentNumber;
        if (settings.hints === "on") {
          field.classList.add("green-bgc");
        }
        if (currentNumber > amountOfFields) {
          findSection.classList.remove("show");
          clearGrid();
          const solvingTimeArray = showTime(startTime);
          checkRecord(solvingTimeArray);
        }
      }
    });
  });
};

const checkRecord = (timeArray) => {
  if (timeArray[0] < settings.bestRecord) {
    settings.bestRecord = timeArray[0];
    settings.bestRecordConvertedTime = timeArray[1];
    bestRecordValue.innerHTML = timeArray[1];
  }
};

const convertTime = (time) => {
  const milliseconds = +time.toString().split(".")[1];
  const timeWithoutMilleseconds = +time.toString().split(".")[0];
  const hours = Math.floor(timeWithoutMilleseconds / (60 * 60));
  const minutes = Math.floor((timeWithoutMilleseconds % (60 * 60)) / 60);
  const seconds = Math.floor(timeWithoutMilleseconds % 60);

  let convertedTime = "";
  convertedTime = hours != 0 ? `${hours}h ` : convertedTime;
  convertedTime = minutes != 0 ? `${minutes}m ` : convertedTime;
  if (convertedTime === "") {
    return seconds + "." + milliseconds + "s";
  }
  convertedTime += seconds + "s";
  return convertedTime;
};

const showTime = (startTime) => {
  const solvingTime = ((performance.now() - startTime) / 1000).toFixed(2);

  solvingConvertedTime = convertTime(solvingTime);

  if (solvingConvertedTime.length >= 10) {
    blackScreen.classList.add("font-size-80");
  } else {
    blackScreen.classList.remove("font-size-80");
  }

  blackScreen.innerHTML = solvingConvertedTime;
  blackScreen.classList.add("show-flex");
  return [solvingTime, solvingConvertedTime];
};

const clearGrid = () => {
  gameGrid.innerHTML = "";
  currentNumber = 1;
  findNum.innerHTML = currentNumber;
};

const changeTheme = (value) => {
  const fields = document.querySelectorAll(".field");
  if (value === "bright") {
    settings.theme = "bright";
    body.classList.remove("dark-theme");
    gameGrid.classList.remove("white-border");
    fields.forEach((field) => {
      field.classList.remove("white-border");
    });
  }
  if (value === "dark") {
    settings.theme = "dark";
    body.classList.add("dark-theme");
    gameGrid.classList.add("white-border");
    fields.forEach((field) => {
      field.classList.add("white-border");
    });
  }
};

// Event listeners
startScreenBtn.addEventListener(
  "click",
  () => {
    setTimeout(() => {
      startScreen.classList.add("hide");
      start();
    }, 390);
    startScreen.classList.add("disappear");
  },
  { once: true }
);

settingsBtn.addEventListener("click", () => {
  settingsScreen.classList.add("show-flex");
});

closeBtn.addEventListener("click", () => {
  settingsScreen.classList.remove("show-flex");
});

themeInput.forEach((radio) => {
  radio.addEventListener("input", () => {
    changeTheme(radio.value);
  });
});

freezeTimeInput.addEventListener("input", () => {
  rangeSeconds.innerHTML = freezeTimeInput.value + "s";
  if (blackScreen.innerHTML === "") {
    blackScreen.innerHTML = freezeTimeInput.value + "s";
  }
  settings.freezeTime = freezeTimeInput.value;
});

fieldSizeInput.addEventListener("change", () => {
  settings.gridHeight = fieldSizeInput.value;
  settings.gridWidth = fieldSizeInput.value;
});

checkboxInput.addEventListener("change", () => {
  if (checkboxInput.checked) {
    settings.hints = "on";
  } else {
    settings.hints = "off";
  }
});

restartBtn.addEventListener("click", start);
