// Algerian Forest Trees Data
const TREE_DATA = [
  { id: "pin-aleph", common_fr: "Pin d’Alep", scientific: "Pinus halepensis", image: "images/pindalep.jpg" },
  { id: "pin-maritime", common_fr: "Pin maritime", scientific: "Pinus pinaster", image: "images/pinmaritime.jpg" },
  { id: "pin-salzmann", common_fr: "Pin noir de Salzmann", scientific: "Pinus nigra subsp. salzmannii", image: "images/pinsalzmann.jpg" },
  { id: "cedre-atlas", common_fr: "Cèdre de l’Atlas", scientific: "Cedrus atlantica", image: "images/cedredatlas.jpg" },
  { id: "sapin-numidie", common_fr: "Sapin de Numidie", scientific: "Abies numidica", image: "images/sapinnumidie.jpg" },
  { id: "thuya-berberie", common_fr: "Thuya de Berbérie", scientific: "Tetraclinis articulata", image: "images/thuyaberberie.jpg" },
  { id: "genevrier-oxycedre", common_fr: "Genévrier oxycèdre", scientific: "Juniperus oxycedrus", image: "images/genevrieroxycedre.jpg" },
  { id: "genevrier-phenicie", common_fr: "Genévrier de Phénicie", scientific: "Juniperus phoenicea", image: "images/genevrierphenicie.jpg" },
  { id: "chene-liege", common_fr: "Chêne-liège", scientific: "Quercus suber", image: "images/cheneliege.jpg" },
  { id: "chene-vert", common_fr: "Chêne vert", scientific: "Quercus ilex", image: "images/chenevert.jpg" },
  { id: "chene-zeen", common_fr: "Chêne zéen", scientific: "Quercus canariensis", image: "images/chenezeen.jpg" },
  { id: "chene-afares", common_fr: "Chêne afares", scientific: "Quercus afares", image: "images/cheneafares.jpg" },
  { id: "chene-kermes", common_fr: "Chêne kermès", scientific: "Quercus coccifera", image: "images/chenekermes.jpg" },
  { id: "olivier-sauvage", common_fr: "Olivier sauvage", scientific: "Olea europaea var. sylvestris", image: "images/oliviersauvage.jpg" },
  { id: "caroubier", common_fr: "Caroubier", scientific: "Ceratonia siliqua", image: "images/caroubier.jpg" },
  { id: "micocoulier", common_fr: "Micocoulier", scientific: "Celtis australis", image: "images/micocoulier.jpg" },
  { id: "erable-montpellier", common_fr: "Érable de Montpellier", scientific: "Acer monspessulanum", image: "images/erablemontpellier.jpg" },
  { id: "frene-oxyphylle", common_fr: "Frêne oxyphylle", scientific: "Fraxinus angustifolia", image: "images/freneoxyphylle.jpg" },
  { id: "figuier", common_fr: "Figuier", scientific: "Ficus carica", image: "images/figuier.jpg" },
  { id: "palmier-dattier", common_fr: "Palmier dattier", scientific: "Phoenix dactylifera", image: "images/palmierdattier.jpg" }
];

// ----------- Utility Functions -----------

// Shuffle an array in place using Fisher–Yates
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Pick N random distinct elements from array, excluding any whose id is in excludeIds
function pickRandomDistinct(array, count, excludeIds = []) {
  const filtered = array.filter(item => !excludeIds.includes(item.id));
  return shuffle(filtered).slice(0, count);
}

// ----------- Question Builders -----------

