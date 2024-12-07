import { ref, get, child } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import db from './firebase-init.js'


export function submitScore(name, score, competition, timestamp) {
    return new Promise((resolve, reject) => {
      fetch('https://us-central1-oii-leaderboard.cloudfunctions.net/addScore', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, score, competition, timestamp })
      })
      .then(response => response.text())
      .then(data => {
        console.log('score added:', data);
        resolve();
    })
      .catch(error => {
        console.error('Error submitting score:', error)
        reject(error);
    });
    });
  }


export async function fetchLeaderboard(competition) {
    try {
        const response = await fetch(`https://us-central1-oii-leaderboard.cloudfunctions.net/getLeaderboard?competition=${competition}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const leaderboard = await response.json();
        console.log('Leaderboard fetched:', leaderboard);
        return leaderboard;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
}

export async function updateLeaderboard(competition, todayOnly = false, specificDate = null) {
    const tableBody = competition === 'Cemantle' ? document.getElementById('cemantle_leaderboard') : document.getElementById('pedantle_leaderboard');
    const leaderboard = await fetchLeaderboard(competition);
    tableBody.innerHTML = ''; // Clear the current leaderboard

    const filteredLeaderboard = leaderboard.filter(entry => {
        const entryDate = entry.timestamp;
        if (specificDate) {
            return entryDate === specificDate;
        }
        if (todayOnly) {
            const today = new Date().toISOString().split('T')[0];
            return today === entryDate;
        }
        return true;
    });

    // Sort the leaderboard by score in descending order
    filteredLeaderboard.sort((a, b) => b.score - a.score).reverse();
    // Add each entry to the table
    filteredLeaderboard.forEach((entry, index) => {
        if (index >= 10) return; // Only show the top 10 entries
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
            <td>${entry.timestamp}</td>
        `;
        tableBody.appendChild(row);
    });
}

export function sortTable(column, currentSortOrder, currentSortColumn) {
    if (currentSortColumn === column) {
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortColumn = column;
        currentSortOrder = 'asc';
    }
    updateAverageScores(currentSortOrder, currentSortColumn);
    updateSortArrows(currentSortOrder, currentSortColumn);
    return { currentSortOrder, currentSortColumn };
}

function updateSortArrows(currentSortOrder, currentSortColumn) {
    const headers = document.querySelectorAll('th');
    headers.forEach(header => {
        const arrow = header.querySelector('.sort-arrow');
        if (arrow) {
            if (header.id.includes(currentSortColumn)) {
                arrow.classList.remove('asc', 'desc');
                arrow.classList.add(currentSortOrder);
            } else {
                arrow.classList.remove('asc', 'desc');
            }
        }
    });
}

export async function updateAverageScores(currentSortOrder, currentSortColumn) {
    const cemantleLeaderboard = await fetchLeaderboard('Cemantle');
    const pedantleLeaderboard = await fetchLeaderboard('Pedantle');

    const userStats = {};

    // Process Cemantle leaderboard
    cemantleLeaderboard.forEach(entry => {
        if (!userStats[entry.name]) {
            userStats[entry.name] = { cemantle: [], pedantle: [] };
        }
        userStats[entry.name].cemantle.push(entry.score);
    });

    // Process Pedantle leaderboard
    pedantleLeaderboard.forEach(entry => {
        if (!userStats[entry.name]) {
            userStats[entry.name] = { cemantle: [], pedantle: [] };
        }
        userStats[entry.name].pedantle.push(entry.score);
    });

    // Calculate averages and counts
    const averageScores = Object.keys(userStats).map(name => {
        const cemantleScores = userStats[name].cemantle;
        const pedantleScores = userStats[name].pedantle;
        const avgCemantle = cemantleScores.length ? (cemantleScores.reduce((a, b) => a + b, 0) / cemantleScores.length).toFixed(2) : 0;
        const avgPedantle = pedantleScores.length ? (pedantleScores.reduce((a, b) => a + b, 0) / pedantleScores.length).toFixed(2) : 0;
        return {
            name,
            avgCemantle,
            avgPedantle,
            submissionsCemantle: cemantleScores.length,
            submissionsPedantle: pedantleScores.length
        };
    });

    // Sort the averageScores array based on the currentSortColumn and currentSortOrder
    averageScores.sort((a, b) => {
        if (currentSortOrder === 'asc') {
            return a[currentSortColumn] > b[currentSortColumn] ? 1 : -1;
        } else {
            return a[currentSortColumn] < b[currentSortColumn] ? 1 : -1;
        }
    });

    // Render the table
    const tableBody = document.getElementById('average_scores_table');
    tableBody.innerHTML = ''; // Clear the current table

    averageScores.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.avgPedantle}</td>
            <td>${entry.avgCemantle}</td>
            <td>${entry.submissionsPedantle}</td>
            <td>${entry.submissionsCemantle}</td>
        `;
        tableBody.appendChild(row);
    });
}
