export function sanitize(input) {
  return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function log(message) {
  console.log(`[LOG]: ${message}`);
}
