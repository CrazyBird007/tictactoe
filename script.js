let fields = [
    null,
    "circle",
    "cross",
    null,
    "circle",
    "circle",
    null,
    "cross",
    null,
];


function init() {
    render();
}


function render() {
    let html = '<table>';

    for (let i = 0; i < 3; i++) {
        html += '<tr>';

        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            const field = fields[index];
            const symbol = field === 'circle' ? 'O' : field === 'cross' ? 'X' : '';

            html += `<td class="${field}">${symbol}</td>`;
        }

        html += '</tr>';
    }

    html += '</table>';

    document.getElementById('content').innerHTML = html;
}

