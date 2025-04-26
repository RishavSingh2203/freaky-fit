"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExerciseVideo = getExerciseVideo;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_API_URL = 'https://api.pexels.com/videos';
async function getExerciseVideo(exerciseName) {
    try {
        if (!PEXELS_API_KEY) {
            throw new Error('Pexels API key not configured');
        }
        // Search for exercise-related videos
        const response = await axios_1.default.get(`${PEXELS_API_URL}/search`, {
            headers: {
                Authorization: PEXELS_API_KEY
            },
            params: {
                query: `${exerciseName} exercise workout demonstration`,
                per_page: 1,
                orientation: 'portrait'
            }
        });
        if (response.data.videos && response.data.videos.length > 0) {
            // Get the video file with the best quality that's not too large
            const video = response.data.videos[0];
            const videoFiles = video.video_files;
            // Sort by quality (width) and find the best one under 720p
            const bestVideo = videoFiles
                .filter(file => file.width <= 720)
                .sort((a, b) => b.width - a.width)[0];
            if (bestVideo) {
                return bestVideo.link;
            }
        }
        // Fallback to a default exercise video if no results found
        return 'https://player.vimeo.com/external/414800478.hd.mp4?s=2e4c0c3e1c0c3e1c0c3e1c0c3e1c0c3e1&profile_id=175&oauth2_token_id=57447761';
    }
    catch (error) {
        console.error('Error fetching video from Pexels:', error);
        // Return a default exercise video in case of error
        return 'https://player.vimeo.com/external/414800478.hd.mp4?s=2e4c0c3e1c0c3e1c0c3e1c0c3e1c0c3e1&profile_id=175&oauth2_token_id=57447761';
    }
}
exports.default = getExerciseVideo;
