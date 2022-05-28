"use strict";

// Encapsulation: https://courses.cs.washington.edu/courses/cse154/codequalityguide/javascript/#module-pattern
(function() {
  const NAMES = ["Glenn", "Morgan"];
  const TIME_LIMIT_SAMPLE = 20;
  const TIME_LIMIT_STORY = 600;

  const STORY_EVENTS = [
    {"time-mark": 23, "text": "It was rainier at the beginning of the day, but now the sun shines brightly."},
    {"time-mark": 76, "text": "\"SMACK!\" A bird just flew right into the window."},
    {"time-mark": 134, "text": "Someone waves at Glenn and walks away. Glenn waves back."},
    {"time-mark": 189, "text": "The background music now play Morgan's favorite song."},
    {"time-mark": 267, "text": "The door to the cafeteria blasted open. A group of people march through the door and walk passes Glenn and Morgan."},
    {"time-mark": 323, "text": "Two people in the cafeteria are having a loud row."},
    {"time-mark": 434, "text": "Morgan's phone suddenly rings up."},
    {"time-mark": 493, "text": "Someone dropped a plate with a loud \"CLANK!\""},
    {"time-mark": 546, "text": "Glenn would have to leave soon. Time to wrap up the conversations!"}
  ]

  const END_EVENTS = [
    "The time is up. Glenn walks away from Morgan, leaving Morgan alone at the table.",
    "If Glenn and Morgan have exchanged contacts, then they probably would be able to talk to each other again.",
    "If not, then this might be their last encounters with each other... yet.",
    "---",
    "We have reached the end of the story. Read the story from the start to see how it progressed.",
    "You may copy and paste the story somewhere to save it.",
    "THE END"
  ]
  let personSpeaking = 0;
  let sampleStory = true;
  let timerStartAlready = false;
  let timerId = null;
  let timeOffset = 0;
  let storyIndex = 0;
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
      addParagraphToElement(story, NAMES[personSpeaking] + ": " + textInput.value, false, false);
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
    personSpeaking = 0;
    clearLeftoverTimer();

    enableGameInput();
    setGameClock();

    document.querySelector("textarea").value = "";
    storyIndex = 0;
    document.getElementById("inputArea").children[0].innerText = "Glenn: ";
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

    timeString += makeTwoDigit("" + Math.floor(timeFromHourBeginning / 60));
    timeString += ":" + makeTwoDigit("" + (timeFromHourBeginning % 60));
    
    document.getElementById("clock").children[0].innerText = "Clock: " + timeString;
  }

  function endGame() {
    gameEnded = true;
    addTextToStory();
    disableGameInput();

    if (!sampleStory) {
      addParagraphToElement(document.getElementById("story"), END_EVENTS[0], true, false);

      for (let i = 1; i < END_EVENTS.length - 1; i++) {
        addParagraphToElement(document.getElementById("story"), END_EVENTS[i], false, false)
      }

      addParagraphToElement(document.getElementById("story"), END_EVENTS[END_EVENTS.length - 1], true, false);
    }
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
      return "0" + numStr;
    } else {
      return numStr;
    }
  }

  function clearLeftoverTimer() {
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
    if (storyIndex == 0 && timeOffset > 9) {
      addParagraphToElement(story, sampleEventsList[storyIndex], true, true);
      storyIndex++;
    }
  }

  function storyEvents() {
    if (storyIndex < STORY_EVENTS.length && STORY_EVENTS[storyIndex]["time-mark"] == timeOffset) {
      addParagraphToElement(story, STORY_EVENTS[storyIndex]["text"], true, true);
      storyIndex++;
    }
  }

  function addParagraphToElement(element, text, startWithLineBreak, endWithLineBreak) {
    let paragraph = document.createElement("p");
    paragraph.innerText = text;

    if (startWithLineBreak) {
      element.appendChild(document.createElement("br"))
    }

    element.appendChild(paragraph);
  
    if (endWithLineBreak) {
      element.appendChild(document.createElement("br"))
    }
  }
})();