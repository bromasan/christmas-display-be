import { Injectable } from '@nestjs/common';
import { DynamoDB } from '@aws-sdk/client-dynamodb';

@Injectable()
export class AppService {
  dynamodb = new DynamoDB({region: 'us-east-1'});

  constructor () {
  }

  getHello(): string {
    return 'Hello World!';
  }

  public async setSayingsToShuffle(username: string) {
    try {
      const params = {
        FilterExpression: "userName = :username",
        ExpressionAttributeValues: {
          ":username": {S: username},
        },
        TableName: 'Sayings',
      }
      const results = await this.dynamodb.scan(params);
      results?.Items?.forEach(res => {
        const params = {
          Item: {
            ...res,
            'active': { S: 'A' }
          },
          TableName: 'Sayings',
        }
        this.dynamodb.putItem(params, (err, data) => {
          if (err) {
            console.error("Can't add saying");
          } else {
            console.log("Succeeded adding a saying: ", data);
          }
        });
      })
    } catch (err) {
      console.error(err);
    }
  }

  public async setAllToInactive(username: string) {
    try {
      const params = {
        FilterExpression: "userName = :username",
        ExpressionAttributeValues: {
          ":username": {S: username},
        },
        TableName: 'Sayings',
      }
      const results = await this.dynamodb.scan(params);
      results?.Items?.forEach(res => {
        const params = {
          Item: {
            ...res,
            'active': { S: 'I' }
          },
          TableName: 'Sayings',
        }
        this.dynamodb.putItem(params, (err, data) => {
          if (err) {
            console.error("Can't add saying");
          } else {
            console.log("Succeeded adding a saying: ", data);
          }
        });
      })
    } catch (err) {
      console.error(err);
    }
  }

  public async getSayings(username: string) {
    try {
      const params = {
        FilterExpression: "userName = :username",
        ExpressionAttributeValues: {
          ":username": {S: username},
        },
        TableName: 'Sayings',
      }
      const results = await this.dynamodb.scan(params);
      console.log(results.Items);
      return results?.Items;
    } catch (err) {
      console.error(err);
    }
  }

  public async addSaying(message: string, user: string) {
    try {
      const resultParams = {
        TableName: 'Sayings',
        Key: {
          'userName': {'S': user},
        },
      }
      const results = await this.dynamodb.scan(resultParams);
      let sayingIdNum = results?.Items?.length;

      let sameNumber = undefined;
      while (!sameNumber) {
        sameNumber = results?.Items.find(item => item.sayingId.S === `${user}-${sayingIdNum}`);
        console.log(results?.Items, sameNumber, sayingIdNum);
        if (sameNumber) {
          sayingIdNum += 1;
        }
      }

      
      console.log('Length', results?.Items?.length, results?.Items);
      const params = {
        TableName: 'Sayings',
        Item: {
          'sayingId': {S: `${user}-${sayingIdNum}`},
          'userName': {S: user},
          'message': {S: message},
          'active': {S: 'A'},
        }
      }
      this.dynamodb.putItem(params, (err, data) => {
        if (err) {
          console.error("Can't add saying");
        } else {
          console.log("Succeeded adding a saying: ", data);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  public async setSaying(sayingId: string[], username: string) {
    try {
      await this.setAllToInactive(username);
      sayingId.forEach(id => {
        const params = {
          ExpressionAttributeNames: {
            "#A": "active"
          },
          ExpressionAttributeValues:{
            ":a": {S: 'A'}
          },
          Key:{
            "sayingId": {S: id},
          },
          ReturnValues:"UPDATED_NEW",
          TableName: 'Sayings',
          UpdateExpression: "SET #A = :a",
        }
        this.dynamodb.updateItem(params, (err, data) => {
          if (err) {
            console.error("Can't add saying", err);
          } else {
            console.log("Succeeded adding a saying: ", data);
          }
        });
      })
      
    } catch (err) {
      console.error(err);
    }
  }

  public async grabAllActiveSayings(username: string) {
    try {
      const params = {
        FilterExpression: "userName = :username AND active = :active",
        ExpressionAttributeValues: {
          ":username": {S: username},
          ":active": {S: 'A'}
        },
        TableName: 'Sayings',
      }
      const results = await this.dynamodb.scan(params);
      return results?.Items;
    } catch (err) {
      console.error(err);
    }
  }

  public async deleteSaying(sayingId: string) {
    try {
      const params = {
        Key: {
          "sayingId": {S: sayingId}
        },
        TableName: 'Sayings',
      }
      const results = await this.dynamodb.deleteItem(params);
      return results;
    } catch (err) {
      console.error(err);
    }
  }

}
