document.getElementById('solveButton').addEventListener('click', function() {
    const polynomial = document.getElementById('polynomial').value;
    const divider = document.getElementById('divider').value;
    
    try {
        const poly = parsePolynomial(polynomial);
        const [divisorRoot] = parseLinearDivisor(divider);
        
        if (divisorRoot === undefined) {
            throw new Error('Invalid divisor format');
        }

        const adjustedDivisorRoot = divisorRoot < 0 ? -divisorRoot : -divisorRoot;
        const { quotient, remainder, table } = syntheticDivision(poly, Math.abs(adjustedDivisorRoot));
        
        const quotientStr = formatPolynomial(quotient);
        const remainderStr = remainder.length ? remainder[0] : '0';
        const sign = remainder[0] < 0 ? '-' : '+';
        const absRemainderStr = Math.abs(remainder[0]);
        const dividerStr = `x - ${Math.abs(divisorRoot)}`;
        
        let resultStr = `<h2>Result:</h2><p>Quotient: ${quotientStr}`;
        if (remainder.length > 0) {
            resultStr += ` ${sign} <span class="fraction"><span class="numerator">${absRemainderStr}</span><span class="denominator">${dividerStr}</span></span>`;
        }
        resultStr += `</p>`;
        
        resultStr += `<h2>Solution:</h2>`;
        resultStr += generateTable(table, Math.abs(adjustedDivisorRoot));
        
        if (remainder.length > 0) {
            resultStr += `<p>r = ${remainderStr}</p>`;
        }
        
        document.getElementById('solution').innerHTML = resultStr;
    } catch (error) {
        document.getElementById('solution').innerText = 'Error in polynomial format or calculation.';
    }
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
    return parsed.reverse();
}

function parseLinearDivisor(divisor) {
    const match = divisor.match(/x\s*([-+]\s*\d+)/);
    if (match) {
        return [parseInt(match[1].replace(/\s+/g, ''), 10)];
    }
    return [];
}

function syntheticDivision(dividend, divisorRoot) {
    const quotient = [];
    const table = [];
    const tempDividend = [...dividend];
    
    const row1 = ['a', ...tempDividend.map(coef => coef.toString())];
    const row2 = new Array(tempDividend.length + 1).fill('');

    table.push(row1);
    table.push(row2);

    let carry = 0;

    for (let i = 0; i < tempDividend.length; i++) {
        const current = tempDividend[i] + carry;
        quotient.push(current);
        carry = current * divisorRoot;

        if (i < tempDividend.length - 1) {
            row2[i + 2] = carry.toString();
        }
    }

    const remainder = [quotient.pop()];

    table.push(['', ...quotient.map(coef => coef.toString()), remainder[0]]);

    return { quotient, remainder, table };
}

function generateTable(tableData, divisorRoot) {
    let html = '<table border="1" style="border-collapse: collapse; text-align: center;">';
    
    html += '<tr>';
    html += `<th>${divisorRoot}</th>`;
    tableData[0].slice(1).forEach(cell => html += `<th>${cell}</th>`);
    html += '</tr>';

    for (let i = 1; i < tableData.length; i++) {
        html += '<tr>';
        tableData[i].forEach(cell => html += `<td>${cell}</td>`);
        html += '</tr>';
    }
    
    html += '</table>';
    return html;
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
