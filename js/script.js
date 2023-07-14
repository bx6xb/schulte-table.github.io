// HTML elements
const body = document.querySelector("body");
const startScreen = document.querySelector(".start-screen");
const startScreenBtn = document.querySelector(".start-screen-image");
const settingsScreen = document.querySelector(".settings-screen");
const bestScoresScreen = document.querySelector(".best-scores-screen");
const restartBtn = document.getElementById("restart-button");
const settingsBtn = document.getElementById("settings-button");
const blackScreen = document.querySelector(".black-screen");
const gameGrid = document.querySelector(".game-field-grid");
const findSection = document.querySelector(".best-score-find");
const findNum = document.querySelector(".best-score-find-num");
const bestScoreBlock = document.querySelector(".best-score-time");
const bestRecordValue = document.querySelector(".best-score-time-value");
const fieldSizeValue = document.querySelector(
  ".best-score-time-field-size-value"
);
const bestScoresScreenClose = document.getElementById(
  "best-scores-screen-close"
);
const settingsScreenClose = document.getElementById("settings-screen-close");
const freezeTimeInput = document.getElementById("freeze-time-input");
const rangeSeconds = document.querySelector(".range-seconds");
const themeInput = document.querySelectorAll("input[name='theme']");
const fieldSizeInput = document.getElementById("field-size-input");
const checkboxInput = document.getElementById("checkbox-input");
const trs = document.getElementsByTagName("tr");

// JS variables
let settings = {
  gridHeight: 3,
  gridWidth: 3,
  bestRecord: {
    "2x2": [null, ""],
    "3x3": [null, ""],
    "4x4": [null, ""],
    "5x5": [null, ""],
    "6x6": [null, ""],
    "7x7": [null, ""],
    "8x8": [null, ""],
    "9x9": [null, ""],
    "10x10": [null, ""],
  },
  freezeTime: 3,
  theme: "bright",
  hints: "off",
};

let currentNumber = 1;

// Functions

// Starts game
const start = () => {
  clearGrid();
  blockBtns();
  timerStart();
};

// Block restart and settings buttons while freeze time is running
const blockBtns = () => {
  restartBtn.classList.add("disabled");
  settingsBtn.classList.add("disabled");
  setTimeout(() => {
    restartBtn.classList.remove("disabled");
    settingsBtn.classList.remove("disabled");
  }, settings.freezeTime * 1000 + 200);
};

// Starts the timer before the game
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

// Fills the grid and records the result
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
          const finishTime = performance.now();
          clearGrid();
          findSection.classList.remove("show");
          const solvingTimeArray = showTime(startTime, finishTime);
          checkRecord(solvingTimeArray);
        }
      }
    });
  });
};

// Creats and returns array of random numbers
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

// Check grid width and height
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

// Records the best record
const checkRecord = (timeArray) => {
  const key = `${settings.gridWidth}x${settings.gridHeight}`;

  if (
    timeArray[0] < settings.bestRecord[key][0] ||
    settings.bestRecord[key][0] === null
  ) {
    settings.bestRecord[key] = timeArray;
    bestRecordValue.innerHTML = timeArray[1];
    trs[settings.gridWidth - 1].children[1].innerHTML = timeArray[1];
  }

  save();
};

// Convert seconds to hh:mm:ss:msms format
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

// Shows solvung time after completing game
const showTime = (startTime, finishTime) => {
  const solvingTime = ((finishTime - startTime) / 1000).toFixed(2);

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

// Clears the grid
const clearGrid = () => {
  gameGrid.innerHTML = "";
  currentNumber = 1;
  findNum.innerHTML = currentNumber;
};

// Changes page theme
const changeTheme = (value) => {
  const fields = document.querySelectorAll(".field");
  if (value === "dark") {
    settings.theme = "bright";
    body.classList.remove("dark-theme");
    gameGrid.classList.remove("white-border");
    fields.forEach((field) => {
      field.classList.remove("white-border");
    });
  } else {
    settings.theme = "dark";
    body.classList.add("dark-theme");
    gameGrid.classList.add("white-border");
    fields.forEach((field) => {
      field.classList.add("white-border");
    });
  }
};

// Saves settings in local storage of browser
const save = () => {
  const settingsJson = JSON.stringify(settings);
  localStorage.setItem("settings", settingsJson);
};

// Updates settings from local storage
const updateSettings = () => {
  const size = settings.gridWidth + "x" + settings.gridWidth;

  // Updates field size and best record in 'best time' header
  fieldSizeValue.innerHTML = size;
  const record = !!settings.bestRecord[size][1]
    ? settings.bestRecord[size][1]
    : 0;
  bestRecordValue.innerHTML = record;

  // Updates theme
  const theme = settings.theme === "bright" ? "dark" : "bright";
  changeTheme(theme);

  // Updates value of checkbox in settings
  settings.hints === "on"
    ? checkboxInput.setAttribute("checked", "true")
    : null;

  // Updates value of theme input in settings
  if (settings.theme === "bright") {
    themeInput[0].setAttribute("checked", "true");
    themeInput[1].setAttribute("checked", "false");
  } else {
    themeInput[1].setAttribute("checked", "true");
    themeInput[0].setAttribute("checked", "false");
  }

  // Updates field seze in settings
  fieldSizeInput.value = settings.gridHeight;

  // Updates freeze time in settings
  freezeTimeInput.value = settings.freezeTime;
  rangeSeconds.innerHTML = settings.freezeTime + "s";

  // Updates best time table
  Object.keys(settings.bestRecord).forEach((key, index) => {
    console.log(key + " - " + index);
    if (settings.bestRecord[key][1]) {
      trs[index + 1].children[1].innerHTML = settings.bestRecord[key][1];
    } else {
      console.log(123);
    }
  });
};

// Gets and sets new settings from local storage
const setSettings = () => {
  const dataFromLS = localStorage.getItem("settings");
  if (dataFromLS) {
    const settingsJson = JSON.parse(dataFromLS);
    settings = settingsJson;
    updateSettings();
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

settingsScreenClose.addEventListener("click", () => {
  settingsScreen.classList.remove("show-flex");
});

themeInput.forEach((radio) => {
  radio.addEventListener("input", () => {
    changeTheme();
    save();
  });
});

freezeTimeInput.addEventListener("input", () => {
  rangeSeconds.innerHTML = freezeTimeInput.value + "s";
  if (blackScreen.innerHTML === "") {
    blackScreen.innerHTML = freezeTimeInput.value + "s";
  }
  settings.freezeTime = freezeTimeInput.value;

  save();
});

fieldSizeInput.addEventListener("change", () => {
  const size = fieldSizeInput.value;

  settings.gridHeight = size;
  settings.gridWidth = size;

  for (let key in settings.bestRecord) {
    if (key.includes(fieldSizeInput.value)) {
      fieldSizeValue.innerHTML = size + "x" + size;
      if (settings.bestRecord[key][1] !== "") {
        bestRecordValue.innerHTML = settings.bestRecord[key][1];
      } else {
        bestRecordValue.innerHTML = 0;
      }
    }
  }

  save();
  start();
});

checkboxInput.addEventListener("change", () => {
  if (checkboxInput.checked) {
    settings.hints = "on";
  } else {
    settings.hints = "off";
  }

  save();
});

bestScoreBlock.addEventListener("click", () => {
  bestScoresScreen.classList.add("show-flex");
});

bestScoresScreenClose.addEventListener("click", () => {
  bestScoresScreen.classList.remove("show-flex");
});

restartBtn.addEventListener("click", start);

setSettings();
