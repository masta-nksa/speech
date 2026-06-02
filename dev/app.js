// ============================================================
// speech – Englisches Vokabel-Lernprogramm
// ============================================================

let data = [];
let selectedLessons = [];
let currentDataset = [];
let currentIndex = 0;
let correctAnswersCount = 0;
let wrongAnswersCount = 0;
let attemptCount = 0;

// ============================================================
// Avenger-Gamification
// ============================================================
const avengerImages = {
    "Iron Man": "./img/ironman.gif",
    "Captain America": "./img/captainamerica.gif",
    "Thor": "./img/thor.gif",
    "Hulk": "./img/hulk.gif",
    "Black Widow": "./img/blackwidow.gif",
    "Scarlet Witch": "./img/scarletwitch.gif"
};

let currentBlur = 0;
const maxBlur = 40;
const steps = 20;
const blurStep = maxBlur / steps;

function displayAvenger() {
    const avengerSelect = document.getElementById('avengerSelect');
    const avengerImage = document.getElementById('avengerImage');
    const avengerName = document.getElementById('avengerName');

    const selectedAvenger = avengerSelect.value;

    if (selectedAvenger) {
        avengerImage.src = avengerImages[selectedAvenger];
        avengerImage.alt = selectedAvenger;
        avengerImage.style.display = "block";
        blurInit(50);
    } else {
        avengerImage.style.display = "none";
        avengerName.innerText = '';
    }
}

function blurInit(startBlur) {
    currentBlur = Math.min(startBlur, maxBlur);
    avengerImage.style.filter = `blur(${currentBlur}px)`;
}

function increaseBlur() {
    currentBlur += blurStep;
    avengerImage.style.filter = `blur(${currentBlur}px)`;
}

function decreaseBlur() {
    if (currentBlur > 0) {
        currentBlur -= blurStep;
        avengerImage.style.filter = `blur(${currentBlur}px)`;
    } else {
        avengerImage.style.filter = "none";
    }
}

// ============================================================
// CSV-Handling
// ============================================================
function loadDefaultCSV() {
    fetch("lessons.csv")
        .then(response => {
            if (!response.ok) throw new Error("Standard-CSV-Datei konnte nicht geladen werden.");
            return response.text();
        })
        .then(text => {
            data = parseCSV(text);
            showLessonSelection();
        })
        .catch(error => {
            console.error(error.message);
            alert("Fehler beim Laden der Vokabeln: " + error.message);
        });
}

function loadCSVFile(event) {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];
    const reader = new FileReader();

    if (!file) {
        alert('Bitte wähle eine CSV-Datei aus.');
        return;
    }

    reader.onload = (e) => {
        data = parseCSV(e.target.result);
        showLessonSelection();
    };

    reader.readAsText(file);
}

function parseCSV(text) {
    return text.trim().split('\n')
        .filter(row => row.trim() !== '')           // Leere Zeilen ignorieren
        .slice(1)                                   // Header-Zeile überspringen
        .map(row => {
            const cols = row.split(';');
            return {
                Lesson: cols[0].trim(),
                English: cols[1].trim(),
                Deutsch: cols[2].trim()
            };
        });
}

// ============================================================
// Lesson Selection
// ============================================================
function chooseLessons() {
    const name = document.getElementById("nameInput").value.trim();
    if (name) {                                     // Fix: if (true) → if (name)
        document.getElementById("login-screen").classList.add("hidden");
        document.getElementById("welcome-screen").classList.remove("hidden");
        document.getElementById("welcomeMessage").innerText = `Hello ${name}, let's learn some English words!`;
        loadDefaultCSV();
    } else {
        alert("Please enter a name.");
    }
}

function showLessonSelection() {
    document.getElementById('lesson-selection-section').classList.remove('hidden');
    const lessons = [...new Set(data.map(item => item.Lesson))];
    displayLessonSelection(lessons);
}

function displayLessonSelection(lessons) {
    const lessonSelectionDiv = document.getElementById('lesson-selection');
    // String-Builder statt innerHTML += in Schleife (Performance)
    let html = '';
    lessons.forEach(lesson => {
        html += `
            <input type="checkbox" value="${lesson}" id="${lesson}">
            <label for="${lesson}">${lesson}</label><br>
        `;
    });
    lessonSelectionDiv.innerHTML = html;
}

