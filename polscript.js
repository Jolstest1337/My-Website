document.getElementById('solveButton').addEventListener('click', function() {
    const polynomial = document.getElementById('polynomialInput').value;

    let method = '';
    let factoredForm = '';
    let solutionSteps = '';

    const cleanedPoly = polynomial.replace(/\s+/g, '');

    const syntheticResults = syntheticDivision(cleanedPoly);
    if (syntheticResults.factorFound) {
        method = 'Synthetic Division';
        factoredForm = syntheticResults.factoredForm;
        solutionSteps = syntheticResults.steps;
    } else {
        if (isDifferenceOfSquares(cleanedPoly)) {
            method = 'Difference of Squares';
            [factoredForm, solutionSteps] = factorDifferenceOfSquares(cleanedPoly);
        } else if (isSumOrDifferenceOfCubes(cleanedPoly)) {
            method = 'Sum or Difference of Cubes';
            [factoredForm, solutionSteps] = factorCubes(cleanedPoly);
        } else if (isPerfectSquareTrinomial(cleanedPoly)) {
            method = 'Perfect Square Trinomial';
            [factoredForm, solutionSteps] = factorPerfectSquareTrinomial(cleanedPoly);
        } else if (isGroupingApplicable(cleanedPoly)) {
            method = 'Factor by Grouping';
            [factoredForm, solutionSteps] = factorByGrouping(cleanedPoly);
        } else if (isTrinomial(cleanedPoly)) {
            method = 'Trinomial';
            [factoredForm, solutionSteps] = factorTrinomial(cleanedPoly);
        } else if (isGreatestCommonFactor(cleanedPoly)) {
            method = 'Greatest Common Factor';
            [factoredForm, solutionSteps] = factorGCF(cleanedPoly);
        } else {
            method = 'No applicable factoring method found.';
            factoredForm = 'Unable to factor the polynomial.';
            solutionSteps = 'No factoring methods were applicable.';
        }
    }

    document.getElementById('methodOutput').textContent = method;
    document.getElementById('factoredOutput').textContent = factoredForm;
    document.getElementById('stepsOutput').textContent = solutionSteps;

    document.getElementById('solutionOutput').classList.remove('hidden');
});

function isDifferenceOfSquares(poly) {
    return /^x\^2\s*-\s*\d+$/.test(poly);
}

function factorDifferenceOfSquares(poly) {
    const matches = poly.match(/^x\^2\s*-\s*(\d+)$/);
    if (matches) {
        const bSquared = parseInt(matches[1]);
        const b = Math.sqrt(bSquared);

        const steps = [];
        steps.push(`Step 1: Recognize this is a difference of squares.`);
        steps.push(`Step 2: Identify the formula a^2 - b^2 = (a - b)(a + b).`);
        steps.push(`Step 3: In this case, a = x and b^2 = ${bSquared}, so b = ${b}.`);
        steps.push(`Step 4: Apply the formula: (x - ${b})(x + ${b}).`);

        const factoredForm = `(x - ${b})(x + ${b})`;

        return [factoredForm, steps.join('\n')];
    }
    return ['', 'Failed to factor using Difference of Squares.'];
}

function isSumOrDifferenceOfCubes(poly) {
    return /^x\^3\s*([+-])\s*\d+$/.test(poly);
}

function factorCubes(poly) {
    const matches = poly.match(/^x\^3\s*([+-])\s*(\d+)$/);
    if (matches) {
        const sign = matches[1] === '+' ? '+' : '-';
        const bCubed = parseInt(matches[2]);
        const b = Math.cbrt(bCubed);

        const steps = [];
        steps.push(`Step 1: Recognize this as a sum/difference of cubes.`);
        steps.push(`Step 2: Identify the formula for sum of cubes: a^3 ± b^3 = (a ± b)(a^2 ∓ ab + b^2).`);
        steps.push(`Step 3: In this case, a = x and b^3 = ${bCubed}, so b = ${b}.`);
        steps.push(`Step 4: Apply the formula: (x ${sign} ${b})(x^2 ${sign === '+' ? '-' : '+'} ${b}x + ${b ** 2}).`);

        const factoredForm = `(x ${sign} ${b})(x^2 ${sign === '+' ? '-' : '+'} ${b}x + ${b ** 2})`;

        return [factoredForm, steps.join('\n')];
    }
    return ['', 'Failed to factor using Sum or Difference of Cubes.'];
}

function isPerfectSquareTrinomial(poly) {
    return /^x\^2\s*([+-])\s*\d+x\s*([+-])\s*\d+$/.test(poly);
}

function factorPerfectSquareTrinomial(poly) {
    const matches = poly.match(/^x\^2\s*([+-])\s*(\d+)x\s*([+-])\s*(\d+)$/);
    if (matches) {
        const sign1 = matches[1];
        const bx = parseInt(matches[2]);
        const sign2 = matches[3];
        const c = parseInt(matches[4]);

        const steps = [];
        steps.push(`Step 1: Recognize this is a perfect square trinomial.`);
        steps.push(`Step 2: Verify that c is the square of half the coefficient of the middle term.`);
        steps.push(`Step 3: Apply the formula (a ± b)^2.`);
        steps.push(`Step 4: Factored form is: (x ${sign1 === '+' ? '+' : '-'} ${Math.sqrt(c)})^2.`);

        const factoredForm = `(x ${sign1 === '+' ? '+' : '-'} ${Math.sqrt(c)})^2`;

        return [factoredForm, steps.join('\n')];
    }
    return ['', 'Failed to factor using Perfect Square Trinomial.'];
}

