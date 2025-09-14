from fastapi import FastAPI, Request, Form, Response
from fastapi.responses import RedirectResponse, JSONResponse, StreamingResponse, FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from starlette.middleware.cors import CORSMiddleware
from passlib.hash import bcrypt
from database import users_collection
import smtplib
from email.mime.text import MIMEText
import random, os,uuid
import logging

from dotenv import load_dotenv
load_dotenv()




# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Resume Builder API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Session middleware
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET_KEY"),
    max_age=7200
)
# Static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")



# Temporary OTP store (in production, use Redis or database)
otp_store = {}
reset_tokens = {}



# Email Configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

# ----------------- HOME PAGE -----------------
@app.get("/")
async def home(request: Request):
    """Render the home page with login/signup forms"""
    flash_message = request.session.pop("flash", None)
    return templates.TemplateResponse("home.html", {
        "request": request,
        "flash": flash_message
    })

# ----------------- OTP SENDING -----------------
@app.post("/send-otp")
async def send_otp(request: Request):
    """Send OTP to user's email for verification"""
    try:
        data = await request.json()
        email = data.get("email")
        
        if not email:
            return JSONResponse({"success": False, "message": "Email is required"})
        
        # Generate 4-digit OTP
        otp = str(random.randint(1000, 9999))
        otp_store[email] = otp
        
        # Create email message
        msg = MIMEText(f"""
        Hello!
        
        Your OTP for Cheems Resume signup is: {otp}
        
        This OTP is valid for 10 minutes.
        
        If you didn't request this, please ignore this email.
        
        Best regards,
        <strong>Cheems Resume Team</strong>
        """)
        msg["Subject"] = "Cheems Resume  - Email Verification OTP"
        msg["From"] = EMAIL_USER
        msg["To"] = email

        # Send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_USER, email, msg.as_string())

        logger.info(f"OTP sent successfully to {email}")
        return JSONResponse({"success": True, "message": "OTP sent to your email!"})
        
    except Exception as e:
        logger.error(f"Error sending OTP: {str(e)}")
        return JSONResponse({"success": False, "message": "Failed to send OTP. Please try again."})

# ----------------- USER SIGNUP -----------------
@app.post("/signup")
async def signup(
    request: Request,
    fullname: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    password: str = Form(...),
    confirm_password: str = Form(...),
    otp: str = Form(...)
):
    """Handle user registration with OTP verification"""
    try:
        # Validate password match
        if password != confirm_password:
            request.session["flash"] = "Passwords do not match!"
            return RedirectResponse(url="/", status_code=303)

        # Validate OTP
        if otp_store.get(email) != otp:
            request.session["flash"] = "Invalid or expired OTP!"
            return RedirectResponse(url="/", status_code=303)

        # Check if user already exists
        existing_user = await users_collection.find_one({"$or": [{"email": email}, {"phone": phone}]})
        if existing_user:
            request.session["flash"] = "User already exists with this email or phone!"
            return RedirectResponse(url="/", status_code=303)

        # Hash password and create user
        hashed_pw = bcrypt.hash(password)
        user_data = {
            "fullname": fullname,
            "email": email,
            "phone": phone,
            "password": hashed_pw,
            "created_at": "2024-01-01",  # You can use datetime.now()
            "is_active": True
        }
        
        await users_collection.insert_one(user_data)

        # Clean up OTP
        otp_store.pop(email, None)

        logger.info(f"New user registered: {email}")
        request.session["flash"] = "Signup successful! Please login."
        return RedirectResponse(url="/", status_code=303)
        
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        request.session["flash"] = "Registration failed. Please try again."
        return RedirectResponse(url="/", status_code=303)

# ----------------- USER LOGIN -----------------
@app.post("/login")
async def login(request: Request, email: str = Form(...), password: str = Form(...)):
    """Handle user login"""
    try:
        user = await users_collection.find_one({"email": email})
        
        if user and bcrypt.verify(password, user["password"]):
            request.session["user"] = email
            request.session["fullname"] = user["fullname"]
            request.session["user_id"] = str(user["_id"])
            request.session["phone"] = user.get("phone", "N/A")
            request.session["created_at"] = user.get("created_at", "N/A")   

            logger.info(f"User logged in: {email}")
            return RedirectResponse(url="/", status_code=302)

        request.session["flash"] = "Invalid email or password!"
        return RedirectResponse(url="/", status_code=303)
        
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        request.session["flash"] = "Login failed. Please try again."
        return RedirectResponse(url="/", status_code=303)

