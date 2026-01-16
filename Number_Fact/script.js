const numberInput = document.getElementById("numberInput");
const getFactBtn = document.getElementById("getFactBtn");
const resultContainer = document.getElementById("result");

resultContainer.textContent = "Your number fact will appear here.";

getFactBtn.addEventListener("click", () => {
    const number = numberInput.value.trim();

    if (number === "") {
        showError("Please enter a number.");
        return;
    }

    if (isNaN(number)) {
        showError("Please enter a valid number.");
        return;
    }

    showLoading();

    
    setTimeout(() => {
        const fact = generateNumberFact(Number(number));
        showFact(fact);
    }, 500);
});

function generateNumberFact(num) {
    const facts = [
        `${num} is ${num % 2 === 0 ? 'an even' : 'an odd'} number.`,
        `${num} squared equals ${num * num}.`,
        `${num} multiplied by 10 equals ${num * 10}.`,
        `The sum of digits in ${num} is ${getSumOfDigits(num)}.`,
        `${num} is ${isPrime(num) ? 'a prime number' : 'not a prime number'}.`,
        `${num} in binary is ${num.toString(2)}.`,
        `${num} in hexadecimal is ${num.toString(16).toUpperCase()}.`,
        `The square root of ${num} is approximately ${Math.sqrt(num).toFixed(2)}.`,
        `${num} appears ${countDigit(num, Math.abs(num) % 10)} time(s) in the number ${num}.`,
        `${num} divided by 2 equals ${(num / 2).toFixed(2)}.`
    ];
    
    
    return facts[Math.floor(Math.random() * facts.length)];
}

function getSumOfDigits(num) {
    return Math.abs(num)
        .toString()
        .split('')
        .reduce((sum, digit) => sum + Number(digit), 0);
}

function isPrime(num) {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) return false;
    }
    return true;
}

function countDigit(num, digit) {
    return Math.abs(num)
        .toString()
        .split('')
        .filter(d => Number(d) === digit).length;
}

function showLoading() {
    resultContainer.classList.remove("has-content");
    resultContainer.innerHTML = `<span class="loading">Fetching fact...</span>`;
}

function showFact(fact) {
    resultContainer.classList.add("has-content");
    resultContainer.textContent = fact;
}

function showError(message) {
    resultContainer.classList.remove("has-content");
    resultContainer.textContent = message;
}