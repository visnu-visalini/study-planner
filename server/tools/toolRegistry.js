import createTask from "./CreateTask.js";
import completeTask from "./CompleteTask.js";
import getTasks from "./getTask.js";
import getProgress from "./getProgress.js";
import startFocus from "./startFocus.js";
import stopFocus from "./stopFocus.js";
import getFocusStats from "./getFocusStats.js";
import logApp from "./logApp.js";
import addNotionNote from "./addNotionNote.js";
import addCalendarEvent from "./addCalendarEvent.js";
import playSpotify from "./playSpotify.js";

const registry = {
    createTask,
    completeTask,
    getTasks,
    getProgress,
    startFocus,
    stopFocus,
    getFocusStats,
    logApp,
    addNotionNote,
    addCalendarEvent,
    playSpotify
};

export default registry;
