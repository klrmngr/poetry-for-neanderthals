/**
 * TODO:
 * after time runs out, add button to start next team
 * maybe add a countdown before the game starts? idk
 */

let words;
let score_glad = score_mad = score = current_word = 0;
let max_timer;
let timer;
let game_running = false;

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

document.getElementById('start-game').addEventListener('click', async function() {
    if (await loadAndValidateConfig()) {
        startGame();
    }
});

async function loadAndValidateConfig() {
    let valid = true;
    valid = loadAndValidateMaxTimer() && valid;
    valid = await loadAndValidateWords() && valid;
    return valid;
}

function loadAndValidateMaxTimer() {
    const time_input_element = document.getElementById('time-input');
    max_timer = parseInt(time_input_element.value, 10);
    
    if (max_timer < 1 || Number.isNaN(max_timer)) {
        highlightErrorOnElement(time_input_element);
        return false;
    }

    return true;
}

async function loadAndValidateWords() {
    const selectedPackPaths = getSelectedPackPaths();
    if (selectedPackPaths.length < 1) {
        highlightErrorOnElement(document.getElementById('card-packs-container'));
        return false;
    }

    try {
        words = await loadWordsFromPaths(selectedPackPaths);
    } catch (error) {
        console.error('Error loading JSON: ' + error);
        displayErrorMessage('Something went wrong when loading the card data, please try again later');
        return false;
    }
    
    shuffle(words);
    return true;
}

function getSelectedPackPaths() {
    const paths = [];
    const checkbox_elements = document.getElementById('card-packs-container').getElementsByTagName("input");
    for (let checkbox of checkbox_elements) {
        if (checkbox.checked) {
            paths.push(checkbox.value);
        }
    }
    return paths;
}

function startGame() {
    updateWords();
    
    game_running = true;
    timer = max_timer;
    score = 0;
    document.getElementById('score').textContent = `Score: ${score}`;
    
    const options_menu = document.getElementById('options-menu');
    options_menu.classList.add('hidden');
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

    countdownInterval = setInterval(() => {
        timer--;
        document.getElementById('timer-display').textContent = `Time: ${timer}s`;

        if (timer <= 0) {
            clearInterval(countdownInterval); // Stop the countdown
            game_running = false;
        }
    }, 1000); // Update every second
}

function updateWords() {
  document.getElementById('word1').textContent = words[current_word % words.length]["1"];
  document.getElementById('word3').textContent = words[current_word % words.length]["3"];
  current_word++;
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

async function loadWordsFromPaths(paths) {
    const fetch_promises = [];
    for (let path of paths) {
        fetch_promises.push(fetch(path));
    }

    const responses = await Promise.all(fetch_promises);
    const combined_data = [];

    for (let response of responses) {
        if (response.ok) {
            const data = await response.json();
            combined_data.push(...data.game_data);
        } else {
            throw new Error('Failed to load JSON files')
        }
    }

    console.log('Number of loaded cards: ' + combined_data.length);
    console.log(combined_data);
    return combined_data;
}

function highlightErrorOnElement(element) {
    element.style.transition = '';
    element.classList.add('bg-red-200');

    setTimeout(() => {
        element.style.transition = 'background-color 1s ease, border-color 1s ease';
        element.classList.remove('bg-red-200');
    }, 300);
}

function displayErrorMessage(message) {
    const error_message_element = document.getElementById('error-message');
    error_message_element.innerText = message;
    error_message_element.classList.remove('hidden');
    setTimeout(() => {
        error_message_element.classList.add('hidden');
    }, 5000);
}
