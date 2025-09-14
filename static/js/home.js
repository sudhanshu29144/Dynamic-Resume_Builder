// ========================
// 🔹 Modal Controls
// ========================
function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}
function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

// ========================
// 🔹 OTP Send Function
// ========================
function sendOtp() {
  let email = document.querySelector("input[name='email']").value;
  if (!email) {
    showMessage("⚠️ Please enter your email first", "error");
    return;
  }

  // Button ko "loading" state me lao
  document.getElementById("otp-spinner").classList.remove("hidden");
  document.getElementById("otp-btn-text").innerText = "Sending...";
  document.getElementById("otp-btn").disabled = true;

  fetch("/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showMessage("✅ OTP sent to your email!", "success");
        document.getElementById("otp-section").classList.remove("hidden");
        document.getElementById("signup-btn").classList.remove("hidden");
        document.getElementById("otp-btn").classList.add("hidden");
      } else {
        showMessage("❌ " + data.message, "error");
      }
    })
    .catch(err => {
      console.error("Error:", err);
      showMessage("❌ Something went wrong!", "error");
    })
    .finally(() => {
      // Button ko wapas normal state me lao
      document.getElementById("otp-spinner").classList.add("hidden");
      document.getElementById("otp-btn-text").innerText = "Send OTP";
      document.getElementById("otp-btn").disabled = false;
    });
}


// ========================
// 🔹 Helper Message Box
// ========================
function showMessage(text, type) {
  let msgBox = document.getElementById("otp-message");
  msgBox.innerText = text;
  msgBox.classList.remove("hidden", "bg-green-100", "text-green-700", "bg-red-100", "text-red-700");

  if (type === "success") {
    msgBox.classList.add("bg-green-100", "text-green-700");
  } else {
    msgBox.classList.add("bg-red-100", "text-red-700");
  }

  setTimeout(() => msgBox.classList.add("hidden"), 3000);
}

// ========================
// 🔹 Password Validation
// ========================
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm_password");
const passwordErrorBox = document.getElementById("password-error");
const confirmPasswordErrorBox = document.getElementById("confirm-password-error");
const signupBtn = document.getElementById("signup-btn");

function validatePassword() {
  let password = passwordInput.value;
  let confirmPassword = confirmPasswordInput.value;

  let strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  let valid = true;

  if (!strongRegex.test(password)) {
    passwordErrorBox.innerText = "❌ Password must be at least 8 chars with uppercase, lowercase, number & special character.";
    passwordErrorBox.classList.remove("hidden");
    valid = false;
  } else {
    passwordErrorBox.classList.add("hidden");
  }

  if (confirmPassword.length > 0 && password !== confirmPassword) {
    confirmPasswordErrorBox.innerText = "❌ Passwords do not match!";
    confirmPasswordErrorBox.classList.remove("hidden");
    valid = false;
  } else {
    confirmPasswordErrorBox.classList.add("hidden");
  }

  if (valid) {
    signupBtn.disabled = false;
    signupBtn.classList.remove("opacity-50", "cursor-not-allowed");
  } else {
    signupBtn.disabled = true;
    signupBtn.classList.add("opacity-50", "cursor-not-allowed");
  }
}

if (passwordInput && confirmPasswordInput) {
  passwordInput.addEventListener("input", validatePassword);
  confirmPasswordInput.addEventListener("input", validatePassword);
}

// ========================
// 🔹 Password Toggle
// ========================




function toggleSignupPassword() {
    let pass = document.getElementById("password");
    let confirm = document.getElementById("confirm_password");
    if (document.getElementById("showSignupPass").checked) {
      pass.type = "text";
      confirm.type = "text";
    } else {
      pass.type = "password";
      confirm.type = "password";
    }
  }

  function toggleLoginPassword() {
    let pass = document.getElementById("login_password");
    pass.type = document.getElementById("showLoginPass").checked ? "text" : "password";
  }

  function openModal(id) {
    const modal = document.getElementById(id).children[0];
    document.getElementById(id).classList.remove("hidden");
    setTimeout(() => {
      modal.classList.remove("scale-95","opacity-0");
      modal.classList.add("scale-100","opacity-100");
    }, 50);
  }

  function closeModal(id) {
    const modal = document.getElementById(id).children[0];
    modal.classList.add("scale-95","opacity-0");
    modal.classList.remove("scale-100","opacity-100");
    setTimeout(() => {
      document.getElementById(id).classList.add("hidden");
    }, 300);
  }




   
