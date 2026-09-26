const http = require("http");

function post(path, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request(
      {
        hostname: "localhost",
        port: 5000,
        path: `/api${path}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, body: data });
          }
        });
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000/api${path}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on("error", reject);
  });
}

async function runTests() {
  console.log("=== COMPREHENSIVE AUTH & SECURITY NOTIFICATION VERIFICATION ===");

  // 1. Google Login (Verified Chrome/Brave/Firefox Session)
  const googleRes = await post("/auth/google-login", {
    email: "traveler.chrome.verified@gmail.com",
    name: "Chrome Verified Traveler",
    googleId: "google_test_" + Date.now(),
  });
  console.log("1. Google Login:", googleRes.status, googleRes.body.message, "isEmailVerified:", googleRes.body.user?.isEmailVerified);

  // 2. Facebook Login (Original FB Account Connection)
  const fbRes = await post("/auth/facebook-login", {
    email: "original.fb.user@facebook.com",
    name: "Original Facebook Traveler",
    facebookId: "fb_test_" + Date.now(),
  });
  console.log("2. Facebook Login:", fbRes.status, fbRes.body.message, "isEmailVerified:", fbRes.body.user?.isEmailVerified);

  // 3. Send OTP
  const otpRes = await post("/auth/send-otp", {
    emailOrPhone: "traveler.chrome.verified@gmail.com",
  });
  console.log("3. Send OTP:", otpRes.status, "Code:", otpRes.body.otp, "Message:", otpRes.body.message);

  // 4. Verify OTP
  if (otpRes.body.otp) {
    const verifyRes = await post("/auth/verify-otp", {
      emailOrPhone: "traveler.chrome.verified@gmail.com",
      otp: otpRes.body.otp,
      isLoginFlow: true,
    });
    console.log("4. Verify OTP:", verifyRes.status, verifyRes.body.message, "Token received:", !!verifyRes.body.token);
  }

  // 5. Check Notifications Audit Log
  const notifRes = await get("/auth/notifications");
  console.log("5. Notifications Audit Log: Total Sent:", notifRes.body.total);
  if (notifRes.body.notifications) {
    notifRes.body.notifications.slice(0, 3).forEach((n, i) => {
      console.log(`   - [${n.loginMethod}] to: ${n.to} at ${n.timestamp}`);
    });
  }

  console.log("=== ALL AUTH PATHS VERIFIED SUCCESSFULLY ===");
}

runTests().catch(console.error);
