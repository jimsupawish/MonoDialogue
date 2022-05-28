"use strict";

// Encapsulation: https://courses.cs.washington.edu/courses/cse154/codequalityguide/javascript/#module-pattern
(function() {
  const NAMES = ["Glenn", "Morgan"];
  const TIME_LIMIT_SAMPLE = 20;
  const TIME_LIMIT_STORY = 480;
  let personSpeaking = 0;
  let sampleStory = true;
  let timerStartAlready = false;
  let timerId = null;
  let timeOffset = 0;
  let storyElement = 0;
  let timeLimit = sampleStory ? TIME_LIMIT_SAMPLE : TIME_LIMIT_STORY;
  let gameEnded = false;
  window.addEventListener("load", init);

  function init() {
    document.getElementById("tutorial-button").addEventListener("click", function() {
      toggleInfoButton("tutorial-button", "intro", "Tutorial");
    });
    document.getElementById("info-button").addEventListener("click", function() {
      toggleInfoButton("info-button", "glenn", "Character Info");
      toggleInfoButton("info-button", "morgan", "Character Info");
    });
    document.getElementById("speak").addEventListener("click", addTextToStory);
    document.getElementById("start").addEventListener("click", startGame)
    document.querySelector("textarea").addEventListener("keydown", function(event) {
      if (event.key == "Enter" && !gameEnded) {
        addTextToStory();
      }
    });

    setGameClock();
  }

  function toggleInfoButton(buttonId, partId, partName) {
    let currPart = document.getElementById(partId);

    if (currPart.classList.contains("hidden")) {
      document.getElementById(buttonId).innerText = "Hide " + partName;
    } else {
      document.getElementById(buttonId).innerText = "Show " + partName;
    }

    document.getElementById(partId).classList.toggle("hidden");
  }


  function addTextToStory() {
    let story = sampleStory ? document.getElementById("sample-story") : document.getElementById("story");    
    let textInput = document.querySelector("textarea");
    textInput.value = textInput.value.trim();

    if (textInput.value.length > 0) {
      addParagraphToElement(story, NAMES[personSpeaking] + ": " + textInput.value, false);
      personSpeaking = (personSpeaking + 1) % 2;
      
      let speakerPart = document.getElementById("inputArea").children[0];
      speakerPart.innerText = NAMES[personSpeaking] + ": ";

      // scroll down from https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
      document.getElementById("speak").scrollIntoView();
    }

    textInput.value = "";

    if (!timerStartAlready) {
      timerStart();
      timerStartAlready = true;
    }
  }

  function startGame() {
    sampleStory = false;
    document.getElementById("start").classList.add("hidden");
    document.getElementById("sample-story").classList.add("hidden");
    document.getElementById("story").classList.remove("hidden");

    timerStartAlready = false;
    gameEnded = false;
    timeOffset = 0;
    timeLimit = sampleStory ? TIME_LIMIT_SAMPLE : TIME_LIMIT_STORY;
    clearLeftoverTimer();

    enableGameInput();
    setGameClock();

    document.querySelector("textarea").value = "";
    storyElement = 0;
  }

  // Adapted timer code from:
  // https://flaviocopes.com/javascript-timers/#setinterval
  function timerStart() {
    setGameClock();

    timerId = setInterval(() => {
      if (timeOffset >= timeLimit) {
        clearInterval(timerId);
        endGame();
        return;
      }

      timeOffset++;

      if (sampleStory) {
        sampleStoryEvents();
      } else {
        storyEvents();
      }

      setGameClock();
    }, 1000)
  }

  function setGameClock() {
    let timeString = "13:";
    let timeFromHourBeginning = 1200 + TIME_LIMIT_STORY - timeLimit + timeOffset;

    console.log(timeFromHourBeginning);
    timeString += makeTwoDigit("" + Math.floor(timeFromHourBeginning / 60));
    timeString += ":" + makeTwoDigit("" + (timeFromHourBeginning % 60));
    
    document.getElementById("clock").children[0].innerText = "Clock: " + timeString;
  }

  function endGame() {
    gameEnded = true;
    disableGameInput();
  }

  function disableGameInput() {
    document.getElementById("speak").setAttribute("disabled", "");
    document.querySelector("textarea").setAttribute("disabled", "");
  }

  function enableGameInput() {
    document.getElementById("speak").removeAttribute("disabled");
    document.querySelector("textarea").removeAttribute("disabled");
  }

  function makeTwoDigit(numStr) {
    if (numStr.length < 2) {
      console.log("0" + numStr);
      return "0" + numStr;
    } else {
      return numStr;
    }
  }

  function clearLeftoverTimer() {
    console.log("timerId = " + timerId);

    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function sampleStoryEvents() {
    let sampleEventsList = [
      "And then, a bird swooped down."
    ]
    let story = sampleStory ? document.getElementById("sample-story") : document.getElementById("story");
    if (storyElement == 0 && timeOffset > 9) {
      addParagraphToElement(story, sampleEventsList[storyElement], true);
      storyElement++;
    }
  }

  function storyEvents() {

  }

  function addParagraphToElement(element, text, enclosedInLineBreak) {
    let paragraph = document.createElement("p");
    paragraph.innerText = text;

    if (enclosedInLineBreak) {
      element.appendChild(document.createElement("br"))
    }

    element.appendChild(paragraph);
  
    if (enclosedInLineBreak) {
      element.appendChild(document.createElement("br"))
    }
  }
})();