/* RAW DATA RESOURCES */
function ResourceItem({ name, length }) {
  return `
    <li>
      <a href="${name}">/${name}</a>
      <sup>${length ? `${length}x` : 'object'}</sup>
    </li>
  `
}

function ResourceList({ db }) {
  return `
    <ul>
      ${Object.keys(db)
        .map((name) =>
          ResourceItem({
            name,
            length: Array.isArray(db[name]) && db[name].length,
          })
        )
        .join('')}
    </ul>
  `
}

function NoResources() {
  return `<p>No resources found</p>`
}

function ResourcesBlock({ db }) {
  return `
    <div>
      <h1>Raw Data:</h1>
      ${Object.keys(db).length ? ResourceList({ db }) : NoResources()}
    </div>
  `
}

/* WEATHER DISPLAY */
function toMPH(_kph) {
  return (_kph * 0.621371).toFixed(2);
}

function WeatherDisplay({ db }) {
  console.log(db);
  document.getElementById("type_data").innerHTML =
    db?.temperature?.model ?
      `${db.temperature.model}` :
      "--";
  document.getElementById("temp_data").innerHTML =
    db?.temperature?.temperature_F ?
      `${db.temperature.temperature_F}℉` :
      "--";
  document.getElementById("humi_data").innerHTML =
    db?.temperature?.humidity ?
      `${db.temperature.humidity}%` :
      "--";
  document.getElementById("wdir_data").innerHTML =
    db?.wind_rain?.wind_dir_deg ?
      `${db.wind_rain.wind_dir_deg}°` :
      "--";
  document.getElementById("wspd_data").innerHTML =
    db?.wind_rain?.wind_avg_km_h ?
      `${toMPH(db.wind_rain.wind_avg_km_h)}mph` :
      "--";
  document.getElementById("date_data").innerHTML =
    db?.temperature?.time ?
      `${db.temperature.time}` :
      "--";
  document.getElementById("batr_data").innerHTML =
    db?.temperature?.battery_ok ?
      `<i class="fa-solid fa-battery-full success"></i>` :
      `<i class="fa-solid fa-battery-empty fail"></i>`;
}

function NoInformation() {
  return `<p>No weather information found</p>`
}

/* MAIN FUNCTION */
window
  .fetch('db')
  .then((response) => response.json())
  .then(
    (db) => {
      document.getElementById('resources').innerHTML = ResourcesBlock({ db });
      if(Object.keys(db).length) {
        WeatherDisplay({ db });
      } else {
        document.getElementById('display_error').innerHTML = NoInformation();
      }
    }
  )
