document.addEventListener('DOMContentLoaded', async function() {
    const options = document.querySelectorAll('.option');
    const voteBtn = document.querySelector('.vote-btn');
    const resultsSection = document.querySelector('.results');
    const thankYouSection = document.querySelector('.thank-you');
    const viewResultsBtn = document.getElementById('view-results');
    const captchaError = document.querySelector('.captcha-error');
    
    let selectedOption = null;
    let voteCounts = [0, 0, 0];
    
    // Load initial results
    try {
        const response = await fetch('/api/results');
        const data = await response.json();
        voteCounts = data.voteCounts;
        updateResults();
    } catch (error) {
        console.error("Error loading results:", error);
    }
    
    // Check if user has already voted
    const hasVoted = localStorage.getItem('hasVoted');
    if (hasVoted) {
        document.querySelector('.options').style.display = 'none';
        document.querySelector('.captcha-container').style.display = 'none';
        voteBtn.style.display = 'none';
        resultsSection.style.display = 'block';
    }
    
    // Option selection
    options.forEach(option => {
        option.addEventListener('click', function() {
            if (hasVoted) return;
            
            options.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedOption = this.dataset.option;
            
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
    voteBtn.addEventListener('click', async function() {
        if (!selectedOption) return;
        
        const captchaResponse = grecaptcha.getResponse();
        if (!captchaResponse) {
            captchaError.style.display = 'block';
            return;
        }
        
        try {
            const response = await fetch('/api/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    option: selectedOption,
                    captchaResponse: captchaResponse
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Mark user as voted
                localStorage.setItem('hasVoted', 'true');
                voteCounts = data.voteCounts;
                
                // Create confetti effect
                createConfetti();
                
                // Hide voting interface
                document.querySelector('.options').style.display = 'none';
                document.querySelector('.captcha-container').style.display = 'none';
                voteBtn.style.display = 'none';
                
                // Show thank you message
                thankYouSection.style.display = 'block';
            } else {
                alert("Voting failed: " + (data.error || "Unknown error"));
                grecaptcha.reset();
            }
        } catch (error) {
            console.error("Voting error:", error);
            alert("Error submitting vote");
            grecaptcha.reset();
        }
    });
    
    // View results button
    viewResultsBtn.addEventListener('click', function() {
        thankYouSection.style.display = 'none';
        updateResults();
        resultsSection.style.display = 'block';
    });
    
    // Update results display
    function updateResults() {
        const total = voteCounts.reduce((a, b) => a + b, 0) || 1;
        const percentages = voteCounts.map(count => 
            Math.round((count / total) * 100)
        );
        
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
