const calculateBmi = (height: number, mass: number): string => {
    let result = mass / (height / 100) ** 2;
    if (result < 18.5) {
        return('underweight');
    }
    else if (result >= 18.5 && result <= 24.9) {
        return('Normal (healthy weight)');
    }
    else if (result < 24.9) {
        return('overweight');
    }
}

console.log(calculateBmi(180, 74));