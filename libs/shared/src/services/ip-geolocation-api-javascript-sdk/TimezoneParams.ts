export default class TimezoneParams {
  private tz: string = '';
  private ipAddress: string = '';
  private lang: string = 'en';
  private latitude: string = '1000.0';
  private longitude: string = '1000.0';
  private location: string = '';

  setTimezone(tz: string = ''): void {
    this.tz = tz;
  }

  getTimezone(): string {
    return this.tz;
  }

  setIPAddress(ipAddress: string = ''): void {
    this.ipAddress = ipAddress;
  }

  getIPAddress(): string {
    return this.ipAddress;
  }

  setLang(lang: string = 'en'): void {
    this.lang = lang;
  }

  getLang(): string {
    return this.lang;
  }

  setCoordinates(la: string = '1000.0', lo: string = '1000.0'): void {
    const latitude = parseFloat(la);
    const longitude = parseFloat(lo);

    if (!isNaN(latitude) && !isNaN(longitude)) {
      if (
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180
      ) {
        this.latitude = la;
        this.longitude = lo;
      }
    }
  }

  getLatitude(): string {
    return this.latitude;
  }

  getLongitude(): string {
    return this.longitude;
  }

  getLocation(): string {
    return this.location;
  }

  setLocation(loc: string = ''): void {
    this.location = loc;
  }
}
