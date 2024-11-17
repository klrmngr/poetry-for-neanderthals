/**
 * TODO:
 * after time runs out, add button to start next team
 * maybe add a countdown before the game starts? idk
 */

let words;
let score_glad = score_mad = score = current_word = 0;
let max_timer;
let timer;
let game_end_timestamp;
let game_running = false;

// Run the initialize function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initialize);

document.getElementById('score-1').addEventListener('click', function() {
    if(game_running) {
        updateWords();
        score--;
        document.getElementById('score').textContent = `Score: ${score}`;
    }
});

document.getElementById('score+1').addEventListener('click', function() {
    if(game_running) {
        updateWords();
        score++;
        document.getElementById('score').textContent = `Score: ${score}`;
    }
});

document.getElementById('score+3').addEventListener('click', function() {
    if(game_running) {
        updateWords();
        score += 3;
        document.getElementById('score').textContent = `Score: ${score}`;
    }
});

document.getElementById('reset-score').addEventListener('click', function() {
    resetGame();
});

document.getElementById('start-game-60').addEventListener('click', function() {
    startGame(60);
});

document.getElementById('start-game-custom').addEventListener('click', function() {
    const custom_time = parseInt(document.getElementById('custom-time').value, 10);
    const inputElement = document.getElementById('custom-time');
    
    if (custom_time < 1 || Number.isNaN(custom_time)) {
        inputElement.style.transition = '';
        inputElement.classList.add('bg-red-200');

        setTimeout(() => {
            inputElement.style.transition = 'background-color 1s ease, border-color 1s ease';
            inputElement.classList.remove('bg-red-200');
        }, 300);
    } else {
        startGame(custom_time);
    }
});

function startGame(duration) {
    updateWords();
    
    game_running = true;
    timer = duration;
    max_timer = duration;
    score = 0;
    document.getElementById('score').textContent = `Score: ${score}`;
    
    const timer_menu = document.getElementById('timer-menu');
    timer_menu.classList.add('hidden');
    const game_screen = document.getElementById('game-screen');
    game_screen.classList.remove('hidden');
    
    // Start the countdown
    startCountdown();
}

function resetGame() {
    updateWords();
    game_running = true;
    timer = max_timer;
    score = 0;
    document.getElementById('timer-display').textContent = `Time: ${timer}s`;
    document.getElementById('score').textContent = `Score: ${score}`;
    startCountdown();
}

function startCountdown() {
    // Display the initial time
    document.getElementById('timer-display').textContent = `Time: ${timer}s`;
    game_end_timestamp = Date.now() + max_timer * 1000;
    countdownInterval = setInterval(() => {
        let current_timestamp = Date.now();

        timer = Math.round((game_end_timestamp - current_timestamp) / 1000);
        document.getElementById('timer-display').textContent = `Time: ${timer}s`;

        if (timer <= 0) {
            clearInterval(countdownInterval); // Stop the countdown
            game_running = false;
        }
    }, 200); // check timer every 200ms
}

function updateWords() {
  document.getElementById('word1').textContent = words[current_word % words.length]["1"];
  document.getElementById('word3').textContent = words[current_word % words.length]["3"];
  current_word++;
}

async function initialize() {
    words = await loadAndCombineJSON();
    shuffle(words);
    updateWords();
}

function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle
    while (currentIndex != 0) {
  
      // Pick a remaining element
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // Swap
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

async function loadAndCombineJSON() {
    try {
        const [response1, response2, response3, response4] = await Promise.all([
            fetch('data/base_game_gray.json'),
            fetch('data/base_game_red.json'),
            fetch('data/1st_expansion_pack_gray.json'),
            fetch('data/1st_expansion_pack_red.json')
        ]);
    
        // Check if both responses are OK
        if (!response1.ok || !response2.ok || !response3.ok || !response4.ok) {
            throw new Error('Failed to load JSON files');
        }
    
        const data1 = await response1.json();
        const data2 = await response2.json();
        const data3 = await response3.json();
        const data4 = await response4.json();

        const combinedData = [...data1.game_data, ...data2.game_data, ...data3.game_data, ...data4.game_data];
    
        console.log(combinedData);
        return combinedData; // You can return or use combinedData as needed
    } catch (error) {
        console.error('Error:', error);
    }
}
