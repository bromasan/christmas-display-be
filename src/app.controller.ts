import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('helloWorld')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('getSayingsByUser/:username')
  public async getSayingsByUser(@Param() params) {
    const results = await this.appService.getSayings(params.username);
    return {
      body: JSON.stringify(results),
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, X-Requested-With,content-type,x-requested-by'
      },
    }
  }

  @Get('grabAllActiveSayings/:username')
  public async grabAllActiveSayings(@Param() params) {
    const results = await this.appService.grabAllActiveSayings(params.username);
    return {
      body: JSON.stringify(results),
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, X-Requested-With,content-type,x-requested-by'
      },
    }
  }

  @Post('addSaying')
  public async addSaying(@Req() req, @Body() body) {
    const results = await this.appService.addSaying(body.message, body.user);
    return {
      statusCode: 200,
      body: JSON.stringify(req.body),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, X-Requested-With,content-type,x-requested-by'
      },
    }
  }

  @Post('setSaying')
  public async setSayings(@Body() body, @Req() req) {
    const results = await this.appService.setSaying(body.sayingId, body.username);
    return {
      statusCode: 200,
      body: JSON.stringify(req.body),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, X-Requested-With,content-type,x-requested-by'
      },
    }
  }

  @Post('setToShuffle')
  public async setToShuffle(@Body() body, @Req() req) {
    const results = await this.appService.setSayingsToShuffle(body.username);
    return {
      statusCode: 200,
      body: JSON.stringify(req.body),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, X-Requested-With,content-type,x-requested-by'
      },
    }  }

  @Delete('deleteSaying/:sayingId')
  public async deleteSaying(@Param() param, @Req() req) {
    const results = await this.appService.deleteSaying(param.sayingId);
    return {
      statusCode: 200,
      body: JSON.stringify(req.body),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, X-Requested-With,content-type,x-requested-by'
      },
    }  }
}
