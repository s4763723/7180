let userAnswers = [];
const totalQuestions = 7;

const quizQuestions = [
    {
        question: "When was Brisbane Central Station built?",
        image: "img/Brisbane Central Station.png",
        options: ["1885", "1889", "1901", "1923"],
        correctAnswer: "1889"
    },
    {
        question: "What architectural style is Brisbane City Hall built in?",
        image: "img/Brisbane City Hall.png",
        options: ["Neoclassical style", "Gothic style", "Modernist style", "Baroque style"],
        correctAnswer: "Neoclassical style"
    },
    {
        question: "What was the rock from Kangaroo Point Cliffs originally used for?",
        image: "img/Kangaroo Point Cliffs.png",
        options: ["Constructing Brisbane City Hall", "Paving roads", "Building bridges", "Fortification construction"],
        correctAnswer: "Constructing Brisbane City Hall"
    },
    {
        question: "When was Roma Street Station originally built?",
        image: "img/Roma Street Station.png",
        options: ["1859", "1873", "1890", "1905"],
        correctAnswer: "1873"
    },
    {
        question: "What does the Shrine of Remembrance at Anzac Square primarily commemorate?",
        image: "img/Shrine of Remembrance.png",
        options: ["Australian soldiers in World War I and II", "Brisbane's 100th anniversary", "Queensland's independence", "Victorian-era architects"],
        correctAnswer: "Australian soldiers in World War I and II"
    },
    {
        question: "In which year was Story Bridge completed?",
        image: "img/Story Bridge.png",
        options: ["1935", "1940", "1945", "1950"],
        correctAnswer: "1940"
    },
    {
        question: "When was the current version of Victoria Bridge built?",
        image: "img/Victoria Bridge.png",
        options: ["1959", "1969", "1975", "1980"],
        correctAnswer: "1969"
    }
];

let currentQuestionIndex = 0;

function loadQuestion(index) {
    if (index < totalQuestions) {
        const question = quizQuestions[index];
        document.querySelector('.question-section').textContent = question.question;
        document.querySelector('.image-section img').src = question.image;
        
        const options = document.querySelectorAll('.option');
        options.forEach((option, i) => {
            option.textContent = question.options[i];
            option.style.backgroundColor = '';
        });

        document.querySelector('.quiz-content').style.display = 'flex';
        document.querySelector('.quiz-finished').style.display = 'none';
    } else {
        showFinishedPage();
    }
    updateProgressDots();
}

function showFinishedPage() {
    document.querySelector('.quiz-content').style.display = 'none';
    document.querySelector('.quiz-finished').style.display = 'flex';
}

function updateProgressDots() {
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        if (index < totalQuestions) {
            dot.style.display = 'inline-block';
            dot.classList.toggle('active', index === currentQuestionIndex);
        } else {
            dot.style.display = 'none';
        }
    });
}

function checkAnswer(selectedOption) {
    const correctAnswer = quizQuestions[currentQuestionIndex].correctAnswer;
    userAnswers[currentQuestionIndex] = selectedOption.textContent;
    if (selectedOption.textContent === correctAnswer) {
        currentQuestionIndex++;
        if (currentQuestionIndex < totalQuestions) {
            loadQuestion(currentQuestionIndex);
        } else {
            showFinishedPage();
        }
    } else {
        selectedOption.style.backgroundColor = 'red';
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion(currentQuestionIndex);
    }
}

function resetQuiz() {
    currentQuestionIndex = 0;
    loadQuestion(currentQuestionIndex);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadQuestion(currentQuestionIndex);

    document.querySelector('.nav-button.prev').addEventListener('click', previousQuestion);
    document.querySelector('.nav-button.next').addEventListener('click', () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
        } else {
            showFinishedPage();
        }
    });
    
    document.querySelector('.review-faults').addEventListener('click', resetQuiz);
    
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', () => checkAnswer(option));
    });
});