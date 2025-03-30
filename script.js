document.addEventListener('DOMContentLoaded', async function() {
    // DOM elements
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
    
    // Vote counter elements
    const stickersCount = document.getElementById('stickers-count');
    const giftsCount = document.getElementById('gifts-count');
    const noneCount = document.getElementById('none-count');
    const totalVoters = document.getElementById('total-voters');
    
    // Voting state
    let selectedOption = null;
    let currentRotation = 0;
    let captchaVerified = false;
    let hasVoted = false;
    
    // Initialize
    checkVotingStatus();
    initEventListeners();
    
    // Check if user has already voted
    async function checkVotingStatus() {
        try {
            const response = await fetch('/api/votes');
            const data = await response.json();
            
            updateResultsUI(data);
            
            if (document.cookie.includes('voterToken')) {
                disableVoting();
                resultsSection.style.display = 'block';
            }
        } catch (error) {
            console.error('Error checking voting status:', error);
        }
    }
    
    // Initialize event listeners
    function initEventListeners() {
        // Option selection
        options.forEach(option => {
            option.addEventListener('click', function() {
                if (hasVoted) return;
                
                options.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                selectedOption = this.dataset.option;
                
                captchaContainer.style.display = 'block';
                initCaptcha();
            });
        });
        
        // CAPTCHA rotation
        rotateBtn.addEventListener('click', rotateImage);
        
        // CAPTCHA verification
        verifyBtn.addEventListener('click', verifyCaptcha);
        
        // Vote submission
        voteBtn.addEventListener('click', submitVote);
        
        // View results
        viewResultsBtn.addEventListener('click', () => {
            thankYouSection.style.display = 'none';
            resultsSection.style.display = 'block';
        });
    }
    
    // Initialize CAPTCHA
    function initCaptcha() {
        const initialRotations = [90, 180, 270];
        currentRotation = initialRotations[Math.floor(Math.random() * initialRotations.length)];
        rotatableImage.style.transform = `rotate(${currentRotation}deg)`;
        captchaMessage.textContent = '';
        captchaVerified = false;
        voteBtn.disabled = true;
    }
    
    // Rotate CAPTCHA image
    function rotateImage() {
        currentRotation = (currentRotation + 90) % 360;
        rotatableImage.style.transform = `rotate(${currentRotation}deg)`;
        captchaMessage.textContent = '';
        captchaMessage.classList.remove('success', 'error');
    }
    
    // Verify CAPTCHA
    function verifyCaptcha() {
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
    }
    
    // Submit vote to server
    async function submitVote() {
        if (!selectedOption || !captchaVerified || hasVoted) return;
        
        try {
            const voterId = generateVoterId();
            const response = await fetch('/api/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ option: selectedOption, voterId }),
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (data.error) {
                alert(data.error);
                return;
            }
            
            // On successful vote
            createConfetti();
            disableVoting();
            thankYouSection.style.display = 'block';
            updateResultsUI(data);
            
        } catch (error) {
            console.error('Error submitting vote:', error);
            alert('Failed to submit vote. Please try again.');
        }
    }
    
    // Generate unique voter ID
    function generateVoterId() {
        return 'voter_' + Math.random().toString(36).substr(2, 16);
    }
    
    // Disable voting UI
    function disableVoting() {
        hasVoted = true;
        options.forEach(opt => {
            opt.style.opacity = '0.6';
            opt.style.pointerEvents = 'none';
        });
        captchaContainer.style.display = 'none';
        voteBtn.style.display = 'none';
    }
    
    // Update results display
    function updateResultsUI(data) {
        const totalVotes = data.votes.stickers + data.votes.gifts + data.votes.none;
        
        // Update percentages
        const percentages = [
            totalVotes > 0 ? Math.round((data.votes.stickers / totalVotes) * 100) : 0,
            totalVotes > 0 ? Math.round((data.votes.gifts / totalVotes) * 100) : 0,
            totalVotes > 0 ? Math.round((data.votes.none / totalVotes) * 100) : 0
        ];
        
        document.querySelectorAll('.percentage').forEach((span, index) => {
            span.textContent = `${percentages[index]}%`;
        });
        
        // Update progress bars
        document.querySelector('.progress-1').style.width = `${percentages[0]}%`;
        document.querySelector('.progress-2').style.width = `${percentages[1]}%`;
        document.querySelector('.progress-3').style.width = `${percentages[2]}%`;
        
        // Update vote counts
        stickersCount.textContent = `${data.votes.stickers} votes`;
        giftsCount.textContent = `${data.votes.gifts} votes`;
        noneCount.textContent = `${data.votes.none} votes`;
        totalVoters.textContent = data.votes.totalVoters;
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
