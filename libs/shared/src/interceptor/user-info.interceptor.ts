import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import IPGeolocationAPI from '../services/ip-geolocation-api-javascript-sdk/IPGeolocationAPI';
import GeolocationParams from '../services/ip-geolocation-api-javascript-sdk/GeolocationParams';
const DeviceDetector = require('node-device-detector');
const ClientHints = require('node-device-detector/client-hints');
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class UserInfoInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    const detector = new DeviceDetector({
      clientIndexes: true,
      deviceIndexes: true,
      deviceAliasCode: false,
    });
    const ipgeolocationApi = new IPGeolocationAPI(
      this.configService.get('IPGeolocationAPI_API_KEY'),
      false,
    );
    const geolocationParams = new GeolocationParams();
    const request = context.switchToHttp().getRequest() as Request;
    const forwardedIP = request.headers['x-forwarded-for'] as string;
    const userAgent = request.headers['user-agent'];
    const userClientInfo = detector.detect(userAgent);
    request.headers['user-client-info'] = userClientInfo;
    geolocationParams.setIPAddress(forwardedIP);
    ipgeolocationApi.getGeolocation(
      this.handleResponse.bind(this, request),
      geolocationParams,
    );

    console.log('<<<<<<<<intercept>>>>>>>>', request.headers);
    return next.handle();
  }

  handleResponse(request: Request, json) {
    const locationDetails = json;

    request.headers['user-location-info'] = locationDetails;
  }
}
