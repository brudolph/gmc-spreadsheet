const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const readline = require("readline");

const sheetId = "1osZiO8ONAslWBhV1mKMRw3ve8Dk8CLVzyGQ1gMWdPbQ"; // Spreadsheet ID
const tokenPath = path.join(__dirname, "token.json"); // Path to store tokens

async function testGoogleSheetsAPI() {
  const keyfile = path.join(__dirname, "client_secret_469560072229.json");
  const keys = JSON.parse(fs.readFileSync(keyfile));

  // Create an oAuth2 client
  const client = new google.auth.OAuth2(
    keys.web.client_id,
    keys.web.client_secret,
    keys.web.redirect_uris[0]
  );

  // Check for saved tokens
  if (fs.existsSync(tokenPath)) {
    const tokens = JSON.parse(fs.readFileSync(tokenPath));
    client.setCredentials(tokens);
    await fetchAndProcessSheets(client);
  } else {
    // If no tokens, prompt user for authorization
    const authUrl = client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    console.log("Authorize this app by visiting this URL:", authUrl);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Enter the code from that page here: ", async (code) => {
      rl.close();
      try {
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        // Save tokens for future use
        fs.writeFileSync(tokenPath, JSON.stringify(tokens));
        console.log("Token stored to", tokenPath);

        await fetchAndProcessSheets(client);
      } catch (error) {
        console.error("Error retrieving access token:", error);
      }
    });
  }
}

async function fetchAndProcessSheets(auth) {
  const sheets = google.sheets({ version: "v4", auth });

  // Fetch sheet metadata to get all sheet names
  const metadata = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const sheetNames =  .data.sheets.map((sheet) => sheet.properties.title);

  console.log("Sheets in spreadsheet:", sheetNames);

  for (const sheetName of sheetNames) {
    console.log(`Fetching data from sheet: ${sheetName}`);

    const range = `${sheetName}!A:L`; // Example range
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const rows = response.data.values || [];
    const filteredRows = rows.filter((row) => row.some((cell) => cell && cell.trim()));

    console.log(`Data from ${sheetName}:`, filteredRows);
  }
}

testGoogleSheetsAPI().catch(console.error);
