document.getElementById('read-me-btn').addEventListener('click', function() {
    var note = document.getElementById('note');
    note.style.display = note.style.display === 'none' ? 'block' : 'none';
});


document.getElementById('send-btn').addEventListener('click', async function () {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    addMessage('Beta', userInput);
    document.getElementById('user-input').value = '';

    // Check if the input is related to math
    if (isMathRelated(userInput)) {
        const response = await fetchCohereResponse(userInput);
        addMessage('Chatbot', response);
    } else {
        addMessage('Chatbot', "Please ask a math-related question.");
    }
});

function addMessage(sender, text) {
    const chatBox = document.getElementById('chat-box');
    const message = document.createElement('div');
    message.className = sender.toLowerCase();
    message.textContent = `${sender}: ${text}`;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function fetchCohereResponse(userInput) {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer 0RxRmel51m7DvfUrjlRU5a4DAJ87bA4xNAmg5EwR',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'command-light', // Change the model name if needed
            prompt: `Provide the final answer only for the following math problem: ${userInput}`,
            max_tokens: 50,
            temperature: 0.5
        })
    });

    if (response.ok) {
        const data = await response.json();
        return data.generations[0].text.trim();
    } else {
        return "Sorry, I couldn't get a response.";
    }
}

function isMathRelated(input) {
    const mathKeywords = ['add', 'subtract', 'multiply', 'divide', 'solve', 'equation', 'integral', 'derivative', 'matrix', 'algebra', 'geometry', 'calculus', 'probability', 'statistic', 'logarithm', 'factorial', 'square root', 'trigonometry', 'math', 'number', 'calculate', '+', '-', '*', '/', '^', '=', '>', '<', 'sum', 'difference', 'product', 'quotient', 'polynomial'];

    // Convert the input to lowercase to make the check case-insensitive
    const lowerCaseInput = input.toLowerCase();

    // Check if any of the math keywords are in the input
    return mathKeywords.some(keyword => lowerCaseInput.includes(keyword));
}

document.getElementById('send-btn').addEventListener('click', async function () {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    addMessage('User', userInput);
    document.getElementById('user-input').value = '';

    // Check if the input is related to math
    if (isMathRelated(userInput)) {
        const response = await fetchPolynomialDivisionResponse(userInput);
        addMessage('Chatbot', response);
    } else {
        addMessage('Chatbot', "Please ask a math-related question.");
    }
});

function addMessage(sender, text) {
    const chatBox = document.getElementById('chat-box');
    const message = document.createElement('div');
    message.className = sender.toLowerCase();
    message.textContent = `${sender}: ${text}`;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function fetchPolynomialDivisionResponse(userInput) {
    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer 0RxRmel51m7DvfUrjlRU5a4DAJ87bA4xNAmg5EwR',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'text-davinci-003', // Use a powerful model for better accuracy
            prompt: `Solve the following polynomial division problem and provide the final answer only: ${userInput}`,
            max_tokens: 100,
            temperature: 0.3, // Lower temperature for more focused and accurate answers
            stop: ["\n"]
        })
    });

    if (response.ok) {
        const data = await response.json();
        return data.choices[0].text.trim();
    } else {
        return "Sorry, I couldn't get a response.";
    }
}

function isMathRelated(input) {
    const mathKeywords = ['add', 'subtract', 'multiply', 'divide', 'solve', 'equation', 'integral', 'derivative', 'matrix', 'algebra', 'geometry', 'calculus', 'probability', 'statistic', 'logarithm', 'factorial', 'square root', 'trigonometry', 'math', 'number', 'calculate', '+', '-', '*', '/', '^', '=', '>', '<', 'sum', 'difference', 'product', 'quotient', 'polynomial', 'division'];

    // Convert the input to lowercase to make the check case-insensitive
    const lowerCaseInput = input.toLowerCase();

    // Check if any of the math keywords are in the input
    return mathKeywords.some(keyword => lowerCaseInput.includes(keyword));
}
