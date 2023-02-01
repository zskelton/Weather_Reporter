
/*** Purpose: Mock 433_rtl output to db.json ***/
const fs = require('fs');

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

  if (_report.message_type === 56) {
    _data.temperature = _report;
  } else if (_report.message_type === 49) {
    _data.wind_rain = _report;
  } else {
    console.log("Unknown report type");
    return;
  }

  const newData = JSON.stringify(_data, null, 2);

  fs.writeFileSync(_file, newData, err => {
    if (err) {
      throw err;
    }
  });
  console.log("wrote to file...");
}

/* Main Function */
function main() {
  console.log("started");
  const file = 'db.json';
  const fileData = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(fileData);

  setInterval(outputReport, 10000, file, data);
}

/* Run Main on Start */
main();
