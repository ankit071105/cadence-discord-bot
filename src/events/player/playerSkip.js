const logger = require('../../services/logger');

module.exports = {
    name: 'playerSkip',
    isDebug: false,
    isPlayerEvent: true,
    execute: async (queue, track) => {
        logger.warn(`playerSkip event: Failed to play '${track.raw.source}'.`);
        process.env.NODE_ENV === 'development' ? logger.trace(queue) : null;
    }
};
