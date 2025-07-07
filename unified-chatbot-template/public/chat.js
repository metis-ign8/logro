const messages = document.getElementById('messages');
const input = document.getElementById('user-input');
const send = document.getElementById('send');

send.addEventListener('click', async () => {
  const text = input.value.trim();
  if (!text) return;
  appendMessage('user', text);
  input.value = '';
  const res = await fetch('/api/chat?bot=personal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text }),
  });
  const data = await res.json();
  appendMessage('bot', data.reply);
});

function appendMessage(role, text) {
  const li = document.createElement('li');
  li.textContent = `${role}: ${text}`;
  messages.appendChild(li);
}