// Build a question object for text mode
function buildTextQuestion(treeData) {
  // Randomly pick a question type
  const types = ["common_to_scientific", "scientific_to_common", "fact"];
  const type = types[Math.floor(Math.random() * types.length)];
  let questionText, correctAnswer, options;

  if (type === "common_to_scientific") {
    questionText = `Quel est le nom scientifique de ‘${treeData.common_fr}’ ?`;
    correctAnswer = treeData.scientific;
    // Distractors: other scientific names
    const distractors = pickRandomDistinct(TREE_DATA, 2, [treeData.id]).map(t => t.scientific);
    options = shuffle([correctAnswer, ...distractors]);
  } else if (type === "scientific_to_common") {
    questionText = `Quel est le nom commun  de ‘${treeData.scientific}’ ?`;
    correctAnswer = treeData.common_fr;
    // Distractors: other French common names
    const distractors = pickRandomDistinct(TREE_DATA, 2, [treeData.id]).map(t => t.common_fr);
    options = shuffle([correctAnswer, ...distractors]);
  } else if (type === "fact") {
    // A few hardcoded fact questions; more can be added here
    const factTemplates = [
      {
        match: t => t.id === "chene-liege",
        q: "Quel arbre produit du liège ?",
        getCorrect: t => t.common_fr,
        getDistractors: arr => arr.filter(x => x.id !== "chene-liege").map(x => x.common_fr)
      },
      {
        match: t => t.id === "caroubier",
        q: "Quel arbre est cultivé en Algérie pour ses gousses sucrées utilisées en alimentation ?",
        getCorrect: t => t.common_fr,
        getDistractors: arr => arr.filter(x => x.id !== "caroubier").map(x => x.common_fr)
      },
      {
        match: t => t.id === "palmier-dattier",
        q: "Quel arbre est emblématique des oasis du Sahara algérien ?",
        getCorrect: t => t.common_fr,
        getDistractors: arr => arr.filter(x => x.id !== "palmier-dattier").map(x => x.common_fr)
      },
      {
        match: t => t.id === "cedre-atlas",
        q: "Quel arbre est connu pour ses forêts majestueuses en Kabylie et Aurès ?",
        getCorrect: t => t.common_fr,
        getDistractors: arr => arr.filter(x => x.id !== "cedre-atlas").map(x => x.common_fr)
      }
    ];
    // Try to pick a fact template for this tree, else default to scientific name
    const fact = factTemplates.find(f => f.match(treeData));
    if (fact) {
      questionText = fact.q;
      correctAnswer = fact.getCorrect(treeData);
      const distractors = shuffle(fact.getDistractors(TREE_DATA)).slice(0, 2);
      options = shuffle([correctAnswer, ...distractors]);
    } else {
      // fallback
      questionText = `Quel est le nom scientifique de ‘${treeData.common_fr}’ ?`;
      correctAnswer = treeData.scientific;
      const distractors = pickRandomDistinct(TREE_DATA, 2, [treeData.id]).map(t => t.scientific);
      options = shuffle([correctAnswer, ...distractors]);
    }
  }
  return {
    type: "text",
    tree: treeData,
    question: questionText,
    options: options,
    answer: correctAnswer
  };
}

// Build a question object for picture mode
function buildPictureQuestion(treeData) {
  // For each round, randomly choose to ask for common name or scientific name
  const askType = Math.random() < 0.5 ? "common_fr" : "scientific";
  const correctAnswer = treeData[askType];
  // Distractors: other trees' same property
  const distractors = pickRandomDistinct(TREE_DATA, 2, [treeData.id]).map(t => t[askType]);
  const options = shuffle([correctAnswer, ...distractors]);
  return {
    type: "picture",
    tree: treeData,
    question: askType === "common_fr"
      ? "Quel est le nom commun (FR) de cet arbre ?"
      : "Quel est le nom scientifique de cet arbre ?",
    image: treeData.image,
    options: options,
    answer: correctAnswer
  };
}

// ----------- UI Rendering Helpers -----------

// Render Home View
function renderHome() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  const container = document.createElement("div");
  container.className = "quiz-home";

  const title = document.createElement("h2");
  title.textContent = "Quiz des Arbres d’Algérie";
  container.appendChild(title);

  const desc = document.createElement("p");
  desc.textContent = "Testez vos connaissances sur les arbres forestiers emblématiques d’Algérie. Choisissez un mode de quiz pour commencer.";
  container.appendChild(desc);

  const btnGroup = document.createElement("div");
  btnGroup.style.display = "flex";
  btnGroup.style.gap = "1.5rem";
  btnGroup.style.justifyContent = "center";

  const qBtn = document.createElement("button");
  qBtn.textContent = "📖 Questions Quiz";
  qBtn.onclick = () => startQuiz("text");
  btnGroup.appendChild(qBtn);

  const pBtn = document.createElement("button");
  pBtn.textContent = "🌳 Pictures Quiz";
  pBtn.onclick = () => startQuiz("picture");
  btnGroup.appendChild(pBtn);

  container.appendChild(btnGroup);
  app.appendChild(container);
}

