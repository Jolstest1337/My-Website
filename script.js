document.getElementById('solveButton').addEventListener('click', function() {
    const polynomial = document.getElementById('polynomial').value;
    const divider = document.getElementById('divider').value;
    
    try {
        const poly = parsePolynomial(polynomial);
        const div = parsePolynomial(divider);
        
        const { quotient, remainder, steps } = polynomialDivision(poly, div);
        
        const quotientStr = formatPolynomial(quotient);
        const remainderStr = formatPolynomial(remainder);
        const dividerStr = divider;
        
        // Prepare result string
        let resultStr = `<h2>Result:</h2><p>Quotient: ${quotientStr}`;
        if (remainder.length > 0) {
            const sign = remainder[0] < 0 ? '-' : '+';
            const remainderAbsStr = formatPolynomial(remainder.map(coef => Math.abs(coef)));
            resultStr += ` ${sign} <span class="fraction"><span class="numerator">${remainderAbsStr}</span><span class="denominator">${dividerStr}</span></span>`;
        }
        resultStr += `</p>`;
        
        // Add note below result
        resultStr += `<p><strong>DO NOT USE THIS SOLUTION IT'S NOT FOR OUR CLASS I CAN'T FIGURE IT OUT TO USE LONG DIVISION</strong></p>`;
        
        // Add solution steps
        resultStr += `<h2>Solution:</h2>`;
        steps.forEach((step, index) => {
            resultStr += `<h3>Step ${index + 1}:</h3><p>${step}</p>`;
        });
        
        document.getElementById('solution').innerHTML = resultStr;
    } catch (error) {
        document.getElementById('solution').innerText = 'Error in polynomial format or calculation.';
    }
});

document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

function parsePolynomial(poly) {
    const terms = poly.replace(/\s+/g, '').match(/[\+\-]?\d*x?\^?\d*/g);
    const parsed = [];
    terms.forEach(term => {
        if (term) {
            let coef = 1;
            let exp = 0;
            if (term.includes('x')) {
                const parts = term.split('x');
                if (parts[0] !== '' && parts[0] !== '+') coef = parseInt(parts[0], 10);
                if (parts[1] && parts[1].startsWith('^')) exp = parseInt(parts[1].substring(1), 10);
                else exp = 1;
            } else {
                coef = parseInt(term, 10);
            }
            parsed[exp] = (parsed[exp] || 0) + coef;
        }
    });
    return parsed;
}

function polynomialDivision(dividend, divisor) {
    const quotient = [];
    const remainder = [...dividend];
    const steps = [];
    
    while (remainder.length >= divisor.length) {
        const leadTermExp = remainder.length - 1;
        const divisorLeadTermExp = divisor.length - 1;
        
        const termExp = leadTermExp - divisorLeadTermExp;
        const termCoef = remainder[leadTermExp] / divisor[divisorLeadTermExp];
        
        const term = Array(termExp + 1).fill(0);
        term.push(termCoef);
        quotient[termExp] = termCoef;
        
        const stepDescription = generateStepDescription(remainder, divisor, term, termCoef, termExp);
        steps.push(stepDescription);
        
        for (let i = 0; i < divisor.length; i++) {
            remainder[leadTermExp - divisorLeadTermExp + i] -= termCoef * divisor[i];
        }
        remainder.pop();
        
        while (remainder.length && remainder[0] === 0) {
            remainder.shift();
        }
    }
    
    return { quotient: quotient.reverse(), remainder: remainder.reverse(), steps };
}

function generateStepDescription(remainder, divisor, term, termCoef, termExp) {
    const termStr = formatPolynomial(term);
    const remainderStr = formatPolynomial(remainder);
    const divisorStr = formatPolynomial(divisor);
    
    let stepDescription = `<div class="step">`;
    stepDescription += `Divide: <span class="fraction"><span class="numerator">${remainderStr}</span><span class="denominator">${divisorStr}</span></span> = ${termStr}<br>`;
    stepDescription += `Multiply and Subtract:<br>`;
    stepDescription += `<span class="fraction"><span class="numerator">${remainderStr}</span><span class="denominator">${divisorStr}</span></span> - ${termStr} * ${divisorStr}<br>`;
    
    const multipliedDivisor = divisor.map(coef => coef * termCoef);
    const multipliedDivisorStr = formatPolynomial(multipliedDivisor);
    const newRemainder = remainder.map((coef, i) => coef - (multipliedDivisor[i] || 0));
    const newRemainderStr = formatPolynomial(newRemainder);
    
    stepDescription += `= ${newRemainderStr}<br>`;
    stepDescription += `</div>`;
    
    return stepDescription;
}

function formatPolynomial(poly) {
    if (!poly.length) return '0';
    return poly.map((coef, i) => {
        if (coef === 0) return '';
        const exp = poly.length - i - 1;
        if (coef === 1 && exp > 0) return `x${exp === 1 ? '' : '^' + exp}`;
        if (coef === -1 && exp > 0) return `-x${exp === 1 ? '' : '^' + exp}`;
        return `${coef}${exp > 0 ? 'x' + (exp === 1 ? '' : '^' + exp) : ''}`;
    }).filter(term => term).join(' + ').replace(/\+ -/g, '- ');
}
