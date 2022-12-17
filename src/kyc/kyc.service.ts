import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { STATUS_CODES } from 'http';
import { lastValueFrom } from 'rxjs';

@Injectable()
export default class KycService {
  constructor(private readonly httpService: HttpService) { }

  async registerUser(body: any) {
    const userData = {
      "email": body.email,
      "password": body.password
    }
    const response = await lastValueFrom(this.httpService.post("http://localhost:8000/register/", userData));
    if (response.data) {
      if (response.data.status == 200)
        return { status: 200, error: "" }
      else
        throw new UnauthorizedException(response.data.data)
    } else {
      throw new UnauthorizedException("Cannot fulfil request!")
    }
  }

  async verifyUser(body: any) {
    const userData = {
      "email": body.email,
      "otp": body.otp
    }
    const response = await lastValueFrom(this.httpService.post("Http://localhost:8000/verify/", userData))
    if (response.data) {
      if (response.data.status == 200)
        return { statusCode: 200, error: "" }
      else
        throw new UnauthorizedException(response.data.data)
    } else {
      throw new UnauthorizedException("Cannot fulfil request!")
    }
  }
}
