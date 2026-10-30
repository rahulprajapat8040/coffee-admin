import { axiosInstance } from "./axios";
// import { logoutUser } from "../utils/logout";

let isRefreshing = false;

type QueueItem = {
  resolve: () => void;
  reject: (error: unknown) => void;
};

let failedQueue: QueueItem[] = [];

const processQueue = (error?: unknown) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

export async function refreshSession(): Promise<void> {
  if (isRefreshing) {
    return new Promise<void>((resolve, reject) => {
      failedQueue.push({
        resolve,
        reject,
      });
    });
  }

  isRefreshing = true;

  try {
    await axiosInstance.post("/auth/refresh-token");

    processQueue();
  } catch (error) {
    processQueue(error);

    // logoutUser();

    throw error;
  } finally {
    isRefreshing = false;
  }
}
