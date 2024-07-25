import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startButton = document.querySelector('button[data-start]');
startButton.disabled = true;
startButton.addEventListener('click', start);
let futureDate = null;
let interval = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0].getTime();
        if (selectedDate < Date.now()) {
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
                position: 'topCenter',
            });
            return;
        }
        else {
            startButton.disabled = false;
            futureDate = selectedDate;
        }
    },
};

flatpickr(document.querySelector('#datetime-picker'), options);

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

function start() {
    startButton.disabled = true;
    document.querySelector('#datetime-picker').disabled = true;
    moveTimer();
    interval = setInterval(moveTimer, 1000);
}

function moveTimer() {
    let { days, hours, minutes, seconds } = convertMs(
        futureDate - Date.now()
    );

    document.querySelector('span[data-days]').textContent = addLeadingZero(days);
    document.querySelector('span[data-hours]').textContent = addLeadingZero(hours);
    document.querySelector('span[data-minutes]').textContent = addLeadingZero(minutes);
    document.querySelector('span[data-seconds]').textContent = addLeadingZero(seconds);

    if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
        futureDate = null;
        document.querySelector('#datetime-picker').disabled = false;
        clearInterval(interval);
    }
}