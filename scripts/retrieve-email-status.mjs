import { readFileSync } from "node:fs";
const { key } = JSON.parse(readFileSync("/tmp/aditou-resend-setup.json"));
for (const id of process.argv.slice(2)) {
  await new Promise((r) => setTimeout(r, 600));
  const response = await fetch(
    "https://api.resend.com/emails/" + encodeURIComponent(id),
    { headers: { Authorization: `Bearer ${key}` } },
  );
  const email = await response.json();
  console.log(
    JSON.stringify({
      id,
      status: response.status,
      event: email.last_event,
      subject: email.subject,
      to: email.to,
    }),
  );
}
