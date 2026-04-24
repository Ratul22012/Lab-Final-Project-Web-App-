let startTime, timerStarted = false, timerInterval;
let testDuration = 60; // 60 seconds

// Paragraphs by difficulty
const paragraphs = {
    easy: [
        "The quick brown fox jumps over the lazy dog.",
        "Hello world! Welcome to the typing test.",
        "Typing is fun and helps improve your speed."
    ],
    medium: [
        "The afternoon felt unusually quiet, as though the world had paused to reconsider its next move.",
        "Each error becomes a lesson, shaping improvement through steady and deliberate practice.",
        "Technology continues to reshape communication, influencing how ideas are shared and preserved.",
        "As evening approached, the sky softened into shades of amber and gray, signaling the end of the day."


    ],
    hard: [
        "Beneath the flickering streetlights, he wondered whether memory was a refuge or a prison, endlessly reshaping the past into something both familiar and painfully distant.",
        "In the labyrinth of time, moments intertwine like threads in a tapestry, each one a fragment of a story that defies the linear constraints of memory and existence.",
        "The past returned not as memory but as atmosphere—thick, inescapable, and pressing against his thoughts until the present felt like an imitation of something already lost.",
        "She pondered the paradox of remembrance: that in trying to hold onto fleeting moments, we often find them slipping further away, transformed by the very act of recollection.",
        "She reflected on the nature of time, how moments once vivid can fade into the background of our lives, leaving only traces of their existence."


    ]
};

// Select a random paragraph based on difficulty
function selectParagraph() {
    const diff = document.getElementById("difficulty").value;
    const list = paragraphs[diff];
    if (!list) {
        console.error("Invalid difficulty selected:", diff);
        return;
    }
    const randomIndex = Math.floor(Math.random() * list.length);
    document.getElementById("text-to-type").innerHTML = list[randomIndex];
}

// Start Test
function startTest() {
    try {
        selectParagraph();

        // ✅ READ SELECTED TIME
        testDuration = parseInt(document.getElementById("timeSelect").value) || 60;

        document.getElementById("user-input").value = "";
        document.getElementById("result").innerHTML = "";
        document.getElementById("user-input").disabled = false;
        document.getElementById("user-input").focus();

        // Disable start button to prevent double clicks
        const startBtn = document.querySelector("button[onclick='startTest()']");
        if (startBtn) startBtn.disabled = true;

        startTime = new Date();
        timerStarted = true;

        let timeLeft = testDuration;
        document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                finishTest();
            }
        }, 1000);
    } catch (err) {
        console.error("Error starting test:", err);
        alert("Could not start test. Check console for details.");
    }
}


// Real-time error highlighting
document.getElementById("user-input").addEventListener("input", function () {
    const text = document.getElementById("text-to-type").innerText;
    const input = this.value;

    let highlighted = "";
    for (let i = 0; i < text.length; i++) {
        if (i < input.length) {
            highlighted += text[i] === input[i] ?
                `<span style="color:green">${text[i]}</span>` :
                `<span style="color:red">${text[i]}</span>`;
        } else {
            highlighted += text[i];
        }
    }
    document.getElementById("text-to-type").innerHTML = highlighted;
});

// Finish Test
async function finishTest() {
    if (!timerStarted) {
        // If results are already showing, do nothing (user double clicked)
        if (document.getElementById("result").innerHTML.trim() !== "") {
            return;
        }
        return alert("Press Start Test first!");
    }
    timerStarted = false;
    clearInterval(timerInterval);

    // Re-enable start button
    const startBtn = document.querySelector("button[onclick='startTest()']");
    if (startBtn) startBtn.disabled = false;

    const endTime = new Date();
    // Get text without HTML tags
    const textHtml = document.getElementById("text-to-type").innerText;
    const input = document.getElementById("user-input").value;

    let timeTaken = (endTime - startTime) / 1000 / 60;
    if (timeTaken <= 0) timeTaken = 0.01;

    const wordsTyped = input.trim().split(/\s+/).length;
    // Note: Use original text for error counting if possible, but innerText is okay if no complex HTML
    const errors = countErrors(textHtml, input);
    const accuracy = textHtml.length > 0 ? Math.round(((textHtml.length - errors) / textHtml.length) * 100) : 0;
    const wpm = Math.round(wordsTyped / timeTaken); // Define wpm here
    const cpm = Math.round(input.length / timeTaken);

    let verdict = "Needs Improvement";
    if (wpm >= 60 && accuracy >= 95) verdict = "Excellent";
    else if (wpm >= 40 && accuracy >= 90) verdict = "Good";
    else if (wpm >= 30 && accuracy >= 85) verdict = "Average";

    document.getElementById("result").innerHTML =
        `<h4>Test Complete!</h4>
         <p>WPM: ${wpm} | CPM: ${cpm} | Accuracy: ${accuracy}% | Errors: ${errors}</p>
         <p>Verdict: <b>${verdict}</b></p>`;

    document.getElementById("user-input").disabled = true;

    saveScore(wpm, accuracy, errors, cpm, verdict);
}

// Count errors
function countErrors(text, input) {
    let errors = 0;
    for (let i = 0; i < text.length; i++) {
        if (input[i] !== text[i]) errors++;
    }
    return errors;
}

// Save score to backend
async function saveScore(wpm, accuracy, errors, cpm, verdict) {
    const userId = localStorage.getItem("userId");
    const difficulty = document.getElementById("difficulty").value;

    try {
        const res = await fetch("http://localhost:8080/api/score/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, wpm, accuracy, errors, test_time: `${testDuration}s`, difficulty, cpm, verdict })
        });
        const data = await res.text();
        if (res.ok) console.log("Score saved:", data);
        else console.log("Error saving score:", data);
    } catch (err) {
        console.log("Server error:", err);
    }
}
