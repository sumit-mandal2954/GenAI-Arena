const API_BASE_URL = "http://localhost:3000";

export async function runGraphStream(userMessage, { onEvent, signal } = {}) {
  try {

    const response = await fetch(`${API_BASE_URL}/api/run-graph`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ userMessage }),
      signal,
    });


    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    if (!response.body) {
      throw new Error("Streaming response body not available");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let isOpen = true;
    let eventCount = 0;

    const mockEventSource = {
      close: () => {
        isOpen = false;
        reader.cancel();
      },
    };

    // 🔥 REAL-TIME STREAMING: Process events immediately as they arrive
    (async () => {
      try {
        while (isOpen) {
          const { value, done } = await reader.read();
          
          if (value) {
            const decoded = decoder.decode(value, { stream: true });
            buffer += decoded;
          }

          if (done) {
            // Flush final bytes
            const finalData = decoder.decode();
            if (finalData) {
              buffer += finalData;
            }
            
            // Process any remaining data in buffer
            if (buffer.trim()) {
              processBuffer(buffer);
            }
            
            break;
          }

          // 🔥 Process available complete events from buffer (look for \n\n separators)
          const eventBoundary = buffer.indexOf("\n\n");
          if (eventBoundary !== -1) {
            const completeEvent = buffer.substring(0, eventBoundary);
            buffer = buffer.substring(eventBoundary + 2);
            
            processEvent(completeEvent);
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          onEvent?.({
            type: "error",
            message: err.message || "Stream failed",
          });
        }
      }
    })();

    // Helper function to process a single event line
    function processEvent(eventLine) {
      const rawEvent = eventLine.trim();
      
      if (!rawEvent) return;
      
      const match = rawEvent.match(/^data:\s*(.+)$/);
      
      if (!match) {
        console.warn("⚠️ Invalid event format:", rawEvent.substring(0, 50));
        return;
      }
      
      const dataStr = match[1];
      
      if (dataStr === "[DONE]") {
        return;
      }
      
      try {
        const parsed = JSON.parse(dataStr);
        eventCount++;
        onEvent?.(parsed);
      } catch (err) {
        console.warn("⚠️ Failed to parse event:", dataStr.substring(0, 100), err.message);
      }
    }

    // Helper function to process remaining buffer data
    function processBuffer(data) {
      const events = data.split("\n\n");
      for (const event of events) {
        if (event.trim()) {
          processEvent(event);
        }
      }
    }

    return mockEventSource;
  } catch (err) {
    console.error("🔴 Fetch error:", err);
    onEvent?.({
      type: "error",
      message: err.message || "Failed to connect",
    });
    throw err;
  }
}

// 🏛️ JUDGE-ONLY: Run just the judge without solutions
export async function judgeGraph(solution_1, solution_2, { onEvent, signal } = {}) {
  try {

    const response = await fetch(`${API_BASE_URL}/api/run-graph/judge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ solution_1, solution_2, userMessage: "" }),
      signal,
    });


    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    if (!response.body) {
      throw new Error("Streaming response body not available");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let isOpen = true;
    let eventCount = 0;

    const mockEventSource = {
      close: () => {
        isOpen = false;
        reader.cancel();
      },
    };

    // 🔥 REAL-TIME STREAMING: Process events immediately as they arrive
    (async () => {
      try {
        while (isOpen) {
          const { value, done } = await reader.read();
          
          if (value) {
            const decoded = decoder.decode(value, { stream: true });
            buffer += decoded;
          }

          if (done) {
            // Flush final bytes
            const finalData = decoder.decode();
            if (finalData) {
              buffer += finalData;
            }
            
            // Process any remaining data in buffer
            if (buffer.trim()) {
              processBuffer(buffer);
            }
            
            break;
          }

          // 🔥 Process available complete events from buffer (look for \n\n separators)
          const eventBoundary = buffer.indexOf("\n\n");
          if (eventBoundary !== -1) {
            const completeEvent = buffer.substring(0, eventBoundary);
            buffer = buffer.substring(eventBoundary + 2);
            
            processEvent(completeEvent);
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("🔴 Judge stream error:", err);
          onEvent?.({
            type: "error",
            message: err.message || "Judge stream failed",
          });
        }
      }
    })();

    // Helper function to process a single event line
    function processEvent(eventLine) {
      const rawEvent = eventLine.trim();
      
      if (!rawEvent) return;
      
      const match = rawEvent.match(/^data:\s*(.+)$/);
      
      if (!match) {
        console.warn("⚠️ Invalid judge event format:", rawEvent.substring(0, 50));
        return;
      }
      
      const dataStr = match[1];
      
      if (dataStr === "[DONE]") {
        console.log("🏁 Judge [DONE] signal received");
        return;
      }
      
      try {
        const parsed = JSON.parse(dataStr);
        eventCount++;
        onEvent?.(parsed);
      } catch (err) {
        console.warn("⚠️ Failed to parse judge event:", dataStr.substring(0, 100), err.message);
      }
    }

    // Helper function to process remaining buffer data
    function processBuffer(data) {
      const events = data.split("\n\n");
      for (const event of events) {
        if (event.trim()) {
          processEvent(event);
        }
      }
    }

    return mockEventSource;
  } catch (err) {
    console.error("🔴 Judge fetch error:", err);
    onEvent?.({
      type: "error",
      message: err.message || "Failed to connect to judge",
    });
    throw err;
  }
}