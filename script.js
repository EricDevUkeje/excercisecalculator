document.getElementById('calculate-btn').addEventListener('click', calculateCalories);

function toggleCustomExerciseInput() {
    const exercise = document.getElementById('exercise').value;
    const customExerciseInput = document.getElementById('custom-exercise');
    
    if (exercise === 'custom') {
        customExerciseInput.style.display = 'block';
    } else {
        customExerciseInput.style.display = 'none';
    }
}

function calculateCalories() {
    let exercise = document.getElementById('exercise').value;
    const customExercise = document.getElementById('custom-exercise').value;
    const weight = document.getElementById('weight').value;
    const weightUnit = document.getElementById('weight-unit').value;
    let duration = document.getElementById('duration').value;

    const customDuration = document.getElementById('custom-duration').value;
    if (customDuration) {
        duration = customDuration;
    }

    // If custom exercise is selected, use that value instead
    if (exercise === 'custom' && customExercise) {
        exercise = customExercise;
    }

    // Convert weight to kg if it's in lbs
    const weightInKg = weightUnit === 'lb' ? weight * 0.453592 : weight;

    // Call the Nutritionix API to get the calories burned and exercise benefits
    fetch(`https://trackapi.nutritionix.com/v2/natural/exercise`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-app-id': 'ab18fb15',  // Replace with your Nutritionix App ID
            'x-app-key': '413db1803e4c117b023991f9dcea88b4' // Replace with your Nutritionix App Key
        },
        body: JSON.stringify({
            query: `${exercise} for ${duration} minutes`,
            weight_kg: weightInKg
        })
    })
    .then(response => response.json())
    .then(data => {
        const caloriesBurned = data.exercises[0].nf_calories;
        const benefitText = getExerciseBenefits(exercise);

        document.getElementById('calories-burned').textContent = `${caloriesBurned} cal`;
        document.getElementById('exercise-benefit').textContent = benefitText;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function getExerciseBenefits(exercise) {
    const benefits = {
        running: 'Running is great for cardiovascular health and burning fat.',
        swimming: 'Swimming works your whole body and builds muscle endurance.',
        cycling: 'Cycling improves leg strength and endurance.',
        walking: 'Walking is a low-impact exercise that helps maintain overall health.',
        yoga: 'Yoga improves flexibility and mental clarity.',
        weightlifting: 'Weightlifting builds muscle strength and bone density.',
        aerobics: 'Aerobics enhances cardiovascular fitness and burns calories.',
        dancing: 'Dancing is a fun way to improve coordination and burn calories.',
        hiking: 'Hiking strengthens the lower body and improves endurance.',
        rowing: 'Rowing works both upper and lower body muscles.',
        basketball: 'Basketball improves agility and cardiovascular health.',
        tennis: 'Tennis enhances coordination and cardiovascular fitness.',
        'jumping-rope': 'Jumping rope is excellent for cardiovascular health and agility.',
        boxing: 'Boxing improves strength, speed, and endurance.',
        custom: 'Custom exercises have various benefits depending on the intensity and type.'
    };

    return benefits[exercise] || 'This exercise has various health benefits.';
}
