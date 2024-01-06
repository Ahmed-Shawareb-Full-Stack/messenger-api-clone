export default class GeolocationParams {
  private ipAddress: string = '';
  private ipAddresses: string[] = [];
  private fields: string = '*';
  private excludes: string = '';
  private lang: string = 'en';
  private includeHostname: boolean = false;
  private includeLiveHostname: boolean = false;
  private includeHostnameFallbackLive: boolean = false;
  private includeSecurity: boolean = false;
  private includeUserAgent: boolean = false;

  setIPAddress(ipAddress: string = ''): void {
    this.ipAddress = ipAddress;
  }

  getIPAddress(): string {
    return this.ipAddress;
  }

  setFields(fields: string = '*'): void {
    this.fields = fields;
  }

  getFields(): string {
    return this.fields;
  }

  setExcludes(excludes: string = ''): void {
    this.excludes = excludes;
  }

  getExcludes(): string {
    return this.excludes;
  }

  setLang(lang: string = 'en'): void {
    this.lang = lang;
  }

  getLang(): string {
    return this.lang;
  }

  setIPAddresses(ipAddresses: string[] = []): void {
    if (ipAddresses.length > 50) {
      console.log('Max. number of IP addresses cannot be more than 50.');
    } else {
      this.ipAddresses = ipAddresses;
    }
  }

  getIPAddresses(): string[] {
    return this.ipAddresses;
  }

  setIncludeHostname(b: boolean = false): void {
    this.includeHostname = b;
  }

  setIncludeHostnameFallbackLive(b: boolean = false): void {
    this.includeHostnameFallbackLive = b;
  }

  setIncludeLiveHostname(b: boolean = false): void {
    this.includeLiveHostname = b;
  }

  setIncludeSecurity(b: boolean = false): void {
    this.includeSecurity = b;
  }

  setIncludeUserAgent(b: boolean = false): void {
    this.includeUserAgent = b;
  }

  isIncludeHostname(): boolean {
    return this.includeHostname;
  }

  isIncludeHostnameFallbackLive(): boolean {
    return this.includeHostnameFallbackLive;
  }

  isIncludeLiveHostname(): boolean {
    return this.includeLiveHostname;
  }

  isIncludeSecurity(): boolean {
    return this.includeSecurity;
  }

  isIncludeUserAgent(): boolean {
    return this.includeUserAgent;
  }
}