// ============================================================
// Print-Funktion (CSS @media print statt body.innerHTML-Klon)
// ============================================================
function openTableInNewWindow() {
    const selectedLessons = Array.from(document.querySelectorAll('#lesson-selection input:checked'))
        .map(checkbox => checkbox.value);
    const selectedData = data.filter(item => selectedLessons.includes(item.Lesson));

    if (selectedData.length === 0) {
        alert("Bitte wähle mindestens eine Lektion aus, um die Tabelle anzuzeigen.");
        return;
    }

    // Fix: korrekter Radio-Button-Name 'print_option'
    const selectedOption = document.querySelector('input[name="print_option"]:checked');

    openPopup(selectedData);
}

function openPopup(selectedData) {
    const tbody = document.getElementById('popupTableBody');
    tbody.innerHTML = '';

    const checkedRadio = document.querySelector('input[name="print_option"]:checked');
    const printOption = checkedRadio ? checkedRadio.value : 'all';

    selectedData.forEach(row => {
        const tr = document.createElement('tr');

        if (printOption === 'all') {
            tr.innerHTML = `
                <td>${row.English}</td>
                <td>${row.Deutsch}</td>
            `;
        } else if (printOption === 'de') {
            tr.innerHTML = `
                <td>${row.Deutsch}</td>
                <td width="70%"></td>
            `;
        } else if (printOption === 'en') {
            tr.innerHTML = `
                <td>${row.English}</td>
                <td width="70%"></td>
            `;
        }

        tbody.appendChild(tr);
    });

    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popup').style.display = 'block';
}

function randomizeTable() {
    const tableBody = document.getElementById('popupTableBody');
    const rows = Array.from(tableBody.rows);
    // Fisher-Yates-Shuffle
    for (let i = rows.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        tableBody.appendChild(rows[j]);
    }
}

function printTable() {
    // Nutze @media print CSS statt body.innerHTML zu ersetzen
    const printContent = document.getElementById('popupTableBody').innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html>
        <head>
            <title>Vokabeln drucken</title>
            <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h2>Selected Vocabulary</h2>
            <table>
                <thead>
                    <tr>
                        <th>English</th>
                        <th>Deutsch</th>
                    </tr>
                </thead>
                <tbody>
                    ${printContent}
                </tbody>
            </table>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}

function closePopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('popup').style.display = 'none';
}

// ============================================================
// Quiz-Modi
// ============================================================
function startLearning() {
    hideHeaderText();
    setupQuiz('learning-section');
}

function startQuiz() {
    hideHeaderText();
    setupQuiz('quiz-section');
}

function startWriting() {
    hideHeaderText();
    setupQuiz('writing-section');
}

function hideHeaderText() {
    document.getElementById('headerText').classList.add('hidden');
}

function setupQuiz(section) {
    selectedLessons = Array.from(document.querySelectorAll('#lesson-selection input:checked'))
        .map(checkbox => checkbox.value);
    currentDataset = data.filter(item => selectedLessons.includes(item.Lesson));

    if (currentDataset.length > 0) {
        document.getElementById('lesson-selection-section').classList.add('hidden');
        document.getElementById(section).classList.remove('hidden');
        currentIndex = 0;
        correctAnswersCount = 0;
        wrongAnswersCount = 0;

        if (section === 'quiz-section') {
            showNextWord();
        } else if (section === 'learning-section') {
            showNextLearningWord();
        } else if (section === 'writing-section') {
            showNextWritingWord();
        }
    } else {
        alert('Bitte wähle mindestens eine Lektion aus.');
    }
}

function showNextWord() {
    if (currentIndex >= currentDataset.length) {
        alert(`Quiz beendet! Richtig: ${correctAnswersCount}, Falsch: ${wrongAnswersCount}`);
        return;
    }

    const currentWord = currentDataset[currentIndex];
    document.getElementById('word-display').innerText = currentWord.English;
    speakText(currentWord.English);

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    const allOptions = shuffleArray([currentWord.Deutsch, ...getRandomWrongAnswers(currentWord.Deutsch)]);
    allOptions.forEach(option => createOptionButton(option, currentWord.Deutsch, optionsDiv));

    updateScoreboard();
}

function createOptionButton(option, correctAnswer, optionsDiv) {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.innerText = option;
    btn.onclick = () => {
        if (option === correctAnswer) {
            correctAnswersCount++;
            decreaseBlur();
        } else {
            wrongAnswersCount++;
            increaseBlur();
            increaseBlur();
            increaseBlur();
        }
        currentIndex++;
        updateScoreboard();
        showNextWord();
    };
    optionsDiv.appendChild(btn);
}

function getRandomWrongAnswers(correctAnswer) {
    const wrongAnswers = data.filter(item => item.Deutsch !== correctAnswer).map(item => item.Deutsch);
    return shuffleArray(wrongAnswers).slice(0, 3);
}