// Render Quiz Question
function renderQuestion(qObj, qIndex, total, score, answeredIdx, correctIdx, nextCallback) {
  const app = document.getElementById("app");
  app.innerHTML = "";
  const container = document.createElement("div");
  container.className = "quiz-question";
  container.style.maxWidth = "430px";
  container.style.margin = "40px auto";
  container.style.padding = "2rem";
  container.style.borderRadius = "1rem";
  container.style.background = "#f6f3ea";
  container.style.boxShadow = "0 2px 12px #d3c8a8";

  // Progress
  const progress = document.createElement("div");
  progress.textContent = `Question ${qIndex + 1} / ${total} · Score: ${score}`;
  progress.style.marginBottom = "14px";
  progress.style.fontWeight = "bold";
  container.appendChild(progress);

  // Image for picture mode
  if (qObj.type === "picture") {
    const img = document.createElement("img");
    img.src = qObj.image;
    img.alt = qObj.tree.common_fr;
    img.style.width = "260px";
    img.style.height = "160px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "0.7rem";
    img.style.display = "block";
    img.style.margin = "0 auto 1rem auto";
    img.onerror = () => { img.src = "https://via.placeholder.com/260x160?text=Image"; };
    container.appendChild(img);
  }

  // Question text
  const qText = document.createElement("div");
  qText.textContent = qObj.question;
  qText.style.fontSize = "1.2rem";
  qText.style.marginBottom = "1.2rem";
  container.appendChild(qText);

  // Answer buttons
  const btnsDiv = document.createElement("div");
  btnsDiv.style.display = "flex";
  btnsDiv.style.flexDirection = "column";
  btnsDiv.style.gap = "0.7rem";
  qObj.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.disabled = answeredIdx !== null;
    btn.style.padding = "0.9rem 1.2rem";
    btn.style.fontSize = "1rem";
    btn.style.borderRadius = "0.7rem";
    btn.style.border = "none";
    btn.style.cursor = btn.disabled ? "default" : "pointer";
    // Highlight states
    if (answeredIdx !== null) {
      if (i === correctIdx) btn.style.background = "#b7e6ba";
      if (i === answeredIdx && answeredIdx !== correctIdx) btn.style.background = "#e6b7b7";
    } else {
      btn.style.background = "#e1e9db";
    }
    btn.onclick = () => nextCallback(i);
    btnsDiv.appendChild(btn);
  });
  container.appendChild(btnsDiv);

  // Feedback + Next button
  if (answeredIdx !== null) {
    const feedback = document.createElement("div");
    feedback.style.margin = "1.2rem 0 0.4rem 0";
    feedback.style.fontWeight = "bold";
    feedback.textContent = answeredIdx === correctIdx
      ? "Bravo ! Bonne réponse."
      : `Réponse incorrecte. La bonne réponse était : ${qObj.options[correctIdx]}`;
    container.appendChild(feedback);

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Suivant";
    nextBtn.style.marginTop = "1rem";
    nextBtn.style.padding = "0.8rem 1.3rem";
    nextBtn.style.borderRadius = "0.7rem";
    nextBtn.onclick = nextCallback.bind(null, null); // Pass null to continue
    container.appendChild(nextBtn);
  }
  app.appendChild(container);
}

// Render Quiz Results
function renderResults(mode, score, total, replayCallback, homeCallback) {
  const app = document.getElementById("app");
  app.innerHTML = "";
  const container = document.createElement("div");
  container.className = "quiz-result";
  container.style.maxWidth = "430px";
  container.style.margin = "50px auto";
  container.style.padding = "2.2rem";
  container.style.borderRadius = "1rem";
  container.style.background = "#f6f3ea";
  container.style.boxShadow = "0 2px 12px #d3c8a8";
  container.style.textAlign = "center";

  const scoreDiv = document.createElement("div");
  scoreDiv.textContent = `Votre score : ${score} / ${total}`;
  scoreDiv.style.fontSize = "1.5rem";
  scoreDiv.style.marginBottom = "1.2rem";
  scoreDiv.style.color = score === total ? "#2a6f2a" : "#4a3f2c";
  container.appendChild(scoreDiv);

  const replayBtn = document.createElement("button");
  replayBtn.textContent = "Rejouer ce mode";
  replayBtn.style.margin = "0.5rem 1rem";
  replayBtn.style.padding = "1rem 1.7rem";
  replayBtn.style.borderRadius = "0.8rem";
  replayBtn.onclick = replayCallback;
  container.appendChild(replayBtn);

  const homeBtn = document.createElement("button");
  homeBtn.textContent = "Accueil";
  homeBtn.style.margin = "0.5rem 1rem";
  homeBtn.style.padding = "1rem 1.7rem";
  homeBtn.style.borderRadius = "0.8rem";
  homeBtn.onclick = homeCallback;
  container.appendChild(homeBtn);

  app.appendChild(container);
}

// ----------- Game Controller -----------

function startQuiz(mode) {
  // Prepare randomized questions for this round
  const treesForRound = shuffle(TREE_DATA).slice(0, 5);
  let questions;
  if (mode === "text") {
    questions = treesForRound.map(t => buildTextQuestion(t));
  } else if (mode === "picture") {
    questions = treesForRound.map(t => buildPictureQuestion(t));
  }
  questions = shuffle(questions);

  let currentIdx = 0;
  let score = 0;
  let answeredIdx = null;
  let correctIdx = null;

  function handleAnswer(idx) {
    if (idx === null) { // Next question
      answeredIdx = null;
      correctIdx = null;
      currentIdx++;
      if (currentIdx < questions.length) {
        renderCurrentQuestion();
      } else {
        renderResults(
          mode,
          score,
          questions.length,
          () => startQuiz(mode),
          renderHome
        );
      }
      return;
    }
    answeredIdx = idx;
    correctIdx = questions[currentIdx].options.indexOf(questions[currentIdx].answer);
    if (answeredIdx === correctIdx) score++;
    renderCurrentQuestion();
  }

  function renderCurrentQuestion() {
    renderQuestion(
      questions[currentIdx],
      currentIdx,
      questions.length,
      score,
      answeredIdx,
      correctIdx,
      handleAnswer
    );
  }

  renderCurrentQuestion();
}

// ----------- Initial Mount -----------

document.addEventListener("DOMContentLoaded", renderHome);