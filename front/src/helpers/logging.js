const IS_DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE || 'false';

export const console_log_debug = IS_DEBUG_MODE === 'true' ? console.log : () => {};
