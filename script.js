// Toggle switch to change theme
document.getElementById("switch").addEventListener("change", function () {
  var tableBody = document.getElementById("tableBody");
  if (!this.checked) {
    document.getElementById("body").style.backgroundColor = "white";
    document.getElementById("head").style.color = "black";
    tableBody.classList.remove("tbodyDark")
    tableBody.classList.add("tbodyLight")

    const elements = document.querySelectorAll(".inrcurrency");
    elements.forEach(element => {
      element.style.backgroundColor = "rgb(248,249,250)";
      element.style.color = "black"
    });

  }
  else {
    document.getElementById("body").style.backgroundColor = "rgb(25,29,40)";
    document.getElementById("head").style.color = "white";


    tableBody.classList.remove("tbodyLight")
    tableBody.classList.add("tbodyDark")

    const elements = document.querySelectorAll(".inrcurrency");
    elements.forEach(element => {
      element.style.backgroundColor = "rgb(46,50,65)";
      element.style.color = "white"
    });
  }
})


// 60 seconds Timer
const FULL_DASH_ARRAY = 283;
const COLOR_CODES = {
  info: {
    color: "green"
  },
};

const TIME_LIMIT = 60;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
  timeLeft
)}</span>
</div>
`;

startTimer();

function startTimer() {
  timerInterval = setInterval(() => {

    timeLeft = TIME_LIMIT - timePassed;
    timePassed += 1;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();

    if (timeLeft === 0) {
      timePassed = 0;
      var x = document.getElementById("type").value;
      getTypeDetails(x)
    }
  }, 1000);
}

function formatTime(time) {
  let seconds = (time == TIME_LIMIT) ? TIME_LIMIT : (time % TIME_LIMIT);
  seconds = `${seconds}`;


  return `${seconds}`;
}



function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

let button = document.createElement('button');
let para = document.createElement('p');
// Onloading of page
function onLoad() {
  changeType();

  var tableBody = document.getElementById("tableBody");
  tableBody.classList.remove("tbodyLight")
  tableBody.classList.add("tbodyDark")
}

// Onchange of Cryptocurrency
function changeType() {
  var x = document.getElementById("type").value;
  let buttonContainer = document.getElementById("Buy-Button");
  button.textContent = `BUY ${x.toUpperCase()}`;
  button.className = "inrcurrency";
  buttonContainer.appendChild(button);
  let paraContainer = document.getElementById("price");
  para.textContent = `Average ${x.toUpperCase()}/INR net price including commission`;
  para.style.color = "rgb(112,114,121)";
  para.className = 'avgPrice'
  paraContainer.appendChild(para);
  getTypeDetails(x)
}


function getTypeDetails(x) {
  fetch(`http://localhost:3000/${x}`)
    .then((response) => response.json())
    .then(data => {
      const tableBody = document.getElementById('tableBody');
      tableBody.innerHTML = '';

      let tableRows = data.map((row, i) => `
            <tr class="trClass">
                <th scope="row">${i + 1}</th>
                <td id="warix">WazirX</td>
                <td id="name">${row.name}</td>
                <td id="last">${row.last}</td>
                <td id="buy">${row.buy}/${row.sell}</td>
                <td id="volume">${parseFloat(row.volume).toFixed(3)}</td>
                <td id="base_unit">${row.base_unit}</td>
            </tr>
        `).join('');

      tableBody.innerHTML = tableRows;
    })
}
