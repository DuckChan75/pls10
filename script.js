:root {
    --primary: #6e45e2;
    --secondary: #88d3ce;
    --dark: #2a2a2a;
    --light: #f8f9fa;
    --success: #28a745;
    --danger: #dc3545;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.container {
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 600px;
    padding: 40px;
    text-align: center;
    animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Voting options styling */
.options {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 30px;
}

.option {
    background-color: white;
    border-radius: 15px;
    padding: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid #eee;
}

.option:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    border-color: var(--primary);
}

.option.selected {
    border-color: var(--primary);
    background-color: rgba(110, 69, 226, 0.05);
}

/* CAPTCHA styles */
#captcha-container {
    background-color: white;
    padding: 25px;
    border-radius: 15px;
    border: 2px solid #eee;
    margin: 30px 0;
    display: none;
}

.captcha-image-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
}

#rotatable-image {
    width: 150px;
    height: 150px;
    object-fit: contain;
    border: 2px solid #eee;
    border-radius: 10px;
    transition: transform 0.3s ease;
}

.captcha-controls {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 20px;
}

.captcha-btn {
    background-color: var(--primary);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.captcha-btn:hover {
    background-color: #5d35c9;
    transform: translateY(-2px);
}

#captcha-message {
    color: var(--danger);
    font-weight: 500;
    min-height: 20px;
    margin-top: 10px;
}

#captcha-message.success {
    color: var(--success);
}

/* Results section */
.results {
    margin-top: 40px;
    display: none;
}

.result-item {
    margin-bottom: 15px;
}

.result-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-weight: 500;
}

.progress-bar {
    height: 10px;
    background-color: #eee;
    border-radius: 5px;
    overflow: hidden;
}

.progress {
    height: 100%;
    border-radius: 5px;
    transition: width 1s ease-in-out;
}

.progress-1 { background: linear-gradient(to right, var(--primary), #9d65c9); }
.progress-2 { background: linear-gradient(to right, #4facfe, #00f2fe); }
.progress-3 { background: linear-gradient(to right, #ff758c, #ff7eb3); }

.vote-count {
    font-size: 0.9rem;
    color: #666;
    margin-top: 5px;
    text-align: right;
}

.total-voters {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 2px solid var(--primary);
    font-weight: bold;
    color: var(--primary);
}

/* Buttons */
.vote-btn {
    background: linear-gradient(to right, var(--primary), var(--secondary));
    color: white;
    border: none;
    padding: 15px 40px;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(110, 69, 226, 0.4);
}

.vote-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(110, 69, 226, 0.6);
}

.vote-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

/* Thank you message */
.thank-you {
    display: none;
    animation: fadeIn 1s ease-out;
}

/* Responsive design */
@media (max-width: 600px) {
    .container {
        padding: 30px 20px;
    }
    .option {
        padding: 20px;
    }
    .captcha-controls {
        flex-direction: column;
        align-items: center;
    }
    .captcha-btn {
        width: 100%;
        max-width: 200px;
    }
}
