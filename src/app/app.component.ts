import { Component, NgZone } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest, PayPalScriptService } from 'ngx-paypal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public payPalConfig?: any;
  showSuccess: boolean = false;
  showCancel: boolean = false;
  showError: boolean = false;
  currencyCode = 'USD';
  amount = '99.99';
  show = false
  constructor(private zone: NgZone, private paypalScriptService: PayPalScriptService) { }
  ngOnInit(): void {
    this.updateScriptTagParams('myScript', this.currencyCode)
  }

  updateScriptTagParams(scriptId: any, currency_code: any) {
    var scriptTag = document.getElementById(scriptId) as HTMLScriptElement;
    // Get the current script source URL
    var currentSrc = scriptTag.src;

    // Parse the URL to extract existing query parameters
    var url = new URL(currentSrc);
    var existingParams = url.searchParams;

    // Update or add new query parameters
    existingParams.set('currency', currency_code);
    // Set the updated URL as the new source for the script tag
    scriptTag.src = url.href;
  }


  update(currency_code: any) {
    this.zone.run(() => {
      this.show = false;
      this.currencyCode = currency_code;
      this.updateScriptTagParams('myScript', this.currencyCode)
    });
  }

  pay() {
    this.zone.run(() => {
      this.show = true;
    })
  }

}
