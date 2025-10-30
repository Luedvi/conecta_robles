const surveys = [
  {
    id: 1,
    question: "¿Crees que deberíamos remodelar la banqueta principal?",
    author: "Administración",
    date: "29/10/2025",
    options: ["Sí", "No", "Tal vez"],
    votes: [0, 0, 0]
  },
  {
    id: 2,
    question: "¿Te gustaría recibir notificaciones por WhatsApp además de la app?",
    author: "Comité de Comunicación",
    date: "28/10/2025",
    options: ["Sí", "No"],
    votes: [0, 0]
  },
  {
    id: 3,
    question: "¿Qué prioridad le darías al mantenimiento de áreas verdes?",
    author: "Mantenimiento",
    date: "27/10/2025",
    options: ["Alta", "Media", "Baja"],
    votes: [0, 0, 0]
  }
];

const surveyList = document.getElementById("surveyList");

function renderSurveys() {
  if (!surveys.length) {
    surveyList.innerHTML = '<p class="empty-msg">No hay encuestas por el momento.</p>';
    return;
  }

  surveyList.innerHTML = "";

  surveys.forEach(survey => {
    const div = document.createElement("div");
    div.className = "survey-item";
    div.dataset.id = survey.id;

    const buttonsHTML = survey.options.map((opt, index) => {
      return `<button class="survey-button" data-index="${index}">${opt}</button>`;
    }).join("");

    div.innerHTML = `
      <p class="survey-question">${survey.question}</p>
      <p class="survey-meta">${survey.author} · ${survey.date}</p>
      <div class="survey-options">
        ${buttonsHTML}
      </div>
      <div class="results">
        ${renderResultsHTML(survey)}
      </div>
    `;

    surveyList.appendChild(div);
  });
}

function renderResultsHTML(survey) {
  const total = survey.votes.reduce((acc, v) => acc + v, 0);
  return survey.options.map((opt, index) => {
    const votes = survey.votes[index];
    const percent = total === 0 ? 0 : Math.round((votes / total) * 100);
    return `
      <div class="result-row">
        <span class="result-label">${opt}</span>
        <div class="result-bar">
          <div class="result-fill" style="width:${percent}%;"></div>
        </div>
        <span class="result-value">${percent}%</span>
      </div>
    `;
  }).join("");
}

surveyList.addEventListener("click", (e) => {
  if (!e.target.classList.contains("survey-button")) return;

  const btn = e.target;
  const surveyDiv = btn.closest(".survey-item");
  const surveyId = Number(surveyDiv.dataset.id);
  const optionIndex = Number(btn.dataset.index);

  const survey = surveys.find(s => s.id === surveyId);
  if (!survey) return;

  survey.votes[optionIndex] += 1;

  const buttons = surveyDiv.querySelectorAll(".survey-button");
  buttons.forEach(b => b.classList.remove("is-selected"));
  btn.classList.add("is-selected");

  const resultsDiv = surveyDiv.querySelector(".results");
  resultsDiv.innerHTML = renderResultsHTML(survey);
});

renderSurveys();
