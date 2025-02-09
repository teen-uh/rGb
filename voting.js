import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// 🔹 Replace with your Firebase project config
const firebaseConfig = {
  /* Your Firebase config */
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