function showNextLearningWord() {
    if (currentIndex >= currentDataset.length) {
        alert(`Lernen beendet! Richtig: ${correctAnswersCount}, Falsch: ${wrongAnswersCount}`);
        return;
    }

    const currentWord = currentDataset[currentIndex];
    const germanWordDisplay = document.getElementById('german-word-display');
    germanWordDisplay.innerText = currentWord.Deutsch;

    const correctAnswer = currentWord.English;
    const variations = generateVariations(correctAnswer);

    const optionsDiv = document.getElementById('learning-options');
    optionsDiv.innerHTML = '';

    const allOptions = [correctAnswer, ...variations];
    shuffleArray(allOptions);

    allOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerText = option;
        btn.onclick = function () {
            speakText(option);
            if (option === correctAnswer) {
                currentIndex++;
                correctAnswersCount++;
                decreaseBlur();
                updateScoreboard();
                showNextLearningWord();
            } else {
                wrongAnswersCount++;
                increaseBlur();
                increaseBlur();
                increaseBlur();
                updateScoreboard();
            }
        };
        optionsDiv.appendChild(btn);
    });

    updateScoreboard();
}

function generateVariations(correctAnswer) {
    const variations = [];
    const letters = correctAnswer.split('');

    // Variation 1: Remove a random letter
    const variation1 = correctAnswer.slice(0, Math.floor(Math.random() * letters.length)) +
        correctAnswer.slice(Math.floor(Math.random() * letters.length) + 1);
    variations.push(variation1);

    // Variation 2: Swap two adjacent letters
    const index = Math.floor(Math.random() * (letters.length - 1));
    const variation2 = letters.slice();
    [variation2[index], variation2[index + 1]] = [variation2[index + 1], variation2[index]];
    variations.push(variation2.join(''));

    // Variation 3: Add a random lowercase letter at a random position
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    const insertPosition = Math.floor(Math.random() * (correctAnswer.length + 1));
    const variation3 = correctAnswer.slice(0, insertPosition) + randomLetter + correctAnswer.slice(insertPosition);
    variations.push(variation3);

    return variations;
}

function showNextWritingWord() {
    if (currentIndex >= currentDataset.length) {
        alert(`Schreiben beendet! Richtig: ${correctAnswersCount}, Falsch: ${wrongAnswersCount}`);
        return;
    }

    const currentWord = currentDataset[currentIndex];
    document.getElementById('german-word-writing').innerText = currentWord.Deutsch;
    document.getElementById('input-field').value = '';
    updateScoreboard();
}

function checkInput() {
    const inputField = document.getElementById('input-field');
    const input = inputField.value.trim();
    const correctAnswer = currentDataset[currentIndex].English;

    if (input === correctAnswer) {
        speakText(correctAnswer);
        correctAnswersCount++;
        decreaseBlur();
        attemptCount = 0;
        currentIndex++;
        inputField.classList.remove('error');
        showNextWritingWord();
    } else {
        speakText(correctAnswer);
        wrongAnswersCount++;
        attemptCount++;
        increaseBlur();
        increaseBlur();
        increaseBlur();
        inputField.classList.add('error');
        setTimeout(() => inputField.classList.remove('error'), 500);
        if (attemptCount >= 2) {
            inputField.value = correctAnswer;
            attemptCount = 0;
            currentIndex++;
            setTimeout(showNextWritingWord, 2500);
        }
    }
}

// ============================================================
// Scoreboard
// ============================================================
function updateScoreboard() {
    document.getElementById('scoreboard').innerText =
        `correct: ${correctAnswersCount} | false: ${wrongAnswersCount} | remaining questions: ${currentDataset.length - currentIndex}`;
}

function clearScoreboard() {
    document.getElementById('scoreboard').innerText = ``;
}

// ============================================================
// Speech
// ============================================================
function speakText(text) {
    const speech = new SpeechSynthesisUtterance();
    speech.lang = 'en-US';
    speech.text = text;
    speech.onerror = (event) => {
        console.error("Fehler beim Sprechen:", event);
        alert("Fehler bei der Sprachausgabe.");
    };
    speechSynthesis.cancel();
    speechSynthesis.speak(speech);
}

// ============================================================
// Utility
// ============================================================
function shuffleArray(array) {
    // Fisher-Yates-Shuffle (korrekter Shuffle, O(n))
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function goToHome() {
    document.getElementById('quiz-section').classList.add('hidden');
    document.getElementById('learning-section').classList.add('hidden');
    document.getElementById('writing-section').classList.add('hidden');
    document.getElementById('lesson-selection-section').classList.remove('hidden');
    clearScoreboard();
}