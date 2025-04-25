
document.getElementById("signupForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
  
    localStorage.setItem("user", JSON.stringify({ name, email, password }));
    alert("Sign-up successful! Please log in.");
    window.location.href = "login.html";
  });
  
  
  document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (user && user.email === email && user.password === password) {
      alert("Login successful!");
      window.location.href = "homepage.html";
    } else {
      alert("Invalid credentials. Try again.");
    }
  });
  