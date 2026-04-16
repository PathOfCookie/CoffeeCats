import { Controller, All, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Controller()
export class ApiServiceController {
  constructor(private readonly httpService: HttpService) {}

  @All('auth/*')
  async proxyAuth(@Req() req: Request, @Res() res: Response) {
    const path = req.originalUrl;
    const url = `http://localhost:3001${path}`;
    
    console.log('Target URL:', url);
    
    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method,
          url: url,
          data: req.body,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log('Error:', axiosError.message);
      res.status(axiosError.response?.status || 500).json(axiosError.response?.data || { message: 'Internal server error' });
    }
  }

  @All('products/*')
  async proxyProducts(@Req() req: Request, @Res() res: Response) {
    const path = req.originalUrl;
    const url = `http://localhost:3002${path}`;
    
    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method,
          url: url,
          data: req.body,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      res.status(axiosError.response?.status || 500).json(axiosError.response?.data || { message: 'Internal server error' });
    }
  }

  @All('cats/*')
  async proxyCats(@Req() req: Request, @Res() res: Response) {
    const path = req.originalUrl;
    const url = `http://localhost:3003${path}`;
    
    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method,
          url: url,
          data: req.body,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      res.status(axiosError.response?.status || 500).json(axiosError.response?.data || { message: 'Internal server error' });
    }
  }

  @All('inventory/*')
  async proxyInventory(@Req() req: Request, @Res() res: Response) {
    const path = req.originalUrl;
    const url = `http://localhost:3004${path}`;
    
    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method,
          url: url,
          data: req.body,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      res.status(axiosError.response?.status || 500).json(axiosError.response?.data || { message: 'Internal server error' });
    }
  }
}