function isGroupingApplicable(poly) {
    return /^(\d+)x\^3\s*([+-])\s*(\d+)x\^2\s*([+-])\s*(\d+)x\s*([+-])\s*(\d+)$/.test(poly);
}

function factorByGrouping(poly) {
    const matches = poly.match(/^(\d+)x\^3\s*([+-])\s*(\d+)x\^2\s*([+-])\s*(\d+)x\s*([+-])\s*(\d+)$/);
    if (matches) {
        const terms = matches.slice(1);

        const steps = [];
        steps.push('Step 1: Group the terms into two groups.');
        steps.push('Step 2: Factor out the GCF from each group.');
        steps.push('Step 3: Factor the expression further.');
        steps.push(`Factored form for ${poly}: Factoring by grouping.`);

        const factoredForm = `Factoring by grouping: ${terms.join(' ')}`;

        return [factoredForm, steps.join('\n')];
    }
    return ['', 'Failed to factor using Grouping.'];
}

function isTrinomial(poly) {
    return /^(\d+)x\^2\s*([+-])\s*(\d+)x\s*([+-])\s*(\d+)$/.test(poly);
}

function factorTrinomial(poly) {
    const matches = poly.match(/^(\d+)x\^2\s*([+-])\s*(\d+)x\s*([+-])\s*(\d+)$/);
    if (matches) {
        const a = parseInt(matches[1]);
        const b = parseInt(matches[3]);
        const c = parseInt(matches[5]);

        const steps = [];
        steps.push('Step 1: Identify the trinomial.');
        steps.push('Step 2: Use the factoring method for trinomials.');
        steps.push(`Factored form for ${poly}: (ax + b)(cx + d).`);

        const factoredForm = `Factored form: (ax + b)(cx + d)`;

        return [factoredForm, steps.join('\n')];
    }
    return ['', 'Failed to factor using Trinomial method.'];
}

function isGreatestCommonFactor(poly) {
    return /\d/.test(poly);
}

function factorGCF(poly) {
    const steps = [];
    steps.push('Step 1: Identify the greatest common factor.');
    steps.push('Step 2: Factor the polynomial using GCF.');

    const factoredForm = `Factored form with GCF: (GCF)(polynomial)`;

    return [factoredForm, steps.join('\n')];
}

function syntheticDivision(poly) {
    const steps = [];
    let factoredForm = '';

    const potentialRoots = [1, -1, 2, -2];
    let factorFound = false;

    for (const root of potentialRoots) {
        const [coeffs, remainder] = syntheticDivisionProcess(poly, root);

        if (remainder === 0) {
            factorFound = true;
            steps.push(`Step 1: Root ${root} found using synthetic division.`);
            steps.push(`Step 2: Perform synthetic division to factor out (x - ${root}).`);
            const quotientPoly = convertToPolynomial(coeffs);
            steps.push(`Step 3: The quotient polynomial is: ${quotientPoly}`);
            factoredForm = `(x - ${root})(${quotientPoly})`;

            const furtherFactors = furtherFactor(quotientPoly);
            if (furtherFactors) {
                factoredForm = `(${factoredForm}) * (${furtherFactors})`;
                steps.push(`Step 4: Further factored form: ${furtherFactors}`);
            }
            break;
        }
    }

    if (!factorFound) {
        steps.push('No roots found using synthetic division. Polynomial might be irreducible with rational factors.');
        factoredForm = 'Unable to factor the polynomial with rational roots.';
    }

    return [factoredForm, steps.join('\n')];
}

function syntheticDivisionProcess(poly, root) {
    const coeffs = poly.match(/-?\d+/g).map(Number);
    const result = [];
    let remainder = coeffs[0];

    for (let i = 1; i < coeffs.length; i++) {
        result.push(remainder);
        remainder = remainder * root + coeffs[i];
    }
    result.push(remainder);
    return [result.slice(0, -1), remainder];
}

function convertToPolynomial(coeffs) {
    return coeffs.map((coeff, index) => {
        if (coeff === 0) return '';
        const sign = coeff > 0 && index > 0 ? '+' : '';
        return `${sign}${coeff}x^${coeffs.length - index - 1}`;
    }).join(' ').replace(/\+ -/, '- ').replace(/\s*x\^0/g, '');
}

function furtherFactor(poly) {
    if (/x\^2/.test(poly)) {
        const [a, b, c] = poly.match(/-?\d+/g).map(Number);
        const discriminant = b * b - 4 * a * c;
        if (discriminant >= 0) {
            const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            return `(x - ${root1})(x - ${root2})`;
        }
    }
    return '';
}