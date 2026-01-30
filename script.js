// ==================== quiz.html logic ====================

document.addEventListener('DOMContentLoaded', () => {
  const name = localStorage.getItem('studentName') || 'Guest';
  document.getElementById('student-info').textContent = `Student: ${name}`;

  // ── Timer (60 minutes) ────────────────────────────────────────
  let timeLeft = 2700; // seconds
  const timeDisplay = document.getElementById('time');

  const timer = setInterval(() => {
    timeLeft--;
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    timeDisplay.textContent = `${min}:${sec.toString().padStart(2, '0')}`;

    if (timeLeft <= 300) { // last 5 min – red
      timeDisplay.style.color = timeLeft <= 60 ? '#c0392b' : '#e67e22';
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up! The test is being submitted automatically.");
      finishTest();
    }
  }, 1000);

  // ── Finish button ─────────────────────────────────────────────
  document.getElementById('finishBtn').addEventListener('click', () => {
    if (confirm("Are you sure you want to finish the test?")) {
      clearInterval(timer);
      finishTest();
    }
  });

  function finishTest() {
    let score = 0;
    const cards = document.querySelectorAll('.question-card');

    cards.forEach(card => {
      const correct = card.dataset.answer;
      const type = card.dataset.type;
      let userAns = '';

      if (type === 'radio') {
        const selected = card.querySelector('input[type="radio"]:checked');
        if (selected) userAns = selected.value;
      } else {
        const input = card.querySelector('.user-input');
        if (input) userAns = input.value.trim();
      }

      let normCorrect = correct.toLowerCase().replace(/\s+/g, '');
      let userNorm    = userAns.toLowerCase().replace(/\s+/g, '');

      let isCorrect = (userNorm === normCorrect);

      // Allow small floating-point tolerance
      if (!isCorrect && !isNaN(parseFloat(userAns)) && !isNaN(parseFloat(correct))) {
        if (Math.abs(parseFloat(userAns) - parseFloat(correct)) < 0.015) {
          isCorrect = true;
        }
      }

      if (isCorrect && userAns !== '') {
        card.classList.add('correct');
        score++;
      } else if (userAns !== '') {
        card.classList.add('incorrect');
      }
    });

    document.getElementById('results').innerHTML = `
      <h2>Test Completed</h2>
      <p>Student: <b>${name}</b></p>
      <p>Your score: <b>${score} / ${cards.length}</b></p>
      <p>Percentage: <b>${((score / cards.length) * 100).toFixed(1)}%</b></p>
    `;
    document.getElementById('results').style.display = 'block';
    document.getElementById('finishBtn').disabled = true;
    document.querySelector('.timer').style.display = 'none';

    // Optional: scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
  }

});


