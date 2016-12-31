import { NgStripePayPage } from './app.po';

describe('ng-stripe-pay App', function() {
  let page: NgStripePayPage;

  beforeEach(() => {
    page = new NgStripePayPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
