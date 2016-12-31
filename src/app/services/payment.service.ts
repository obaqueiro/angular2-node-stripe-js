import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class PaymentService {
	http: any;

	static get parameters() {
		return [Http];
	}

  constructor(http) {
  	this.http = http;
  }

  submitPayment(cardToken, amount) {
  	let searchUrl = "http://localhost:5000/user/donate";
  	let headers = new Headers({
  		'Content-Type': 'application/json'
  	});

  	let options = new RequestOptions({ headers: headers });
  	let data = {
  		cardToken: cardToken,
      amount: amount
  	}

  	return this.http.post(searchUrl, JSON.stringify(data), options)
  	.map(res => res.json());
  }

  acceptPayment(userId) {
    let searchUrl = "http://localhost:5000/admin/donate/accept";
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let options = new RequestOptions({ headers: headers });
    let data = {
      userId: userId
    }

    return this.http.post(searchUrl, JSON.stringify(data), options)
    .map(res => res.json());
  }

  private extractData(res: Response) {
  	let body = res.json();
  	return body.data || { } ;
  }

}
