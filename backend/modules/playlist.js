import { Router } from "express";
import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const router = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

router.get("/api/title", async (req, res) => {
  try {
    const { playlistId } = req.query;
    if (!playlistId) {
      return res.status(400).json({ error: "Missing playlistId in query." });
    }

    const queryPlaylistDetails = `https://www.googleapis.com/youtube/v3/playlists?key=${process.env.YT_API}&id=${playlistId}&part=id,contentDetails,snippet&fields=items(id,snippet(title,thumbnails),contentDetails(itemCount))`;

    const detailsResponse = await fetch(queryPlaylistDetails);
    if (!detailsResponse.ok) throw new Error("Failed to fetch data from YouTube API");

    const data = await detailsResponse.json();

    if (!data.items || data.items.length === 0) {
      return res.status(404).json({ error: "Playlist not found." });
    }

    const playlist = data.items[0];

    const playlistTitle = playlist.snippet.title;
    const videoCount = playlist.contentDetails?.itemCount || 0;
    const playlistCover = playlist.snippet?.thumbnails?.medium?.url || "";

    console.log({ title: playlistTitle, cover: playlistCover, videoCount });

    res.json({ title: playlistTitle, cover: playlistCover, videoCount });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/tracker/:trackingId", async (req, res) => {
  try {
    console.log("called");
    const { trackingId } = req.params;
    const { playlistId } = req.query;

    if (!playlistId) {
      return res.status(400).json({ error: "Missing playlistId in query." });
    }

    const query = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${process.env.YT_API}&maxResults=50`;
    // https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=RDGMEMP-96bLtob-xyvCobnxVfyw&key=AIzaSyAT2ex9cfKNjADDtQo5G-Ss5V-rK8mLRbc&maxResults=50

    const response = await fetch(query);
    if (!response.ok) throw new Error("Failed to fetch data from YouTube API");

    const data = await response.json();

    const processedData = {
      trackingId: trackingId,
      totalVideos: data.pageInfo.totalResults,
      nextPageToken: data.nextPageToken ? data.nextPageToken : null,
      prevPageToken: data.prevPageToken ? data.prevPageToken : null,
      items: [],
    };

    data.items.map((item) => {
      processedData.items.push({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium,
      });
    });
    res.json(processedData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/change-playlist-page", async (req, res) => {
  try {
    const { playlistId, token } = req.query;

    const query = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&pageToken=${token}&playlistId=${playlistId}&maxResults=50&key=${process.env.YT_API}`;

    const response = await fetch(query);
    if (!response.ok) throw new Error("Failed to fetch data from YouTube API");

    const data = await response.json();

    const processedData = {
      nextPageToken: data.nextPageToken ? data.nextPageToken : null,
      prevPageToken: data.prevPageToken ? data.prevPageToken : null,
      items: [],
    };
    data.items.map((item) => {
      processedData.items.push({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium,
      });
    });
    res.json(processedData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-video", async (req, res) => {
  try {
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/summarize-video", async (req, res) => {
  try {
    const { videoId } = req.body;

    if (!videoId) {
      return res.status(400).json({ error: "videoId is required" });
    }

    const transcriptObjects = await YoutubeTranscript.fetchTranscript(videoId);

    if (!transcriptObjects || transcriptObjects.length === 0) {
      return res.status(404).json({ error: "Transcript not found" });
    }

    const transcriptText = transcriptObjects.map((item) => item.text).join(" ");
    const prompt = `You are an AI assistant that specializes in summarizing YouTube videos using their transcripts. Your task is to analyze the provided transcript and generate a structured summary in JSON format while maintaining the structure of the input. 
        ### Instructions:
        1. Read the transcript carefully.
        2. Identify key topics, main ideas, and important points.
        3. Maintain the structure of the input format:
        - \`text\`: A brief summary point (preferably extracted from the original text).
        - \`duration\`: Approximate time taken to cover this point.
        - \`offset\`: Timestamp (when this point appears in the video).
        4. Summarize the following transcript involving only important points only THIS MEANS SUMMARIZE THE POINT OR CONCLUSION OF THE POINT HE WAS TRYING TO EXPLAIN, summarize the medium (every about 10% of video) chunks of video, summary should contain the actual summary of video sections
        5. must complete summarization of every important point of the video 
        ### Input Format:
        \`\`\`json
        [
            { "text": "FULL_VIDEO_TRANSCRIPT_HERE", "duration": DURATION, "offset": OFFSET, "lang": "LANGUAGE" }
        ]
        \`\`\`

        Transcript:
        ${transcriptText}
        `;

    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text();
    let jsonString = rawResponse;

    if (rawResponse.startsWith("```json")) {
      jsonString = rawResponse.substring(7, rawResponse.length - 4).trim();
    } else if (rawResponse.startsWith("```")) {
      jsonString = rawResponse.substring(3, rawResponse.length - 3).trim();
    }

    let summary;
    try {
      summary = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      console.error("Extracted JSON String:", jsonString);
      console.error("Raw Response:", rawResponse);
      return res
        .status(500)
        .json({ error: "Invalid JSON after extraction", rawResponse });
    }

    if (!Array.isArray(summary)) {
      console.error("Summary is not an array:", summary);
      return res
        .status(500)
        .json({
          error: "Summary is not in the expected array format",
          summary,
        });
    }

    res.json(summary);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

export default router;
