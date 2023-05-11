let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

let currentPlayer = "circle";

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
            let symbol = '';

            if (field === 'circle') {
                symbol = generateAnimatedCircle();
            } else if (field === 'cross') {
                symbol = generateAnimatedCross();
            }

            html += `<td class="field" data-index="${index}" onclick="handleClick(event)">${symbol}</td>`;
        }

        html += '</tr>';
    }

    html += '</table>';

    document.getElementById('content').innerHTML = html;
}

function handleClick(event) {
    const index = event.target.getAttribute('data-index');

    if (fields[index]) {
        return;
    }

    fields[index] = currentPlayer;
    const symbol = currentPlayer === 'circle' ? generateAnimatedCircle() : generateAnimatedCross();
    event.target.innerHTML = symbol;
    event.target.onclick = null;

    const win = checkWin();
    if (win) {
        drawWinLine(win);
    } else {
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    }
}

function checkWin() {
    const winCombos = [        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < winCombos.length; i++) {
        const [a, b, c] = winCombos[i];
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            const combo = winCombos[i];
            drawWinLine(combo);
            return combo;
        }
    }

    return null;
}


let winLine = null;

function drawWinLine(combo) {
    if (winLine) {
      return;
    }
    
    if (combo) {
      // Remove all existing win-line divs from the board
      const board = document.getElementById("content");
      const existingWinLines = board.getElementsByClassName("win-line");
      while (existingWinLines.length > 0) {
        existingWinLines[0].remove();
      }
      
      // Map the indexes to the actual HTML elements
      const comboElements = combo.map(index => fields[index]);
      const startX = comboElements[0].offsetLeft + comboElements[0].offsetWidth / 2;
      const startY = comboElements[0].offsetTop + comboElements[0].offsetHeight / 2;
      const endX = comboElements[comboElements.length - 1].offsetLeft + comboElements[comboElements.length - 1].offsetWidth / 2;
      const endY = comboElements[comboElements.length - 1].offsetTop + comboElements[comboElements.length - 1].offsetHeight / 2;
  
      const line = document.createElement("div");
      line.className = "win-line";
      line.style.top = startY + "px";
      line.style.left = startX + "px";
      const length = Math.sqrt(((endX - startX) * (endX - startX)) + ((endY - startY) * (endY - startY)));
      line.style.width = length + "px";
      line.style.transform = "rotate(" + getAngle(startX, startY, endX, endY) + "deg)";
  
      const boardElement = document.getElementById("content");
      if (boardElement) {
        const boardRect = boardElement.getBoundingClientRect();
        const offsetX = boardRect.left + window.scrollX;
        const offsetY = boardRect.top + window.scrollY;
      
        line.style.top = (startY - offsetY) + "px";
        line.style.left = (startX - offsetX) + "px";
      
        boardElement.appendChild(line);
      } else {
        console.error("Element with ID 'board' not found.");
      }
      
  
      // Here is the code to execute when a win is detected
      disableClick();
      const winner = fields[combo[0]];
      const winnerCombo = checkWin();
      if (winnerCombo) {
        isGameOver = true;
        const winnerSymbol = fields[winnerCombo[0]];
        const winnerMessage = "Player " + winnerSymbol + " wins!";
        alert(winnerMessage);
      }
    }
    
    winLine = line;
  }
  



function disableClick() {
    const cells = document.querySelectorAll(".cell");
    for (let i = 0; i < cells.length; i++) {
      cells[i].removeEventListener("click", handleClick);
    }
  }
  





  function getAngle(x1, y1, x2, y2) {
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    return angle;
}

  




  
  




  function generateAnimatedCircle() {
        const svgCode = /*html*/`
        <svg viewBox="0 0 50 50" width="50px" height="50px">
          <circle class="circle-bg" cx="25" cy="25" r="20"/>
          <circle class="circle-fill" cx="25" cy="25" r="20" fill="transparent"/>
        </svg>
      
        <style>
          .circle-bg {
            fill: none;
            stroke: blue;
            stroke-width: 5;
          }
          .circle-fill {
            fill: blue;
            stroke: red;
            stroke-width: 5;
            stroke-dasharray: 0 100;
            animation: fill-circle 5s linear forwards;
          }
          @keyframes fill-circle {
            from {
              stroke-dasharray: 0 100;
            }
            to {
              stroke-dasharray: 100 100;
              fill-opacity: 0;
            }
          }  
        </style>
        `;
        return svgCode;
      }
      
      
      function generateAnimatedCross() {
        const svgCode = `
          <svg viewBox="0 0 50 50" width="50px" height="50px">
            <line class="cross" x1="10" y1="10" x2="40" y2="40"/>
            <line class="cross" x1="40" y1="10" x2="10" y2="40"/>
            <circle class="fill" cx="25" cy="25" r="20" fill="none" stroke="#000" stroke-width="5" stroke-dasharray="0, 100" stroke-dashoffset="0">
              <animate attributeName="stroke-dashoffset" dur="1.5s" to="100" fill="freeze" />
            </circle>
          </svg>
      
          <style>
            .cross {
              stroke: #000;
              stroke-width: 5;
            }
            
            .fill {
              stroke-dasharray: 100, 100;
              animation: fill 1.5s linear forwards;
            }
            
            @keyframes fill {
              from {
                stroke-dashoffset: 100;
              }
              to {
                stroke-dashoffset: 0;
              }
            }
          </style>
        `;
        
        return svgCode;
      }
  


































