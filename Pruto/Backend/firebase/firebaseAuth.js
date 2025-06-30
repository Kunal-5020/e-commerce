// // File: Pruto/Backend/firebase/firebaseAuth.js

const { createUserWithEmailAndPassword, sendEmailVerification,signInWithEmailAndPassword,sendPasswordResetEmail,signInWithPopup } = require("firebase/auth");
const { auth, googleProvider, RecaptchaVerifier, signInWithPhoneNumber } = require("./firebase");

 async function signupWithEmail(email, password) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCred.user);
  return userCred;
}

 async function loginWithEmail(email, password) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  if (!userCred.user.emailVerified) {
    throw new Error("Email not verified. Please verify your email.");
  }
  return userCred;
}

 async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

 async function resendVerification() {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  } else {
    throw new Error("No user is logged in.");
  }
}

 async function loginWithGoogle() {
  const userCred = await signInWithPopup(auth, googleProvider);
  return userCred;
}

 async function setupRecaptcha(phoneNumber) {
  const recaptcha = new RecaptchaVerifier("recaptcha-container", {
    size: "invisible",
    callback: () => {
      console.log("Recaptcha verified");
    },
  }, auth);

  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
  return confirmationResult; // use this to verify OTP
}

 async function verifyOtp(confirmationResult, otp) {
  const result = await confirmationResult.confirm(otp);
  return result.user;
}

module.exports = {
  signupWithEmail,
  loginWithEmail,
  resetPassword,
  resendVerification,
  loginWithGoogle,
  setupRecaptcha,
  verifyOtp
};