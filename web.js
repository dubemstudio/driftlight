const MOOD = {
  happy: [
    { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
    { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
    { text: "Smile, it’s free therapy.", author: "Douglas Horton" },
    { text: "Happiness depends upon ourselves.", author: "Aristotle" }
  ],
  sad: [
    { text: "Tears are words the heart can’t express.", author: "Unknown" },
    { text: "Sadness flies away on the wings of time.", author: "Jean de La Fontaine" },
    { text: "Every human walks around with a certain kind of sadness.", author: "Unknown" },
    { text: "The word 'happy' would lose its meaning if it were not balanced by sadness.", author: "Carl Jung" }
  ],
  lost: [
    { text: "Not all who wander are lost.", author: "J.R.R. Tolkien" },
    { text: "Sometimes you have to lose your way to find yourself.", author: "Unknown" },
    { text: "It’s okay to feel lost. That’s how we find new paths.", author: "Unknown" }
  ],
  grateful: [
    { text: "Gratitude turns what we have into enough.", author: "Aesop" },
    { text: "Be thankful for what you have; you'll end up having more.", author: "Oprah Winfrey" },
    { text: "Gratitude is the healthiest of all human emotions.", author: "Zig Ziglar" }
  ],
  anxious: [
    { text: "Feelings are just visitors. Let them come and go.", author: "Mooji" },
    { text: "You don’t have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
    { text: "Anxiety does not empty tomorrow of its sorrows, but only empties today of its strength.", author: "Charles Spurgeon" }
  ],
  excited: [
    { text: "Let your excitement lead the way.", author: "Unknown" },
    { text: "You’re one decision away from a totally different life.", author: "Mel Robbins" },
    { text: "Do more things that make you forget to check your phone.", author: "Unknown" }
  ],
  tired: [
    { text: "Rest. It’s part of the process.", author: "Unknown" },
    { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
    { text: "Take time to recharge. You can’t pour from an empty cup.", author: "Unknown" }
  ],
  overwhelmed: [
    { text: "Pause. Breathe. Reset.", author: "Unknown" },
    { text: "You don’t have to do it all today.", author: "Unknown" },
    { text: "One thing at a time. Progress, not perfection.", author: "Unknown" }
  ],
  lonely: [
    { text: "You are never alone. You are deeply connected to everyone.", author: "Amit Ray" },
    { text: "The best way to cheer yourself is to try to cheer someone else up.", author: "Mark Twain" },
    { text: "Loneliness expresses the pain of being alone. Solitude expresses the glory of being alone.", author: "Paul Tillich" }
  ],
  frustrated: [
    { text: "Great things take time; be patient.", author: "Unknown" },
    { text: "Frustration is the fuel that can lead to the development of an innovative and useful idea.", author: "Marilyn vos Savant" },
    { text: "Step back, breathe, and try again.", author: "Unknown" }
  ],
  depressed: [
    { text: "Even the darkest night will end and the sun will rise.", author: "Victor Hugo" },
    { text: "Your present circumstances don’t determine where you go, they merely determine where you start.", author: "Nido Qubein" },
    { text: "This too shall pass.", author: "Persian Proverb" }
  ]
};

let allQuotes = Object.values(MOOD).flat();

const $ = (id) => document.getElementById(id);
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

if ($("daily-quote")) {
  const today = new Date().getDate();
  const pick = allQuotes[today % allQuotes.length];
  $("daily-quote").textContent = `"${pick.text}"`;
  $("daily-author").textContent = `— ${pick.author}`;
}

const floatBtn = $("floating-inspiration");
if (floatBtn) {
  floatBtn.addEventListener("click", () => {
    const pick = random(allQuotes);
    alert(`"${pick.text}"\n— ${pick.author}`);
  });
}

const upliftSelect = $("mood-select") || $("mood");
const upliftBtn = $("uplift-btn") || document.querySelector("#mood-form button");
const qText = $("quote-text");
const qAuthor = $("quote-author");

if (upliftBtn && upliftSelect && qText && qAuthor) {
  upliftBtn.addEventListener("click", () => {
    const key = upliftSelect.value.trim().toLowerCase();
    if (!key) {
      qText.textContent = "Please choose a mood first.";
      qAuthor.textContent = "";
      return;
    }
    const bucket = MOOD[key];
    if (!bucket) {
      qText.textContent = "No quotes for that mood yet.";
      qAuthor.textContent = "";
      return;
    }
    const pick = random(bucket);
    qText.textContent = `"${pick.text}"`;
    qAuthor.textContent = `— ${pick.author}`;
  });

  const listenBtn = $("listen");
  if (listenBtn) {
    listenBtn.addEventListener("click", () => {
      if (!qText.textContent) return;
      const utter = new SpeechSynthesisUtterance(`${qText.textContent} ${qAuthor.textContent}`);
      speechSynthesis.speak(utter);
    });
  }

  const saveBtn = $("save");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
      const item = {
        text: qText.textContent.replace(/(^"|"$)/g, ""),
        author: qAuthor.textContent.replace("— ", "")
      };
      if (!item.text) return;
      favs.push(item);
      localStorage.setItem("favorites", JSON.stringify(favs));
      alert("⭐ Quote saved to favorites!");
    });
  }
}

const emailForm = $("email-form");
const emailInput = $("email-input");
const feedback = $("form-feedback");

if (emailForm && emailInput && feedback) {
  emailForm.addEventListener("submit", e => {
    e.preventDefault();
    feedback.textContent = "✅ Subscribed! Look for a quote tomorrow.";
    emailInput.value = "";
  });
}

const favList = $("favorites-list");
if (favList) {
  const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  if (favs.length === 0) {
    favList.innerHTML = "<p>You have no favorite quotes yet.</p>";
  } else {
    favList.innerHTML = favs.map(q =>
      `<div class="quote-board" style="margin-top:15px">
        <p>"${q.text}"</p>
        <span>— ${q.author}</span>
      </div>`
    ).join("");
  }
}

const searchForm = $("search-form");
const searchInput = $("search-input");
const searchResults = $("search-results");

if (searchForm && searchInput && searchResults) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
      searchResults.innerHTML = "<p>Please type a keyword.</p>";
      return;
    }
    const matches = allQuotes.filter(q =>
      q.text.toLowerCase().includes(query) || q.author.toLowerCase().includes(query)
    );
    if (matches.length === 0) {
      searchResults.innerHTML = "<p>No quotes found.</p>";
    } else {
      searchResults.innerHTML = matches.map(q =>
        `<div class="quote-board" style="margin-top:15px">
           <p>"${q.text}"</p><span>— ${q.author}</span>
         </div>`
      ).join("");
    }
  });
}

const submitForm = $("submit-quote-form");
if (submitForm) {
  submitForm.addEventListener("submit", e => {
    e.preventDefault();
    const text = submitForm.querySelector("textarea").value.trim();
    const author = submitForm.querySelector("input").value.trim() || "Unknown";
    if (!text) return alert("Please write a quote before submitting.");
    allQuotes.push({ text, author });
    alert("✅ Quote submitted! Thank you.");
    submitForm.reset();
  });
}

const suggestionForm = $("suggestion-form");
const suggestionFeedback = $("suggestion-feedback");

if (suggestionForm && suggestionFeedback) {
  suggestionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    suggestionFeedback.textContent = "✅ Thank you for your feedback!";
    suggestionForm.reset();
  });
}
