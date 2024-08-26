import { WebWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

// A handler that resides in the worker thread
const handler = new WebWorkerMLCEngineHandler();

self.onmessage = (msg) => {
  try {
    //console.log("Worker received message:", msg.data);
    
    if (!msg.data) {
      throw new Error("Received an empty message");
    }

    if (!msg.data.kind) {
      throw new Error("Message does not contain 'kind' property");
    }

    if (msg.data.kind === 'completionStreamNextChunk' && !msg.data.content) {
      console.warn("Received chunk with null content:", msg.data);
    }

    handler.onmessage(msg);

  } catch (error) {
    console.error("Error in worker processing:", error, msg.data);
    // Optionally, send an error message back to the main thread
    self.postMessage({
      kind: 'error',
      error: error.message,
      originalMessage: msg.data
    });
  }
};