import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// 🔹 Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyDwYha38dL1SXyHFBfic9_iWYVQZcdKS5o",
  authDomain: "zapathon-rgb-82ea6.firebaseapp.com",
  projectId: "zapathon-rgb-82ea6",
  storageBucket: "zapathon-rgb-82ea6.firebasestorage.app",
  messagingSenderId: "225660139551",
  appId: "1:225660139551:web:f0d2462477d7c68bbc3d2a",
};
const db = getDatabase();

const choiceButtons = document.querySelectorAll(".choice-btn");

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const choice = button.getAttribute("data-choice");
    submitVote(choice);
  });
});

function submitVote(choice) {
  const voteRef = ref(db, `votes/round1/${choice}`);

  get(voteRef).then((snapshot) => {
    let currentVotes = snapshot.exists() ? snapshot.val() : 0;
    set(voteRef, currentVotes + 1);
  });
}
