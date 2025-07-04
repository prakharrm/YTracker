import { Router } from "express";
import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const router = Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

router.get("/title", async (req, res) => {
  try {
    const { playlistId } = req.query;
    if (!playlistId) {
      return res.status(400).json({ error: "Missing playlistId in query." });
    }

    const queryPlaylistDetails = `https://www.googleapis.com/youtube/v3/playlists?key=${process.env.YT_API}&id=${playlistId}&part=id,contentDetails,snippet&fields=items(id,snippet(title,thumbnails),contentDetails(itemCount))`;

    const detailsResponse = await fetch(queryPlaylistDetails);
    if (!detailsResponse.ok)
      throw new Error("Failed to fetch data from YouTube API");

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

router.get("/change-playlist-page", async (req, res) => {
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

router.get("/search", async (req, res) => {
  try {
    const { searchQuery } = req.query;
    const prompt = `context: this is prompt for Ytracker application which helps user track and follow a specific youtube playlist, and gemini is getting used for a specific feature which help user if they have query and wants to quickly search about their query. thus following is query by user.. help them solve their query in less than or equal to 300 in a formatted form. respond in given json format and nothing else.... {title: \`here breifly explain user query\`, content: \`here explain their query breifly in less than 100 words\`} . following is the user's query:-`;

    if (searchQuery) {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `${prompt} ${searchQuery}`,
      });

      let rawText = response.text.trim();

      if (rawText.startsWith("```")) {
        rawText = rawText.replace(/```(json)?\s*([\s\S]*?)\s*```/, "$2").trim();
      }

      let jsonResponse;
      try {
        jsonResponse = JSON.parse(rawText);
      } catch (parseErr) {
        console.error("Failed to parse Gemini response:", parseErr);
        return res.status(500).json({ error: "Failed to parse AI response" });
      }

      return res.json(jsonResponse);
    } else {
      return res.status(400).json({ error: "searchQuery is required" });
    }
  } catch (err) {
    console.error("Error while searching: ", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/get-resources", async (req, res) => {
  try {
    const { videoId } = req.query;

    if (!videoId) {
      return res.status(400).json({ error: "query missing" });
    }

    const query = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YT_API}`;

    const ytData = await fetch(query);
    if (!ytData.ok) throw new Error("Failed to fetch data from YouTube API");

    const data = await ytData.json();
    const description = data.items[0].snippet.description;

    const prompt = `
Context: This is a feature of a YouTube playlist tracker that helps users extract **educational resources** from video descriptions. Your task is to extract only **educational and technical resource links** shared by the video creator.
You're given a YouTube video description below. also read the context of the around the links.. looks for educational works like learning, notes, PDFs, sheet. Also with names in json include the contextual title like GIthub - DSA Sheet, and if there are no context, add according to you with what it could possibly contain in one or two words
---
Include links that match the following patterns:
- **Google Drive / Google Docs / Sheets / Slides / Forms** (e.g., \`drive.google.com\`, \`docs.google.com\`)
- **GitHub** repositories or gists (e.g., \`github.com\`)
- **Educational or technical domains** (e.g., \`.edu\`, \`.org\`, \`research.\`, \`learn.\`)
- **Open-source projects** (e.g., GitLab, Bitbucket)
- **Developer or tech platforms** (e.g., \`stackblitz.com\`, \`codesandbox.io\`, \`codepen.io\`)
- **Official documentation** (e.g., \`reactjs.org\`, \`developer.mozilla.org\`, \`docs.python.org\`, \`docs.djangoproject.com\`)
- **Online learning platforms** (e.g., \`coursera.org\`, \`edx.org\`, \`khanacademy.org\`, \`freecodecamp.org\`)
- **Technical blogs and article platforms** (e.g., \`medium.com\`, \`dev.to\`, \`hashnode.com\`, \`cs50.harvard.edu\`)
- **Slide decks or PDF resources** (e.g., \`.pdf\`, \`slideshare.net\`)
- **Public Notion or Obsidian pages** with guides/tutorials
- **Government or research websites** (e.g., \`.gov\`, \`nasa.gov\`, \`nih.gov\`)
- **Coding and learning platforms like (e.g. replit, codingninja, striver, and related)
-**also include youtube videos which are related to learning videos or playlists
---

Output the result in this exact JSON format:
{
  "items": [
    { "name": "GitHub", "link": "https://github.com/example" },
    { "name": "Google Drive", "link": "https://drive.google.com/file/xyz" },
    { "name": "MDN Docs", "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript" }
  ]
}
---
Now extract all relevant educational links from the following description:
${description}
`;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `${prompt}`,
    });

    let rawText = response.text.trim();

    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/```(json)?\s*([\s\S]*?)\s*```/, "$2").trim();
    }
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("Failed to parse Gemini response:", parseErr);
      return res.status(500).json({ error: "Failed to parse AI response" });
    }
    const processedData = {
      itemCount : parsedData.items.length,
      items : parsedData.items
    }
    return res.json(processedData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.get("/summarize-video", async (req, res) => {
//   try {
//     const { videoId } = req.body;

//     if (!videoId) {
//       return res.status(400).json({ error: "videoId is required" });
//     }

//     const transcriptObjects = await YoutubeTranscript.fetchTranscript(videoId);

//     if (!transcriptObjects || transcriptObjects.length === 0) {
//       return res.status(404).json({ error: "Transcript not found" });
//     }

//     const transcriptText = transcriptObjects.map((item) => item.text).join(" ");
//     const prompt = `You are an AI assistant that specializes in summarizing YouTube videos using their transcripts. Your task is to analyze the provided transcript and generate a structured summary in JSON format while maintaining the structure of the input.
//         ### Instructions:
//         1. Read the transcript carefully.
//         2. Identify key topics, main ideas, and important points.
//         3. Maintain the structure of the input format:
//         - \`text\`: A brief summary point (preferably extracted from the original text).
//         - \`duration\`: Approximate time taken to cover this point.
//         - \`offset\`: Timestamp (when this point appears in the video).
//         4. Summarize the following transcript involving only important points only THIS MEANS SUMMARIZE THE POINT OR CONCLUSION OF THE POINT HE WAS TRYING TO EXPLAIN, summarize the medium (every about 10% of video) chunks of video, summary should contain the actual summary of video sections
//         5. must complete summarization of every important point of the video
//         ### Input Format:
//         \`\`\`json
//         [
//             { "text": "FULL_VIDEO_TRANSCRIPT_HERE", "duration": DURATION, "offset": OFFSET, "lang": "LANGUAGE" }
//         ]
//         \`\`\`

//         Transcript:
//         ${transcriptText}
//         `;

//     const result = await model.generateContent(prompt);
//     const rawResponse = result.response.text();
//     let jsonString = rawResponse;

//     if (rawResponse.startsWith("```json")) {
//       jsonString = rawResponse.substring(7, rawResponse.length - 4).trim();
//     } else if (rawResponse.startsWith("```")) {
//       jsonString = rawResponse.substring(3, rawResponse.length - 3).trim();
//     }

//     let summary;
//     try {
//       summary = JSON.parse(jsonString);
//     } catch (parseError) {
//       console.error("Error parsing JSON:", parseError);
//       console.error("Extracted JSON String:", jsonString);
//       console.error("Raw Response:", rawResponse);
//       return res
//         .status(500)
//         .json({ error: "Invalid JSON after extraction", rawResponse });
//     }

//     if (!Array.isArray(summary)) {
//       console.error("Summary is not an array:", summary);
//       return res.status(500).json({
//         error: "Summary is not in the expected array format",
//         summary,
//       });
//     }

//     res.json(summary);
//   } catch (error) {
//     console.error("Error:", error);
//     res
//       .status(500)
//       .json({ error: "Internal Server Error", details: error.message });
//   }
// });

export default router;
