document.getElementById('generateBtn').addEventListener('click', generateCardNumbers);

function generateCardNumbers() {
    const bin = document.getElementById('binInput').value.trim();
    const quantity = parseInt(document.getElementById('quantitySelect').value);
    let cardNumbers = [];

    for (let i = 0; i < quantity; i++) {
        let cardNumber = generateCardNumber(bin);
        let month = document.getElementById('monthSelect').value || generateRandomMonth();
        let year = document.getElementById('yearSelect').value || generateRandomYear();
        let cvv = document.getElementById('cvvInput').value || generateCVV(bin);

        cardNumbers.push(`${cardNumber}|${month}|${year}|${cvv}`);
    }

    displayCardNumbers(cardNumbers);
}

function generateCardNumber(bin) {
    let number = bin;
    while (number.length < (getCardLength(bin) - 1)) {
        number += Math.floor(Math.random() * 10);
    }
    number += getCheckDigit(number);
    return number;
}

function getCardLength(bin) {
    if (bin.startsWith("34") || bin.startsWith("37")) {
        return 15; // American Express
    } else if (bin.startsWith("4")) {
        return 16; // Visa
    } else if (bin.startsWith("5") || bin.startsWith("2")) {
        return 16; // MasterCard
    }
    return 16; // Default length
}

function generateCVV(bin) {
    if (bin.startsWith("34") || bin.startsWith("37")) {
        return Math.floor(1000 + Math.random() * 9000).toString().substring(0, 4); // American Express, 4 digits
    } else {
        return Math.floor(100 + Math.random() * 900).toString().substring(0, 3); // Other cards, 3 digits
    }
}

function generateRandomMonth() {
    return ('0' + (Math.floor(Math.random() * 12) + 1)).slice(-2);
}

function generateRandomYear() {
    const year = new Date().getFullYear();
    return year + Math.floor(Math.random() * 5) + 1;
}

function getCheckDigit(num) {
    let sum = 0;
    let doubleUp = false;
    for (let i = num.length - 1; i >= 0; i--) {
        let digit = parseInt(num.charAt(i));
        if (doubleUp) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        doubleUp = !doubleUp;
    }
    return (10 - sum % 10) % 10;
}

function displayCardNumbers(numbers) {
    const resultCard = document.getElementById('resultCard');
    const cardNumbers = document.getElementById('cardNumbers');
    cardNumbers.innerHTML = numbers.join('<br>');
    resultCard.style.display = 'block';
}

function copyToClipboard() {
    const text = document.getElementById('cardNumbers').textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Card numbers copied to clipboard!');
    }).catch(err => {
        console.error('Error in copying text: ', err);
        alert('Failed to copy card numbers to clipboard.');
    });
}
