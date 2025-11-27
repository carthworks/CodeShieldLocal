// Hardcoded AWS Key (CRITICAL)
const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";
const AWS_SECRET = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

// SQL Injection (CRITICAL)
function getUser(userId) {
    const query = "SELECT * FROM users WHERE id = " + userId;
    return db.query(query);
}

// XSS Vulnerability (HIGH)
function displayMessage(msg) {
    document.getElementById('output').innerHTML = msg;
}

// Weak Crypto (MEDIUM)
const crypto = require('crypto');
const hash = crypto.createHash('md5').update('password').digest('hex');

// Insecure Random (LOW)
function generateToken() {
    return Math.random().toString(36).substring(7);
}

// Console Logging Sensitive Data (MEDIUM)
console.log("User token:", userToken);
console.log("API key:", apiKey);

// Command Injection (CRITICAL)
const exec = require('child_process').exec;
function runCommand(cmd) {
    exec('ls ' + cmd);
}

// Eval Usage (HIGH)
function calculate(expression) {
    return eval(expression);
}
