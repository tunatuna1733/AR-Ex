import './style.css';
import type { AreaResponse, ForecastResponse, TodaysWeather } from './types';

const getCurrentPosition = async (): Promise<GeolocationPosition> => {
  if (!('geolocation' in navigator)) {
    throw new Error('Geolocation API is not available in this environment');
  }

  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
};

const getWeather = async () => {
  const position = await getCurrentPosition();
  const { latitude, longitude } = position.coords;
  const areaUrl = `https://geocoord-api-jp.tunatuna1733.deno.net/jma_area?latitude=${latitude}&longitude=${longitude}`;
  const areaResponse = await fetch(areaUrl);
  const areaData: AreaResponse = await areaResponse.json();
  if (!areaData.success) {
    throw new Error('Failed to get area data');
  }
  const { office_code, class10s_code } = areaData.data.code;
  const weatherUrl = `https://www.jma.go.jp/bosai/forecast/data/forecast/${office_code}.json`;
  const weatherResponse = await fetch(weatherUrl);
  const weatherData: ForecastResponse = await weatherResponse.json();
  const index = weatherData[0].timeSeries[0].areas.findIndex((area) => area.area.code === class10s_code.toString());
  if (index === -1) {
    throw new Error('Area code not found in weather data');
  }
  const data: TodaysWeather = {
    weatherCode: weatherData[0].timeSeries[0].areas[index].weatherCodes[0],
    weatherDescription: weatherData[0].timeSeries[0].areas[index].weathers[0],
    pop: weatherData[0].timeSeries[1].areas[index].pops.join('/'),
    temp: weatherData[0].timeSeries[2].areas[index].temps[0],
  };
  return data;
};

const weather = await getWeather();
const weatherCodeImage = `https://www.jma.go.jp/bosai/forecast/img/${weather.weatherCode}.png`;
document.querySelector('#weather-image-a')?.setAttribute('src', weatherCodeImage);
document
  .querySelector('.weather-info')
  ?.setAttribute(
    'value',
    `Weather: ${weather.weatherDescription.split('　').join('\n')}\n降水確率: ${weather.pop}%\n気温: ${weather.temp}度`,
  );
