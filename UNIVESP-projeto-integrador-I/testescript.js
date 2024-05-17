document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('task-form');
    const output = document.getElementById('output');
    const studyTimeOutput = document.getElementById('study-time');
    const attentionOutput = document.getElementById('attention');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const subjects = document.getElementById('subject').value.split(',');
        const weights = document.getElementById('weights').value.split(',').map(Number);
        const hours = parseInt(document.getElementById('hours').value);
        const difficulty = document.getElementById('difficulty').value.trim();

        // Armazenar os dados inseridos pelo usuário no armazenamento local
        saveDataToLocalStorage(subjects, weights, hours, difficulty);

        const timeNeeded = calculateStudyTime(subjects, weights, hours);
        const attentionNeeded = subjectsRequiringAttention(timeNeeded, hours);

        displayResults(timeNeeded, attentionNeeded);

        if (difficulty) {
            if (subjects.includes(difficulty)) {
                const updatedHours = hours * 1.2; // Increase available study time by 20% if there's difficulty
                const updatedTimeNeeded = calculateStudyTime(subjects, weights, updatedHours);
                const updatedAttentionNeeded = subjectsRequiringAttention(updatedTimeNeeded, updatedHours);

                displayUpdatedResults(updatedTimeNeeded, updatedAttentionNeeded);
            } else {
                alert('A matéria com maior dificuldade indicada não foi encontrada na lista de matérias cursadas.');
            }
        }

        const now = new Date();
        const scheduleTime = new Date(now.getTime() + (hours * 60 * 60 * 1000) - (15 * 60 * 1000)); // 15 minutos antes
        setTimeout(function() {
            alert('A aula está prestes a começar! Verifique seu planejamento de estudos.');
            checkPerformance(timeNeeded);
        }, scheduleTime - now);
    });

    function saveDataToLocalStorage(subjects, weights, hours, difficulty) {
        const data = {
            subjects: subjects,
            weights: weights,
            hours: hours,
            difficulty: difficulty
        };
        localStorage.setItem('taskData', JSON.stringify(data));
    }

    function calculateStudyTime(subjects, weights, hours) {
        const totalWeights = weights.reduce((acc, curr) => acc + curr, 0);
        const totalTimeAvailable = hours * 60; //Converter horas em minutos
        const timePerWeight = totalTimeAvailable / totalWeights;

        const timeNeeded = {};
        subjects.forEach((subject, index) => {
            timeNeeded[subject] = Math.round(timePerWeight * weights[index]);
        });

        return timeNeeded;
    }

    function subjectsRequiringAttention(timeNeeded, hours) {
        const subjects = Object.keys(timeNeeded);
        const hoursNeeded = Object.values(timeNeeded).map(time => time / 60); //Converter minutos em horas

        const attentionNeeded = [];
        hoursNeeded.forEach((hours, index) => {
            if (hours > hours) {
                attentionNeeded.push(subjects[index]);
            }
        });

        return attentionNeeded;
    }

    function displayResults(timeNeeded, attentionNeeded) {
        studyTimeOutput.innerHTML = '<strong>Tempo de estudo necessário por matéria:</strong><br>';
        attentionOutput.innerHTML = '<strong>Matérias que precisam de mais atenção:</strong><br>';

        Object.keys(timeNeeded).forEach(subject => {
            studyTimeOutput.innerHTML += `${subject}: ${timeNeeded[subject]} minutos<br>`;
        });

        attentionNeeded.forEach(subject => {
            attentionOutput.innerHTML += `${subject}<br>`;
        });

        output.classList.remove('hidden');
    }

    function displayUpdatedResults(timeNeeded, attentionNeeded) {
        const updatedStudyTimeOutput = document.createElement('div');
        const updatedAttentionOutput = document.createElement('div');

        updatedStudyTimeOutput.innerHTML = '<strong>Tempo de estudo necessário por matéria (atualizado):</strong><br>';
        updatedAttentionOutput.innerHTML = '<strong>Matérias que precisam de mais atenção (atualizado):</strong><br>';

        Object.keys(timeNeeded).forEach(subject => {
            updatedStudyTimeOutput.innerHTML += `${subject}: ${timeNeeded[subject]} minutos<br>`;
        });

        attentionNeeded.forEach(subject => {
            updatedAttentionOutput.innerHTML += `${subject}<br>`;
        });

        output.appendChild(updatedStudyTimeOutput);
        output.appendChild(updatedAttentionOutput);
    }
    function checkPerformance(timeNeeded) {
        const subjects = Object.keys(timeNeeded);
        let totalMinutesPlanned = 0;
        let totalMinutesStudied = 0;

        subjects.forEach(subject => {
            totalMinutesPlanned += timeNeeded[subject];
            const minutesStudied = parseInt(prompt(`Quantos minutos você estudou de ${subject}?`));
            totalMinutesStudied += minutesStudied;
        });

        const percentageCompleted = (totalMinutesStudied / totalMinutesPlanned) * 100;
        alert(`Você estudou ${percentageCompleted.toFixed(2)}% do tempo planejado.`);
    }
});