
/*** Purpose: Mock 433_rtl output to db.json ***/
const fs = require('fs');
const cron = require('node-cron');
const exec = require('child_process').exec;

/* PULL DATA FROM RADIO - RUNS HOURLY */
function pullNewData() {
  console.log("TASK: Data Pull")
  exec('./get_data.sh', (error) => {
    if (error) {
      console.log("Error:");
      console.log(error);
    }
  })
}

/* READS DATA FROM RADIO DATA PULL AND SENDS TO DB.JSON - RUNS EVERY MINUTE */
function runReport() {
  console.log("REPORT: Reading Data...");
  const inFile = 'data.json';
  const outFile = 'db.json';
  const fileData = fs.readFileSync(inFile, 'utf8');
  const dataLines = fileData.split('\n');

  const reports = [];
  dataLines.forEach((line) => {
    try {
      const report = JSON.parse(line);
      reports.push(report);
    } catch { }
  });

  const temperature = reports.find((el) => (el.message_type === 56 && el.id === 3375));
  const wind_rain = reports.find((el) => (el.message_type === 56 && el.id === 3375));

  const dataToWrite = JSON.stringify({ temperature, wind_rain }, null, 2);

  fs.writeFileSync(outFile, dataToWrite, err => {
    if (err) {
      throw err;
    }
  });
}

/* MAIN FUNCTION TO CONTROL TASKS */
function main() {
  console.log("TASK: Started Program");
  pullNewData();

  cron.schedule('*/60 * * * *', () => {
    console.log("CRON: Task Started");
    pullNewData();
  });
  setInterval(runReport, 60000);
}

/* RUN MAIN ON START */
main();
