import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { DIDDocument, DidService } from 'src/did/did.service';

@Injectable()
export default class KycService {
  constructor(
    private readonly httpService: HttpService,
    private readonly didService: DidService
  ) { }

  async triggerKyc(aadhaar: string) {
    const userData = {
      "email": aadhaar,
    }
    let response: AxiosResponse<any, any>;
    try {
      response = await lastValueFrom(this.httpService.post("http://64.227.185.154:8000/otp/generate/", userData));
    }
    catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
    if (response.data) {
      if (response.data.status == 200)
        return { status: 200, error: "" }
      else
        throw new UnauthorizedException(response.data.data)
    } else {
      throw new UnauthorizedException("Cannot fulfil request!")
    }
  }

  async register(aadhaar: string, otp: string, username: string, password: string) {
    // TODO: sanitize all inputs
    const userData = {
      "email": aadhaar,
      "otp": otp,
    }
    console.log(userData);
    const response = await lastValueFrom(this.httpService.post("http://64.227.185.154:8000/otp/verify/", userData));
    console.log(response);
    if (response.data) {
      if (response.data.status == 200) {
        console.log("Verified");
        const registrationData = {
          "registration": {
            "generateAuthenticationToken": true,
            "applicationId": "a789504e-06e5-4213-b326-e6c75a7489e8",
            "roles": [
              "Student"
            ]
          },
          "user": {
            "username": username,
            "password": password
          }
        }

        const headers = {
          'Authorization': process.env.FUSION_API_KEY
        }
        console.log(headers);
        try {
          const fusionResponse = await lastValueFrom(this.httpService.post("https://auth.konnect.samagra.io/api/user/registration/", registrationData, { headers: headers }));
          const registrationDid = await this.createRegistrationDid(aadhaar, username);
          console.log({ fusionResponse, registrationDid });
          // return { fusionResponse, registrationDid };
          return registrationDid;
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

  private async createRegistrationDid(aadhaar: string, username: string): Promise<DIDDocument> {
    const didContent = {
      "alsoknownas": [`did:${aadhaar}:${username}`],
      "content": {
        "services": [
          {
            "id": "FusionAuth",
            "type": "FusionAuth",
            "serviceEndpoint": {
              "@context": "auth.konnect.samagra.io",
              "@type": "UserAuthEndpoint"
            }
          },
          {
            "id": "AadharMock",
            "type": "AadharMock",
            "serviceEndpoint": {
              "@context": "64.227.185.154:8000",
              "@type": "OtpVerificationEndpoint"
            }
          }
        ]
      }
    }

    try {
      const generatedDid = await this.didService.generateDID(didContent);
      console.log(generatedDid);
      return generatedDid;
    }
    catch (err) {
      throw new BadRequestException();
    }
  }
}
