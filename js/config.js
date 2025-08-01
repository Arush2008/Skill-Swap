// Configuration for Firebase and EmailJS
// Replace these with your actual Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// EmailJS configuration
// Replace with your actual EmailJS configuration
const emailConfig = {
  publicKey: "your-emailjs-public-key",
  serviceId: "your-service-id",
  templateId: "your-template-id"
};

// Export configurations
window.firebaseConfig = firebaseConfig;
window.emailConfig = emailConfig;
