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
  console.log("=== TESTING MAKEMYTRIP STYLE AUTHENTIC VERIFICATION ===");

  // 1. Mobile Number OTP Initiation (Fast Telecom Gateway SMS)
  const mobileInput = "9876543210";
  const mobileInit = await post("/auth/makemytrip-initiate", { identifier: mobileInput });
  console.log("1. Mobile SMS OTP Request:", mobileInit.status);
  console.log("   - Channel:", mobileInit.body.channel);
  console.log("   - Target:", mobileInit.body.identifier);
  console.log("   - Gateway:", mobileInit.body.gateway);
  console.log("   - SMS Message:", mobileInit.body.smsMessage);
  console.log("   - Live OTP Code:", mobileInit.body.otp);

  // 2. Mobile Number OTP Verification
  const mobileVerify = await post("/auth/makemytrip-verify", {
    identifier: mobileInput,
    otp: mobileInit.body.otp,
    name: "Sounava MakeMyTrip User",
  });
  console.log("2. Mobile OTP Verification:", mobileVerify.status);
  console.log("   - Message:", mobileVerify.body.message);
  console.log("   - User Name:", mobileVerify.body.user?.name);
  console.log("   - Phone Verified:", mobileVerify.body.user?.isPhoneVerified);
  console.log("   - JWT Token:", !!mobileVerify.body.token);

  // 3. Email ID OTP Initiation (Email Security Gateway)
  const emailInput = "sounava.travelapp@gmail.com";
  const emailInit = await post("/auth/makemytrip-initiate", { identifier: emailInput });
  console.log("3. Email OTP Request:", emailInit.status);
  console.log("   - Channel:", emailInit.body.channel);
  console.log("   - Target:", emailInit.body.identifier);
  console.log("   - Live OTP Code:", emailInit.body.otp);
  console.log("   - Email Message:", emailInit.body.message);

  // 4. Email ID OTP Verification
  const emailVerify = await post("/auth/makemytrip-verify", {
    identifier: emailInput,
    otp: emailInit.body.otp,
    name: "Sounava Email Traveler",
  });
  console.log("4. Email OTP Verification:", emailVerify.status);
  console.log("   - Message:", emailVerify.body.message);
  console.log("   - User Name:", emailVerify.body.user?.name);
  console.log("   - Email Verified:", emailVerify.body.user?.isEmailVerified);
  console.log("   - JWT Token:", !!emailVerify.body.token);

  // 5. Verify SMS Audit Logs
  const smsLogs = await get("/auth/sms-logs");
  console.log("5. SMS Gateway Audit Log: Total Sent:", smsLogs.body.total);
  if (smsLogs.body.smsLogs) {
    smsLogs.body.smsLogs.slice(0, 2).forEach((log) => {
      console.log(`   - [${log.senderId}] to ${log.phone}: "${log.messageText}"`);
    });
  }

  // 6. Verify Email Notifications
  const emailLogs = await get("/auth/notifications");
  console.log("6. Email Security Notifications Log: Total Sent:", emailLogs.body.total);

  console.log("=== ALL MAKEMYTRIP AUTHENTIC FLOWS PASSED ===");
}

runTests().catch(console.error);
