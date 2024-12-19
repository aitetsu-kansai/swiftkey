const typeOfPrinting = document.getElementById('printing-line')
const timerType = document.getElementById('type-time')
const wordType = document.getElementById('type-word')
const timer = document.querySelector('.timer')
const timerLeftTime = document.getElementById('time-left')
const wordCount = document.querySelector('.word-count')
const wordCounter = document.getElementById('word-counter')
const textArea = document.getElementById('text-area')
const inputField = document.getElementById('input-area')
const textContainer = document.getElementById('text-container')
const resetButton = document.getElementById('reset')
const resetButtonRes = document.getElementById('reset-result')
const mainBox = document.getElementById('main-content-box')
const resultsPopup = document.getElementById('results')
const wpmRes = document.getElementById('wpm-span')
const epmRes = document.getElementById('emp-span')
const mistakesRes = document.getElementById('mistakes-span')
const themes = document.getElementById('nav-themes')
const settings = document.getElementById('nav-settings')
let charIndex = (mistakes = isTyping = 0)
let gameTimer
let maxTime = 60
let timeLeft = maxTime
let secondsElapsed = 0
const scrollPositions = {
	130: 50,
	260: 90,
	350: 270,
}

function addRandomWords() {
	fetch('https://random-word-api.herokuapp.com/word?number=50')
		.then(response => response.json())
		.then(data => {
			const words = data.join(' ')
			words.split('').forEach(element => {
				let span = `<span>${element}</span>`
				textArea.innerHTML += span
				textArea.querySelectorAll('span')[0].classList.add('active')
				document.addEventListener('keydown', () => inputField.focus())
			})
		})
		.catch(err => {
			let span = `<span>${err.message} data from API, please try later</span>`
			return (textArea.innerHTML += span)
			console.log()
		})
}

document.addEventListener('DOMContentLoaded', addRandomWords)

function typingText() {
	let elements = textArea.querySelectorAll('span')
	let typedElement = inputField.value.split('')[charIndex]
	console.log(elements.length)

	try {
		if (isTyping === 0 && timer.classList.contains('active')) {
			gameTimer = setInterval(timerInit, 1000)
			isTyping = 1
		}

		if (isTyping === 0 && wordCount.classList.contains('active')) {
			gameTimer = setInterval(timerInit, 1000)
			isTyping = 1
		}
		if (wordCount.classList.contains('active')) {
			wordCounter.textContent = `${inputField.value.split(' ').length - 1}`
		}

		if (typedElement == null) {
			if (charIndex > 0) {
				charIndex--
				if (elements[charIndex].classList.contains('incorrect')) {
					mistakes--
				}
				elements[charIndex].classList.remove('correct', 'incorrect')
			}
		} else {
			if (elements[charIndex].innerText == typedElement) {
				elements[charIndex].classList.add('correct')
			} else {
				mistakes++
				elements[charIndex].classList.add('incorrect')
			}
			charIndex++
		}

		if (scrollPositions[charIndex] !== undefined) {
			textContainer.scrollTop = scrollPositions[charIndex]
		}

		elements.forEach(span => span.classList.remove('active'))
		elements[charIndex].classList.add('active')
	} catch {
		getResult()
	}
}

typeOfPrinting.addEventListener('click', event => {
	if (event.target == wordType) {
		textArea.innerHTML = ``
		resetGame()
		wordCount.classList.add('active')
		timer.classList.remove('active')
	}
	if (event.target == timerType) {
		textArea.innerHTML = ``
		resetGame()
		wordCount.classList.remove('active')
		timer.classList.add('active')
	}
})

function getResult() {
	inputField.setAttribute('readonly', 'true')
	mainBox.classList.add('blur')
	resultsPopup.classList.add('visible')
	timer.classList.contains('active')
	// ? (wpmRes.textContent = `${Math.round(
	// 		((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60
	//   )}`)
	// : (wpmRes.textContent = `${
	// 		(Math.round(charIndex - mistakes) / 5 / secondsElapsed) * 60
	//   }`)

	if (timer.classList.contains('active')) {
		wpmRes.textContent = `${Math.round(
			((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60
		)}`
		epmRes.textContent = `${document.querySelectorAll('.correct').length}`
	}
	if (wordCount.classList.contains('active')) {
		wpmRes.textContent = `${Math.round(
			((charIndex - mistakes) / 5 / secondsElapsed) * 60
		)}`
		epmRes.textContent = `${Math.round(
			document.querySelectorAll('.correct').length / (secondsElapsed / 60)
		)}`
	}
	mistakesRes.textContent = `${document.querySelectorAll('.incorrect').length}`
}

function timerInit() {
	if (timer.classList.contains('active')) {
		if (timeLeft > 0) {
			console.log(timeLeft)
			timeLeft--
			timerLeftTime.textContent = timeLeft
		} else {
			clearInterval(gameTimer)
			getResult()
		}
	}
	if (wordCount.classList.contains('active')) {
		if (inputField.value.split(' ').length <= 50) {
			secondsElapsed++
		} else {
			clearInterval(gameTimer)
			getResult()
		}
	}
}

function resetGame() {
	addRandomWords()
	inputField.removeAttribute('readonly')
	clearInterval(gameTimer)
	mainBox.classList.remove('blur')
	resultsPopup.classList.remove('visible')
	charIndex = mistakes = isTyping = 0
	inputField.value = ``
	timeLeft = maxTime
	textArea.innerHTML = ``
	wordCounter.innerHTML = `0`
	timerLeftTime.innerHTML = timeLeft
}

function resetGameKey(event) {
	if (event.key == 'Enter') {
		resetGame()
	}
}

resetButton.addEventListener('click', resetGame)
resetButton.addEventListener('keydown', resetGameKey)

document.addEventListener('keydown', () => {
	inputField.focus()
})

inputField.addEventListener('input', typingText)

resetButtonRes.addEventListener('click', resetGame)

function alertComingSoon() {
	alert('Coming soon!')
}
themes.onclick = alertComingSoon
settings.onclick = alertComingSoon
