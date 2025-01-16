const fs = require("fs").promises;
const path = require("path");

const defaultStreamers = {
  streamers: [
    {
      id: "71092938",
      login: "xqc",
      display_name: "xQc",
      profile_image_url:
        "https://static-cdn.jtvnw.net/jtv_user_pictures/xqc-profile_image-9298dca608632101-300x300.jpeg",
    },
    {
      id: "26301881",
      login: "sodapoppin",
      display_name: "sodapoppin",
      profile_image_url:
        "https://static-cdn.jtvnw.net/jtv_user_pictures/sodapoppin-profile_image-2a00c6f0b3dd0840-300x300.png",
    },
    {
      id: "121059319",
      login: "kamet0",
      display_name: "Kamet0",
      profile_image_url:
        "https://static-cdn.jtvnw.net/jtv_user_pictures/9e12862d-a8d0-4df2-81aa-e2241022dc98-profile_image-300x300.jpg",
    },
    {
      id: "50597026",
      login: "squeezie",
      display_name: "Squeezie",
      profile_image_url:
        "https://static-cdn.jtvnw.net/jtv_user_pictures/a2592e98-5ba6-4c9a-9d9e-cf036d6f64c2-profile_image-300x300.jpg",
    },
  ],
};

async function initializeDatabase() {
  try {
    const dbPath = path.join(
      process.cwd(),
      "src",
      "data",
      "defaultStreamers.json",
    );

    // Check if the data directory exists, if not create it
    const dataDir = path.join(process.cwd(), "src", "data");
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Write the initial data
    await fs.writeFile(dbPath, JSON.stringify(defaultStreamers, null, 2));
    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

initializeDatabase();