# ----------------- USER LOGOUT -----------------
@app.post("/logout")
async def logout(request: Request):
    """Handle user logout"""
    email = request.session.get("user")
    request.session.clear()
    
    if email:
        logger.info(f"User logged out: {email}")
    
    return RedirectResponse(url="/", status_code=303)


@app.get("/get-started")
async def get_started(request: Request):
    if "user" not in request.session:
        request.session["flash"] = "Please login or signup to continue!"
        print("FLASH SET ->", request.session["flash"])   # Debug print
        return RedirectResponse(url="/", status_code=303)

    return RedirectResponse(url="/template_page", status_code=302)




#----------------TEMPLETES-----------------------

@app.get("/template_page")
async def template_page(request: Request):
    """Render template selection page after login"""
    if "user" not in request.session:
        return RedirectResponse(url="/", status_code=303)

    return templates.TemplateResponse("template_page.html", {
        "request": request,
        "user": request.session.get("fullname", "User")
    })

# ----------------- RESUME FORM PAGE -----------------
@app.get("/form")
async def form_page(request: Request, template: str = "1"):
    """Render the resume form page (protected route with selected template)"""
    if "user" not in request.session:
        return RedirectResponse(url="/", status_code=303)

    return templates.TemplateResponse("form.html", {
        "request": request,
        "user": request.session.get("fullname", "User"),
        "template": template
    })

#-----------------froget password---------------
@app.post("/forgot-password")
async def forgot_password(request: Request, email: str = Form(...)):
    user = await users_collection.find_one({"email": email})
    if not user:
        request.session["flash"] = "❌ User not found with this email."
        return RedirectResponse(url="/", status_code=303)

    # Generate reset token
    token = str(uuid.uuid4())
    reset_tokens[token] = email

    reset_link = f"http://127.0.0.1:8000/reset-password/{token}"

    # ✅ Email send karo
    try:
        msg = MIMEText(f"""
        Hello {user['fullname']},

        You requested a password reset.
        Click the link below to reset your password:

        {reset_link}

        If you didn’t request this, ignore this email.
        """)
        msg["Subject"] = "Password Reset - Cheems Resume"
        msg["From"] = EMAIL_USER
        msg["To"] = email

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_USER, email, msg.as_string())

        request.session["flash"] = "✅ Password reset link sent to your email."
    except Exception as e:
        request.session["flash"] = f"❌ Email error: {str(e)}"

    return RedirectResponse(url="/", status_code=303)
@app.get("/reset-password/{token}", response_class=HTMLResponse)
async def reset_password_page(request: Request, token: str):
    if token not in reset_tokens:
        request.session["flash"] = "❌ Invalid or expired reset link."
        return RedirectResponse(url="/", status_code=303)
    return templates.TemplateResponse("reset_password.html", {"request": request, "token": token})

@app.post("/reset-password/{token}")
async def reset_password(request: Request, token: str, password: str = Form(...), confirm_password: str = Form(...)):
    if token not in reset_tokens:
        request.session["flash"] = "❌ Invalid or expired reset link."
        return RedirectResponse(url="/", status_code=303)

    if password != confirm_password:
        request.session["flash"] = "❌ Passwords do not match."
        return RedirectResponse(url=f"/reset-password/{token}", status_code=303)

    email = reset_tokens.pop(token)
    hashed_pw = bcrypt.hash(password)
    await users_collection.update_one({"email": email}, {"$set": {"password": hashed_pw}})
    
    request.session["flash"] = "✅ Password reset successful. Please login."
    return RedirectResponse(url="/", status_code=303)


#-----delete account--------
@app.post("/delete-account")
async def delete_account(request: Request, password: str = Form(...)):
    email = request.session.get("user")

    if not email:
        request.session["flash"] = "You need to log in first."
        return RedirectResponse("/login", status_code=303)

    user = users.find_one({"email": email})
    if not user or not bcrypt.verify(password, user["password"]):
        request.session["flash"] = "Incorrect password."
        return RedirectResponse("/", status_code=303)

    # delete user
    users.delete_one({"email": email})
    request.session.clear()

    request.session["flash"] = "Your account has been deleted."
    return RedirectResponse("/", status_code=303)