export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const bot = url.searchParams.get('bot') || 'personal';
    const body = await request.json();
    const responseText = await routeRequest(body.message, bot, env);
    return new Response(JSON.stringify({ reply: responseText }), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};

async function routeRequest(message, bot, env) {
  const llm = await import('./llm-router.js');
  return llm.getResponse(message, bot, env);
}
