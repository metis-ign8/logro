import { bots } from './botsConfig.js';

export async function getResponse(message, bot, env) {
  const config = bots[bot] || bots.personal;
  // In a real project, integrate with chosen LLM
  return `Echo from ${bot}: ${message}`;
}

export const bots = {
  ops: { model: 'gpt-4ops' },
  marxia: { model: 'gpt-4marx' },
  personal: { model: 'tinyllm-personal' },
};
