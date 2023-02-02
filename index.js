
/*** Purpose: Mock 433_rtl output to db.json ***/
const fs = require('fs');
const cron = require('node-cron');
const exec = require('child_process').exec;

/* Write Date in Format */
function writeDate() {
  const date = new Date();
  const dateString = date.toISOString();
  const dateFormat = dateString.split('T')[0];
  const timeFormat = dateString.split('T')[1].split('.')[0];
  return dateFormat + ' ' + timeFormat;
}

/* Generate Temperature Data */
function tempReport() {
  const newReport = {
    "time" : writeDate(),
    "model" : "Acurite-5n1",
    "message_type" : 56,
    "id" : 3375,
    "channel" : "C",
    "sequence_num" : 0,
    "battery_ok" : 1,
    "wind_avg_km_h" : 6.2,
    "temperature_F" : 27.300,
    "humidity" : 55,
    "mic" : "CHECKSUM"
  };
  return newReport;
}

/* Generate Wind/Rain Data */
function windReport() {
  const newReport = {
    "time" : writeDate(),
    "model" : "Acurite-5n1",
    "message_type" : 49,
    "id" : 3375,
    "channel" : "C",
    "sequence_num" : 2,
    "battery_ok" : 1,
    "wind_avg_km_h" : 6.2,
    "wind_dir_deg" : 315.000,
    "rain_in" : 32.640,
    "mic" : "CHECKSUM"
  };
  return newReport;
}

 /* Write New Data */
function outputReport(_file, _data) {
  // Randomly Select Report Type
  const reportTypes = [tempReport, windReport];
  const reportType = reportTypes[Math.floor(Math.random() * reportTypes.length)];
  const _report = reportType();

  if(_report && _report.message_type && _report.id) {
    if (_report.message_type === 56 && _report.id === 3375) {
      _data.temperature = _report;
    } else if (_report.message_type === 49 && _report.id === 3375) {
      _data.wind_rain = _report;
    } else {
      return;
    }
  }

  const newData = JSON.stringify(_data, null, 2);

  fs.writeFileSync(_file, newData, err => {
    if (err) {
      throw err;
    }
  });
  console.log("TASK: Wrote new db.json");
}

async function pullNewData() {
  console.log("TASK: Data Pull")
  await exec('./get_data.sh', (error) => {
    if(error) {
      console.log("Error:");
      console.log(error);
    }
  })
}

// Data Pull - Every Hour
// Convert Data to DB.json - Every Minute

/* Main Function */
function main() {
  console.log("TASK: Started Program");

  const file = 'db.json';
  const fileData = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(fileData);

  cron.schedule('*/5 * * * *', () => {
    // Will be */60 * * * *
    console.log("CRON: Task Started");
    pullNewData();
  })

  pullNewData();
  setInterval(outputReport, 10000, file, data);
  // will be setInterval(outputReport, 60000, file, data);
}

/* Run Main on Start */
main();

// function runReport() {
//   // Set Interal 1 minute to:
//   // Read read.json
//   // Find latest tempearture (56) report
//   // Find latest wind_rain (49) report
//   // Write to db.json in format
//   return;
// }

// setInterval(runReport, 60000);
