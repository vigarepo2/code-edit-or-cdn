document.getElementById('generateBtn').addEventListener('click', generateCardNumbers);
document.getElementById('quantitySelect').addEventListener('change', toggleCustomQuantityInput);

function generateCardNumbers() {
    const bin = document.getElementById('binInput').value.trim();
    const quantitySelect = document.getElementById('quantitySelect').value;
    let quantity = quantitySelect === 'custom' ? parseInt(document.getElementById('customQuantityInput').value) : parseInt(quantitySelect);

    if (quantitySelect === 'custom' && (isNaN(quantity) || quantity <= 0)) {
        alert('Please enter a valid custom quantity.');
        return;
    }

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

function toggleCustomQuantityInput() {
    const quantitySelect = document.getElementById('quantitySelect').value;
    const customQuantityContainer = document.getElementById('customQuantityContainer');
    if (quantitySelect === 'custom') {
        customQuantityContainer.style.display = 'block';
    } else {
        customQuantityContainer.style.display = 'none';
    }
}

function generateCardNumber(bin) {
    let number = '';
    for (let i = 0; i < bin.length; i++) {
        if (bin[i].toLowerCase() === 'x') {
            number += Math.floor(Math.random() * 10);
        } else {
            number += bin[i];
        }
    }

    while (number.length < (getCardLength(bin) - 1)) {
        number += Math.floor(Math.random() * 10);
    }

    number += getCheckDigit(number);
    return number;
}

function getCardLength(bin) {
    // Handling various card lengths
    if (bin.startsWith("34") || bin.startsWith("37")) {
        return 15; // American Express
    } else if (bin.startsWith("4")) {
        return 16; // Visa
    } else if (bin.startsWith("5") || bin.startsWith("2")) {
        return 16; // MasterCard
    } else if (bin.startsWith("35")) {
        return 16; // JCB
    } else if (bin.startsWith("36") || bin.startsWith("38") || bin.startsWith("30")) {
        return 14; // Diners Club
    } else if (bin.startsWith("6011") || bin.startsWith("65")) {
        return 16; // Discover
    }
    return 16; // Default length
}

function generateCVV(bin) {
    if (bin.startsWith("34") || bin.startsWith("37")) {
        return Math.floor(1000 + Math.random() * 9000).toString().substring(0, 4); // American Express, 4 digits
    } else if (bin.startsWith("36") || bin.startsWith("38") || bin.startsWith("30")) {
        return Math.floor(100 + Math.random() * 900).toString().substring(0, 3); // Diners Club, 3 digits
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

    // Join the array of card numbers with a line break for proper formatting
    cardNumbers.innerHTML = numbers.join('<br>');
    resultCard.style.display = 'block';
}

function copyToClipboard() {
    const text = document.getElementById('cardNumbers').innerText;
    navigator.clipboard.writeText(text).then(() => {
        showCopySuccess();
    }).catch(err => {
        console.error('Error in copying text: ', err);
        alert('Failed to copy card numbers to clipboard.');
    });
}

function showCopySuccess() {
    const copyIcon = document.querySelector('.copy-btn');
    copyIcon.classList.remove('fa-copy');
    copyIcon.classList.add('fa-check', 'text-success');

    setTimeout(() => {
        copyIcon.classList.remove('fa-check', 'text-success');
        copyIcon.classList.add('fa-copy');
    }, 2000); // Revert back after 2 seconds
}
