// In-memory store for trader activities
// Persists in memory only (cleared on server restart, OK for monitoring)
interface TraderActivity {
  type: "heartbeat" | "trade" | "alert" | "status";
  timestamp: string; // ISO format
  status: "scanning" | "trading" | "paused" | "error";
  openPositions: number;
  message: string;
}

// Store last 100 activities (FIFO)
const MAX_ACTIVITIES = 100;
let activities: TraderActivity[] = [];

/**
 * GET /api/trader-activities
 * Returns last 20 recent activities
 */
export async function GET() {
  // Return most recent 20 activities (newest first)
  const recent = activities.slice(-20).reverse();
  
  return Response.json({
    success: true,
    count: recent.length,
    total: activities.length,
    activities: recent,
  });
}

/**
 * POST /api/trader-activities
 * Save a new trader activity (heartbeat, trade, alert, etc.)
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.type || !data.timestamp || data.status === undefined || data.openPositions === undefined || data.message === undefined) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields: type, timestamp, status, openPositions, message",
        },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ["heartbeat", "trade", "alert", "status"];
    if (!validTypes.includes(data.type)) {
      return Response.json(
        {
          success: false,
          error: `Invalid type. Expected one of: ${validTypes.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["scanning", "trading", "paused", "error"];
    if (!validStatuses.includes(data.status)) {
      return Response.json(
        {
          success: false,
          error: `Invalid status. Expected one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Create activity record
    const activity: TraderActivity = {
      type: data.type,
      timestamp: data.timestamp,
      status: data.status,
      openPositions: parseInt(data.openPositions, 10) || 0,
      message: String(data.message),
    };

    // Add to store
    activities.push(activity);

    // Keep only last MAX_ACTIVITIES (trim oldest)
    if (activities.length > MAX_ACTIVITIES) {
      activities = activities.slice(-MAX_ACTIVITIES);
    }

    return Response.json({
      success: true,
      saved: true,
      activity,
      total: activities.length,
    });
  } catch (error) {
    console.error("[trader-activities POST] Error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
