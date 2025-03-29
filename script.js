document.addEventListener('DOMContentLoaded', function() {
    const options = document.querySelectorAll('.option');
    const voteBtn = document.querySelector('.vote-btn');
    const resultsSection = document.querySelector('.results');
    const thankYouSection = document.querySelector('.thank-you');
    const viewResultsBtn = document.getElementById('view-results');
    const captchaError = document.querySelector('.captcha-error');

    let selectedOption = null;
    const voteCounts = [0, 0, 0]; // For stickers, gifts, no NFTs
    const totalVotes = 100; // Simulated total votes for demo

    // Check if user has already voted
    const hasVoted = localStorage.getItem('hasVoted');
    if (hasVoted) {
        document.querySelector('.options').style.display = 'none';
        document.querySelector('.captcha-container').style.display = 'none';
        voteBtn.style.display = 'none';
        updateResults();
        resultsSection.style.display = 'block';
    }

    // Randomize initial vote counts for demo
    voteCounts[0] = Math.floor(Math.random() * 40) + 20;
    voteCounts[1] = Math.floor(Math.random() * 40) + 20;
    voteCounts[2] = totalVotes - voteCounts[0] - voteCounts[1];

    // Option selection
    options.forEach(option => {
        option.addEventListener('click', function() {
            if (hasVoted) return;

            options.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedOption = this.dataset.option;

            // Enable vote button only if CAPTCHA is completed
            if (grecaptcha.getResponse()) {
                voteBtn.disabled = false;
            }
        });
    });

    // CAPTCHA callback
    window.onCaptchaVerified = function(response) {
        captchaError.style.display = 'none';
        if (selectedOption) {
            voteBtn.disabled = false;
        }
    };

    // CAPTCHA expired callback
    window.onCaptchaExpired = function() {
        voteBtn.disabled = true;
    };

    // Vote button
    voteBtn.addEventListener('click', function() {
        if (!selectedOption) return;

        // Verify CAPTCHA
        if (!grecaptcha.getResponse()) {
            captchaError.style.display = 'block';
            return;
        }

        // In a real app, you would send this to a server
        // along with the CAPTCHA response for verification
        // const captchaResponse = grecaptcha.getResponse();
        // Then verify with your secret key: 6Lc39vMrAAAAAEPar4nPCrQxCDoRlcRa7fKrrHap

        voteCounts[selectedOption - 1]++;

        // Mark user as voted
        localStorage.setItem('hasVoted', 'true');

        // Create confetti effect
        createConfetti();

        // Hide voting interface
        document.querySelector('.options').style.display = 'none';
        document.querySelector('.captcha-container').style.display = 'none';
        voteBtn.style.display = 'none';

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
