import axios from "axios";
import { getVerifiedUser } from "./user";

const BASE_URL =
  `https://ytracker-backend.vercel.app/api`;

export const fetchResources = async (videoId) => {
  try {
    const user = getVerifiedUser();

    if (!user) {
      console.error("user not found");
    }

    if (videoId) {
      const response = await axios.get(
        `${BASE_URL}/get-resources?videoId=${videoId}`
      );
      return response.data;
    }
  } catch (err) {
    console.error("error fetching playlist: ", err);
  }
};
