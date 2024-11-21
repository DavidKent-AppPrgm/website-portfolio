function toggleEmailWindow() {
  const emailWindow = document.getElementById("emailWindow");
  emailWindow.style.display = emailWindow.style.display === "none" ? "block" : "none";
}

async function sendEmail() {
  const subject = document.getElementById("emailSubject").value;
  const body = document.getElementById("emailBody").value;

  if (!subject || !body) {
    alert("Please fill out all fields.");
    return;
  }

  try {
    const response = await fetch('/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, body })
    });

    const result = await response.json();
    if (result.success) {
      alert("Email sent successfully!");
      toggleEmailWindow();
    } else {
      alert("Failed to send email.");
    }
  } catch (error) {
    alert("An error occurred while sending the email.");
    console.error(error);
  }
}
