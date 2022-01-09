'use strict';

import ChatLogControls from './scripts/controls.js';
import ChatLogLoader from './scripts/load.js';
import { ModuleSettings, ModuleOptions } from './scripts/settings.js';
import { sleep } from './scripts/utils.js';

/**
 * Valid Foundry.js chat message type
 *
 * const CHAT_MESSAGE_TYPES = {
 *  OTHER: 0,
 *  OOC: 1,
 *  IC: 2,
 *  EMOTE: 3,
 *  WHISPER: 4,
 *  ROLL: 5
 *};
 */

/**
 * These hooks register the following settings in the module settings.
 */
Hooks.once('init', () => {
	const chatLogControls = new ChatLogControls();
	chatLogControls.init();

	const chatLogLoader = new ChatLogLoader();
	chatLogLoader.init();
});

Hooks.once('ready', () => {
	// loadTemplates(['modules/buglog8/templates/log_search.hbs']);
});
