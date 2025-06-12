const itemInput = document.getElementById('itemInput');
const addItemButton = document.getElementById('addItemButton');
const shoppingList = document.getElementById('shoppingList');

const departments = {
    Obst: ["apfel", "banane", "birne", "traube"],
    Gemüse: ["karotte", "tomate", "salat", "gurke"],
    Fleisch: ["hühnchen", "rindfleisch", "schwein"],
    Milchprodukte: ["milch", "käse", "joghurt"],
    Bäckerei: ["brot", "brötchen", "croissant"],
    Snacks: ["chips", "schokolade", "gummibärchen"]
};

const itemsByDepartment = {
    Obst: [], Gemüse: [], Fleisch: [], Milchprodukte: [], Bäckerei: [], Snacks: [], Sonstiges: []
};

function levenshtein(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
    return matrix[a.length][b.length];
}

function guessDepartment(item) {
    let bestMatch = "Sonstiges";
    let bestScore = Infinity;
    for (const [department, examples] of Object.entries(departments)) {
        for (const example of examples) {
            const score = levenshtein(item, example);
            if (score < bestScore) {
                bestScore = score;
                bestMatch = department;
            }
        }
    }
    return bestMatch;
}

function addItem() {
    const itemText = itemInput.value.trim().toLowerCase();
    if (itemText) {
        const department = guessDepartment(itemText);
        itemsByDepartment[department].push(itemText);
        itemInput.value = '';
        sortList();
    }
}

function sortList() {
    shoppingList.innerHTML = '';
    for (const department in itemsByDepartment) {
        if (itemsByDepartment[department].length > 0) {
            const departmentHeader = document.createElement('h3');
            departmentHeader.textContent = department;
            shoppingList.appendChild(departmentHeader);

            const sortedItems = itemsByDepartment[department].sort((a, b) => a.localeCompare(b));
            sortedItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.charAt(0).toUpperCase() + item.slice(1);
                shoppingList.appendChild(li);
            });
        }
    }
}

addItemButton.addEventListener('click', addItem);
itemInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addItem();
    }
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker registriert.'));
}
