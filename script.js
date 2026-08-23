const menuToggle = document.querySelector('#menu-toggle');
const navLinks = document.querySelector('#nav-links');
const bookingForm = document.querySelector('#booking-form');
const bookingStatus = document.querySelector('#booking-status');
const arrival = document.querySelector('#arrival');
const departure = document.querySelector('#departure');
const room = document.querySelector('#room');
const guestCount = document.querySelector('#guests');
const today = new Date().toISOString().split('T')[0];

menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

arrival.min = today;
departure.min = today;
arrival.addEventListener('change', () => { departure.min = arrival.value || today; });

bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    bookingStatus.className = 'form-status show';
    if (!arrival.value || !departure.value) {
        bookingStatus.classList.add('error');
        bookingStatus.textContent = 'Please choose both your check-in and check-out dates.';
        return;
    }
    const checkIn = new Date(`${arrival.value}T00:00:00`);
    const checkOut = new Date(`${departure.value}T00:00:00`);
    const nights = Math.round((checkOut - checkIn) / 86400000);
    if (nights < 1) {
        bookingStatus.classList.add('error');
        bookingStatus.textContent = 'Check-out must be at least one night after check-in.';
        return;
    }
    const rates = { garden: 340, sea: 450, villa: 720 };
    const price = rates[room.value] * nights;
    const roomName = room.options[room.selectedIndex].text;
    const reference = `MY-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    bookingStatus.textContent = `Availability found for ${roomName}: ${nights} night${nights === 1 ? '' : 's'}, ${guestCount.value} guest${guestCount.value === '1' ? '' : 's'}. From €${price.toLocaleString()}. Reference ${reference}.`;
});

function setupCarousel(root) {
    const track = root.querySelector('.carousel-track');
    const slides = root.querySelectorAll('.carousel-slide');
    const dots = root.querySelectorAll('.carousel-dot');
    const caption = root.querySelector('.carousel-caption');
    let index = 0;
    let timer;
    const captions = ['Pool mornings at Morya', 'The coast, just beyond the garden', 'A quiet place to take your time', 'Golden hour by the water'];
    function showSlide(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, dotIndex) => {
            const active = dotIndex === index;
            dot.classList.toggle('active', active);
            dot.setAttribute('aria-selected', active);
        });
        caption.textContent = captions[index];
    }
    function restart() { clearInterval(timer); timer = setInterval(() => showSlide(index + 1), 4500); }
    root.querySelector('.prev').addEventListener('click', () => { showSlide(index - 1); restart(); });
    root.querySelector('.next').addEventListener('click', () => { showSlide(index + 1); restart(); });
    dots.forEach((dot, dotIndex) => dot.addEventListener('click', () => { showSlide(dotIndex); restart(); }));
    root.addEventListener('mouseenter', () => clearInterval(timer));
    root.addEventListener('mouseleave', restart);
    root.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') showSlide(index - 1);
        if (event.key === 'ArrowRight') showSlide(index + 1);
        restart();
    });
    restart();
}

document.querySelectorAll('.carousel').forEach(setupCarousel);

const modal = document.querySelector('#amenities-modal');
document.querySelector('#amenities-button').addEventListener('click', () => modal.hidden = false);
document.querySelector('#modal-close').addEventListener('click', () => modal.hidden = true);
modal.addEventListener('click', (event) => { if (event.target === modal) modal.hidden = true; });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') modal.hidden = true; });
