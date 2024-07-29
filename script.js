document.addEventListener('DOMContentLoaded', (event) => {
    const numberInputs = document.querySelectorAll('.calculator-input');
    const capitalGainsTaxCheckbox = document.getElementById('capital-gains-tax-checkbox');
    
    numberInputs.forEach(input => {
        input.addEventListener('input', formatAndCalculate);
    });
    
    capitalGainsTaxCheckbox.addEventListener('change', () => {
        const capitalGainsTaxSection = document.getElementById('capital-gains-tax-section');
        if (capitalGainsTaxCheckbox.checked) {
            capitalGainsTaxSection.style.display = 'block';
        } else {
            capitalGainsTaxSection.style.display = 'none';
            document.getElementById('capital-gains-tax').value = '';
        }
        calculateNetProfit();
    });

    fetchInterestRate();

    function formatAndCalculate() {
        formatInput(this);
        calculateNetProfit();
    }

    function formatInput(input) {
        let value = input.value.replace(/,/g, '');
        if (input.id.includes('interest') || input.id.includes('percentage')) {
            input.value = formatPercentage(value.replace('%', ''));
        } else {
            input.value = formatNumber(value);
        }
    }

    function parseNumber(value) {
        return parseFloat(value.replace(/,/g, '')) || 0;
    }

    function parsePercentage(value) {
        return (parseFloat(value.replace('%', '')) || 0) / 100;
    }

    function formatNumber(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function formatPercentage(value) {
        return value + '%';
    }

    function calculateNetProfit() {
        const purchasePrice = parseNumber(document.getElementById('purchase-price').value);
        const appraisalValue = parseNumber(document.getElementById('appraisal-value').value);
        const financingPercentage = parsePercentage(document.getElementById('financing-percentage').value);
        const mortgageInterest = parsePercentage(document.getElementById('mortgage-interest').value);
        const mortgageYears = parseNumber(document.getElementById('mortgage-years').value);
        const salePrice = parseNumber(document.getElementById('sale-price').value);
        const holdingMonths = parseNumber(document.getElementById('holding-months').value);
        const brokerageFee = parseNumber(document.getElementById('brokerage-fee').value);
        const rentalBrokerageFee = parseNumber(document.getElementById('rental-brokerage-fee').value);
        const renovationCost = parseNumber(document.getElementById('renovation-cost').value);
        const privateAppraisal = parseNumber(document.getElementById('private-appraisal').value);
        const homeInspection = parseNumber(document.getElementById('home-inspection').value);
        const legalFees = parseNumber(document.getElementById('legal-fees').value);
        const licensingCosts = parseNumber(document.getElementById('licensing-costs').value);
        const mortgageAdvisorFee = parseNumber(document.getElementById('mortgage-advisor-fee').value);
        const mortgageFileOpeningFee = parseNumber(document.getElementById('mortgage-file-opening-fee').value);
        const purchaseTax = parseNumber(document.getElementById('purchase-tax').value);

        const mortgageAmount = appraisalValue * financingPercentage;
        const monthlyInterestRate = mortgageInterest / 12;
        const totalPayments = mortgageYears * 12;
        const monthlyMortgagePayment = (mortgageAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));
        const totalMortgagePaid = monthlyMortgagePayment * holdingMonths;

        const totalCosts = purchasePrice + brokerageFee + rentalBrokerageFee + renovationCost + privateAppraisal + homeInspection + legalFees + licensingCosts + mortgageAdvisorFee + mortgageFileOpeningFee + purchaseTax + totalMortgagePaid;
        const profit = salePrice - totalCosts;

        let capitalGainsTax = 0;
        if (capitalGainsTaxCheckbox.checked && holdingMonths < 18) {
            capitalGainsTax = profit * 0.25; // מס שבח 25%
            document.getElementById('capital-gains-tax').value = formatNumber(capitalGainsTax.toFixed(2));
        }

        const netProfit = profit - capitalGainsTax;

        document.getElementById('net-profit').value = formatNumber(netProfit.toFixed(2));
    }

    function fetchInterestRate() {
        fetch('https://api.bankisrael.gov.il/v1/rates/interbank', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const interestRate = data[0].interest_rate.toFixed(2);
            document.getElementById('mortgage-interest').value = formatPercentage(interestRate);
        })
        .catch(error => console.error('Error fetching interest rate:', error));
    }
});
