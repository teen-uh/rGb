// Updated script.js for synchronized video playback and voting

// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
// import {
//   getDatabase,
//   ref,
//   set,
//   get,
//   onValue,
//   runTransaction,
//   update,
// } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// document.addEventListener("DOMContentLoaded", function () {
//   const firebaseConfig = {
//     apiKey: "AIzaSyDwYha38dL1SXyHFBfic9_iWYVQZcdKS5o",
//     authDomain: "zapathon-rgb-82ea6.firebaseapp.com",
//     projectId: "zapathon-rgb-82ea6",
//     storageBucket: "zapathon-rgb-82ea6.firebasestorage.app",
//     messagingSenderId: "225660139551",
//     appId: "1:225660139551:web:f0d2462477d7c68bbc3d2a",
//   };

//   const app = initializeApp(firebaseConfig);
//   const db = getDatabase(app);

//   let video = document.getElementById("videoPlayer");
//   let choicesDiv = document.getElementById("choices");
//   let choiceButtons = document.querySelectorAll(".choice-btn");
//   let timeLeftSpan = document.getElementById("timeLeft");
//   let countdownDiv = document.getElementById("countdownTimer");

//   let round = 1;

//   let choicesList = {
//     1: ["Gummy", "Bong", "Joint"],
//     2: ["Spam", "Doritos", "Strawberries"],
//     3: ["Turtle", "TV", "Cloud"],
//   };

//   // Sync video state
//   const videoStateRef = ref(db, "videoState");

//   video.addEventListener("play", () => {
//     update(videoStateRef, { playing: true, currentTime: video.currentTime });
//   });

//   video.addEventListener("pause", () => {
//     update(videoStateRef, { playing: false, currentTime: video.currentTime });
//   });

//   video.addEventListener("timeupdate", () => {
//     update(videoStateRef, { currentTime: video.currentTime });
//   });

//   onValue(videoStateRef, (snapshot) => {
//     const state = snapshot.val();
//     if (state) {
//       if (Math.abs(video.currentTime - state.currentTime) > 1) {
//         video.currentTime = state.currentTime;
//       }
//       if (state.playing && video.paused) video.play();
//       if (!state.playing && !video.paused) video.pause();
//     }
//   });

//   // Voting logic
//   video.addEventListener("ended", () => {
//     if (round <= 3) {
//       updateChoices(round);
//       choicesDiv.classList.remove("hidden");
//       startVotingTimer(round);
//     }
//   });

//   function updateChoices(round) {
//     choiceButtons.forEach((button, index) => {
//       let choice = choicesList[round][index];
//       button.innerText = choice;
//       button.setAttribute("data-choice", choice);
//     });
//   }

//   choiceButtons.forEach((button) => {
//     button.addEventListener("click", () => {
//       let choice = button.getAttribute("data-choice");
//       submitVote(round, choice);
//       choicesDiv.classList.add("hidden");
//     });
//   });

//   function submitVote(round, choice) {
//     let voteRef = ref(db, `votes/round${round}/${choice}`);
//     runTransaction(voteRef, (currentVotes) => {
//       return (currentVotes || 0) + 1;
//     });
//   }

//   function startVotingTimer(round) {
//     countdownDiv.classList.remove("hidden");
//     let timeLeft = 17;
//     timeLeftSpan.innerText = timeLeft;

//     let countdownInterval = setInterval(() => {
//       timeLeft--;
//       timeLeftSpan.innerText = timeLeft;

//       if (timeLeft <= 0) {
//         clearInterval(countdownInterval);
//         checkVotes(round);
//       }
//     }, 1000);
//   }

//   function checkVotes(round) {
//     let roundRef = ref(db, `votes/round${round}`);
//     onValue(
//       roundRef,
//       (snapshot) => {
//         let votes = snapshot.val();
//         if (!votes) return;

//         let winningChoice = Object.keys(votes).reduce((a, b) =>
//           votes[a] > votes[b] ? a : b
//         );

//         playNextVideo(round, winningChoice);
//       },
//       { onlyOnce: true }
//     );
//   }

//   function playNextVideo(round, choice) {
//     video.removeAttribute("controls");
//     let videoFile = `videos/round${round}_choice${choice}.mp4`;
//     update(videoStateRef, {
//       videoSrc: videoFile,
//       playing: true,
//       currentTime: 0,
//     });
//     round++;
//   }
// });

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", function () {
  const firebaseConfig = {
    apiKey: "AIzaSyDwYha38dL1SXyHFBfic9_iWYVQZcdKS5o",
    authDomain: "zapathon-rgb-82ea6.firebaseapp.com",
    projectId: "zapathon-rgb-82ea6",
    storageBucket: "zapathon-rgb-82ea6.firebasestorage.app",
    messagingSenderId: "225660139551",
    appId: "1:225660139551:web:f0d2462477d7c68bbc3d2a",
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  let video = document.getElementById("videoPlayer");
  let choicesDiv = document.getElementById("choices");
  let choiceButtons = document.querySelectorAll(".choice-btn");
  let timeLeftSpan = document.getElementById("timeLeft");
  let countdownDiv = document.getElementById("countdownTimer");

  let round = 1;

  let choicesList = {
    1: ["Gummy", "Bong", "Joint"],
    2: ["Spam", "Doritos", "Strawberries"],
    3: ["Turtle", "TV", "Cloud"],
  };

  video.addEventListener("ended", () => {
    if (round <= 3) {
      updateChoices(round);
      choicesDiv.classList.remove("hidden");
      startVotingTimer(round);
    }
    console.log("video ended");
  });

  function updateChoices(round) {
    choiceButtons.forEach((button, index) => {
      let choice = choicesList[round][index];
      button.innerText = choice;
      button.setAttribute("data-choice", choice);
    });
  }

  choiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      let choice = button.getAttribute("data-choice");
      submitVote(round, choice);
      choicesDiv.classList.add("hidden");
    });
  });

  function submitVote(round, choice) {
    let voteRef = ref(db, `votes/round${round}/${choice}`);
    runTransaction(voteRef, (currentVotes) => {
      return (currentVotes || 0) + 1; // Ensures correct counting
    })
      .then(() => {
        console.log(`Vote registered for choice ${choice} in round ${round}`);
      })
      .catch((error) => {
        console.error("Transaction failed: ", error);
      });
  }

  function startVotingTimer(round) {
    countdownDiv.classList.remove("hidden");

    let timeLeft = 17;
    timeLeftSpan.innerText = timeLeft;

    let countdownInterval = setInterval(() => {
      timeLeft--;
      timeLeftSpan.innerText = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        countdownDiv.classList.add("hidden");
        checkVotes(round);
      }
    }, 1000);
  }

  function checkVotes(round) {
    let roundRef = ref(db, `votes/round${round}`);

    onValue(
      roundRef,
      (snapshot) => {
        let votes = snapshot.val();
        if (!votes) return;

        let winningChoice = Object.keys(votes).reduce((a, b) =>
          votes[a] > votes[b] ? a : b
        );

        playNextVideo(round, winningChoice);
      },
      { onlyOnce: true }
    );
  }

  function playNextVideo(round, choice) {
    video.removeAttribute("controls");
    let videoFile = `videos/round${round}_choice${choice}.mp4`;
    video.src = videoFile;
    video.load();
    video.play();
    round++;
  }
});
