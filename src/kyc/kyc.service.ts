import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export default class KycService {
  constructor(private readonly httpService: HttpService) { }

  async triggerKyc(body: any) {
    const userData = {
      "email": body.aadhaar,
    }
    console.log(userData)
    const response = await lastValueFrom(this.httpService.post("http://64.227.185.154:8000/otp/generate", userData));
    console.log(response)
    if (response.data) {
      if (response.data.status == 200)
        return { status: 200, error: "" }
      else
        throw new UnauthorizedException(response.data.data)
    } else {
      throw new UnauthorizedException("Cannot fulfil request!")
    }
  }

  async register(body: any) {
    // TODO: sanitize all inputs
    const userData = {
      "email": body.aadhaar,
      "otp": body.otp,
    }
    const response = await lastValueFrom(this.httpService.post("http://64.227.185.154:8000/user/verify/", userData));
    if (response.data) {
      if (response.data.status == 200) {
        const registrationData = {
          "registration": {
            "generateAuthenticationToken": true,
            "applicationId": "a789504e-06e5-4213-b326-e6c75a7489e8",
            "roles": [
              "Student"
            ]
          },
          "user": {
              "username": body.aadhaar,
              "password": body.password
          }
        }

        const headers = {
          'Authorization': process.env.FUSION_API_KEY
        }
        try {
          const fusionResponse = await lastValueFrom(this.httpService.post("https://auth.konnect.samagra.io/api/user/registration/", registrationData, {headers: headers}));
          return fusionResponse.data.token
        }
        catch (err) {
          return err
        }
      }
      else
        throw new UnauthorizedException(response.data.data)
    } else {
      throw new UnauthorizedException("Cannot fulfil request!")
    }
  }
}
