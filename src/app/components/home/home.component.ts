import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
declare var Stripe;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	paymentService;

	amount: number;
	cardNumber: number;
	expMonth: number;
	expYear: number;
	cvcNumber: number;
	postCode: number;
	cardToken: string;
	userId: number;
	adminDisplay: boolean = false;

	static get parameters() {
		return [PaymentService];
	}

  constructor(paymentService) {
  	this.paymentService = paymentService;
  }

  ngOnInit() {
  	Stripe.setPublishableKey('pk_test_6pRNASCoBOKtIshFeQd4XMUh');
  }

  createToken(number, month, year, cvc) {
  	let cardDetail = {
  		number: number,
  		exp_month: month,
  		exp_year: year,
  		cvc: cvc
  	}

  	Stripe.card.createToken(cardDetail, (status, response) => {
  		if(response.error) {
  			console.log(response.error.message);
  		} else {
  			this.cardToken = response.id;
  		}
  	});
  }

  submit() {
  	if(this.cardNumber && this.expMonth && this.expYear && this.cvcNumber && this.amount) {
  		let isGoodCard: boolean = Stripe.card.validateCardNumber(this.cardNumber);
  		let isGoodExpiry: boolean = Stripe.card.validateExpiry(this.expMonth, this.expYear);
  		let isGoodCVC: boolean = Stripe.card.validateCVC(this.cvcNumber);
  		let validAmount: boolean = this.validateAmount();

	  	if(isGoodCard && isGoodExpiry && isGoodCVC && validAmount) {
	  		this.createToken(this.cardNumber, this.expMonth, this.expYear, this.cvcNumber);

	  		this.paymentService.submitPayment(this.cardToken, this.amount).subscribe(res => {
	  			if(res.success) {
	  				alert("success");
	  				this.adminDisplay = true;
	  				this.userId = res.userId;
	  				this.cardNumber = null;
	  				this.amount = null;
	  				this.cvcNumber = null;
	  				this.expMonth = null;
	  				this.expYear = null;
	  			}
	  		});
	  	} else {
	  		alert("Invalid detail");
	  	}
  	} else {
  		alert("Please enter all required input fields.")
  	}
  }

  validateAmount() {
  	let validNumber = Number(this.amount);

  	if(!isNaN(validNumber)) {
  		this.amount = validNumber;
  		return true;
  	} else {
  		return false;
  	}
  }

  acceptPayment() {
  	this.paymentService.acceptPayment(this.userId).subscribe(res => {
  		if(res.success) {
  			alert("Payment successfully accepted");
  			this.adminDisplay = false;
  		} else {
  			alert(res.errorMessage);
  		}
  	});
  }

  declinePayment() {
  	this.adminDisplay = false;
  }
}