// let fields = [
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
// ];

// let currentPlayer = "circle";

// function init() {
//     render();
// }

// function render() {
//     let html = '<table>';

//     for (let i = 0; i < 3; i++) {
//         html += '<tr>';

//         for (let j = 0; j < 3; j++) {
//             const index = i * 3 + j;
//             const field = fields[index];
//             let symbol = '';

//             if (field === 'circle') {
//                 symbol = generateAnimatedCircle();
//             } else if (field === 'cross') {
//                 symbol = generateAnimatedCross();
//             }

//             html += `<td class="field" data-index="${index}" onclick="handleClick(event)">${symbol}</td>`;
//         }

//         html += '</tr>';
//     }

//     html += '</table>';

//     document.getElementById('content').innerHTML = html;
// }

// function handleClick(event) {
//     const index = event.target.getAttribute('data-index');

//     if (fields[index]) {
//         return;
//     }

//     fields[index] = currentPlayer;
//     const symbol = currentPlayer === 'circle' ? generateAnimatedCircle() : generateAnimatedCross();
//     event.target.innerHTML = symbol;
//     event.target.onclick = null;

//     currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle'; //diese zeile ist genauso wie die if-else abfrage hier drunter 
//                                                                      // nur in kurzversion (ternärer operator)
//     // if (currentPlayer === 'circle') {
//     //     currentPlayer = 'cross';
//     //   } else {
//     //     currentPlayer = 'circle';
//     //   }
// }




// function generateAnimatedCircle() {
//     const svgCode = /*html*/`
//     <svg viewBox="0 0 50 50" width="50px" height="50px">
//       <circle class="circle-bg" cx="25" cy="25" r="20"/>
//       <circle class="circle-fill" cx="25" cy="25" r="20" fill="transparent"/>
//     </svg>
  
//     <style>
//       .circle-bg {
//         fill: none;
//         stroke: blue;
//         stroke-width: 5;
//       }
//       .circle-fill {
//         fill: blue;
//         stroke: red;
//         stroke-width: 5;
//         stroke-dasharray: 0 100;
//         animation: fill-circle 5s linear forwards;
//       }
//       @keyframes fill-circle {
//         from {
//           stroke-dasharray: 0 100;
//         }
//         to {
//           stroke-dasharray: 100 100;
//           fill-opacity: 0;
//         }
//       }  
//     </style>
//     `;
//     return svgCode;
//   }
  
  
  
  


//   function generateAnimatedCross() {
//     const svgCode = `
//       <svg viewBox="0 0 50 50" width="50px" height="50px">
//         <line class="cross" x1="10" y1="10" x2="40" y2="40"/>
//         <line class="cross" x1="40" y1="10" x2="10" y2="40"/>
//         <circle class="fill" cx="25" cy="25" r="20" fill="none" stroke="#000" stroke-width="5" stroke-dasharray="0, 100" stroke-dashoffset="0">
//           <animate attributeName="stroke-dashoffset" dur="1.5s" to="100" fill="freeze" />
//         </circle>
//       </svg>
  
//       <style>
//         .cross {
//           stroke: #000;
//           stroke-width: 5;
//         }
        
//         .fill {
//           stroke-dasharray: 100, 100;
//           animation: fill 1.5s linear forwards;
//         }
        
//         @keyframes fill {
//           from {
//             stroke-dashoffset: 100;
//           }
//           to {
//             stroke-dashoffset: 0;
//           }
//         }
//       </style>
//     `;
    
//     return svgCode;
//   }
  
  
  
  
  
