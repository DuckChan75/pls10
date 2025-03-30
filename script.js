document.addEventListener('DOMContentLoaded', function() {
    const options = document.querySelectorAll('.option');
    const voteBtn = document.querySelector('.vote-btn');
    const resultsSection = document.querySelector('.results');
    const thankYouSection = document.querySelector('.thank-you');
    const viewResultsBtn = document.getElementById('view-results');
    const captchaContainer = document.getElementById('captcha-container');

    // CAPTCHA elements
    const rotatableImage = document.getElementById('rotatable-image');
    const rotateBtn = document.getElementById('rotate-btn');
    const verifyBtn = document.getElementById('verify-btn');
    const captchaMessage = document.getElementById('captcha-message');

    let selectedOption = null;
    let currentRotation = 0;
    const voteCounts = [0, 0, 0]; // For stickers, gifts, no NFTs
    const totalVotes = 100; // Simulated total votes for demo
    let captchaVerified = false;

    // Possible starting rotations (90, 180, 270 degrees)
    const initialRotations = [90, 180, 270];

    // Randomize initial vote counts for demo
    voteCounts[0] = Math.floor(Math.random() * 40) + 20;
    voteCounts[1] = Math.floor(Math.random() * 40) + 20;
    voteCounts[2] = totalVotes - voteCounts[0] - voteCounts[1];

    // Initialize CAPTCHA with random rotation
    function initCaptcha() {
        currentRotation = initialRotations[Math.floor(Math.random() * initialRotations.length)];
        rotatableImage.style.transform = `rotate(${currentRotation}deg)`;
        captchaMessage.textContent = '';
        captchaVerified = false;
        voteBtn.disabled = true;
    }

    // Option selection
    options.forEach(option => {
        option.addEventListener('click', function() {
            options.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedOption = this.dataset.option;

            // Show CAPTCHA only when an option is selected
            captchaContainer.style.display = 'block';
            initCaptcha();
        });
    });

    // Rotate button
    rotateBtn.addEventListener('click', function() {
        currentRotation = (currentRotation + 90) % 360;
        rotatableImage.style.transform = `rotate(${currentRotation}deg)`;
        captchaMessage.textContent = '';
        captchaMessage.classList.remove('success', 'error');
    });

    // Verify button
    verifyBtn.addEventListener('click', function() {
        if (currentRotation === 0) {
            captchaVerified = true;
            captchaMessage.textContent = 'Verification successful! You can now vote.';
            captchaMessage.classList.add('success');
            captchaMessage.classList.remove('error');
            voteBtn.disabled = false;
        } else {
            captchaVerified = false;
            captchaMessage.textContent = 'Please rotate the image to the correct position (upright)';
            captchaMessage.classList.add('error');
            captchaMessage.classList.remove('success');
            voteBtn.disabled = true;
        }
    });

    // Vote button
    voteBtn.addEventListener('click', function() {
        if (!selectedOption || !captchaVerified) return;

        // In a real app, you would send this to a server
        voteCounts[selectedOption - 1]++;

        // Create confetti effect
        createConfetti();

        // Hide voting interface and CAPTCHA
        document.querySelector('.options').style.display = 'none';
        voteBtn.style.display = 'none';
        captchaContainer.style.display = 'none';

        // Show thank you message
        thankYouSection.style.display = 'block';
    });

    // View results button
    viewResultsBtn.addEventListener('click', function() {
        thankYouSection.style.display = 'none';
        updateResults();
        resultsSection.style.display = 'block';
    });

    // Update results display
    function updateResults() {
        const percentages = [
            Math.round((voteCounts[0] / totalVotes) * 100),
            Math.round((voteCounts[1] / totalVotes) * 100),
            Math.round((voteCounts[2] / totalVotes) * 100)
        ];

        document.querySelectorAll('.percentage').forEach((span, index) => {
            span.textContent = `${percentages[index]}%`;
        });

        document.querySelector('.progress-1').style.width = `${percentages[0]}%`;
        document.querySelector('.progress-2').style.width = `${percentages[1]}%`;
        document.querySelector('.progress-3').style.width = `${percentages[2]}%`;
    }

    // Confetti effect
    function createConfetti() {
        const colors = ['#6e45e2', '#88d3ce', '#ff758c', '#4facfe', '#00f2fe', '#ff7eb3'];

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 10 + 5}px`;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
});
