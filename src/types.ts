export interface AreaResponse {
  success: boolean;
  data: {
    code: {
      office_code: number;
      class10s_code: number;
      pref: string;
      city: string;
    };
  };
}

export type ForecastResponse = [ShorTimeForecast, never];

interface ShorTimeForecast {
  publishingOffice: string;
  reportDatetime: string;
  timeSeries: [WeatherTimeSeries, PopsTimeSeries, TempsTimeSeries];
}

interface BaseTimeSeries {
  timeDefines: string[];
}

interface WeatherTimeSeries extends BaseTimeSeries {
  areas: SummaryWeatherData[];
}

interface PopsTimeSeries extends BaseTimeSeries {
  areas: PopsData[];
}

interface TempsTimeSeries extends BaseTimeSeries {
  areas: TempsData[];
}

interface BaseWeatherData {
  area: { name: string; code: string };
}

interface SummaryWeatherData extends BaseWeatherData {
  weatherCodes: string[];
  weathers: string[];
  wind: string[];
  wave: string[];
}

interface PopsData extends BaseWeatherData {
  pops: string[];
}

interface TempsData extends BaseWeatherData {
  temps: string[];
}

export interface TodaysWeather {
  weatherCode: string;
  weatherDescription: string;
  pop: string;
  temp: string;
}
