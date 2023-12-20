import { Component, ElementRef, EventEmitter, Input, NgZone, Output, ViewChild } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig, NgxPaypalComponent, PayPalScriptService } from 'ngx-paypal';

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss']
})
export class PaypalComponent {
  @ViewChild('paypalButton', { static: true }) paypalButton!: NgxPaypalComponent;
  @Output() onClose = new EventEmitter();
  @Input() currency!: string
  @Input() amount!: string
  public payPalConfig?: any;
  showSuccess: boolean = false;
  showCancel: boolean = false;
  showError: boolean = false;

  constructor(private zone: NgZone, private paypalScriptService: PayPalScriptService) { }
  ngOnInit(): void {
    this.initConfig();
    console.log(this.payPalConfig)
    console.log(this.payPalConfig.createOrderOnClient(''))
  }

  private initConfig(): void {
    // this.paypalScriptService.registerPayPalScript({
    //   clientId: 'AbLhGGOMRDQpgRVSaYa_6CkQFSrjzM3bOaOWG6TM72FCpNQhTHq_E3SZJIr7_4RJj3eErD6oSLfRzD7X',
    //   currency: this.currency
    // }, (payPalApi: any) => {
    //   console.log(payPalApi)
    // });
    this.zone.run(() => {
      this.payPalConfig = {
        currency: this.currency,
        clientId: 'AbLhGGOMRDQpgRVSaYa_6CkQFSrjzM3bOaOWG6TM72FCpNQhTHq_E3SZJIr7_4RJj3eErD6oSLfRzD7X',
        createOrderOnClient: (data: any) => <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: this.currency,
              value: this.amount,
              breakdown: {
                item_total: {
                  currency_code: this.currency,
                  value: this.amount
                }
              }
            },
            items: [{
              name: 'Enterprise Subscription',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: this.currency,
                value: this.amount,
              },
            }]
          }]
        },
        advanced: {
          commit: 'true'
        },
        style: {
          label: 'paypal',
          layout: 'vertical'
        },
        onApprove: (data: any, actions: { order: { get: () => Promise<any>; }; }) => {
          console.log('onApprove - transaction was approved, but not authorized', data, actions);
          actions.order.get().then((details: any) => {
            console.log('onApprove - you can get full order details inside onApprove: ', details);
          });

        },
        onClientAuthorization: (data: any) => {
          console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
          this.showSuccess = true;
        },
        onCancel: (data: any, actions: any) => this.closePayPalPopup(),
        onError: (err: any) => {
          console.log('OnError', err);
          this.showError = true;
        },
        onClick: (data: any, actions: any) => this.onButtonClick()
      };

    })
  }

  onButtonClick() {
    console.log('clicked')
    setTimeout(() => {
      this.closePayPalPopup()
    }, 5000)
  }

  closePayPalPopup() {
    console.log(this.paypalScriptService)
    console.log('closed')
    console.log(this.paypalButton)
    this.payPalConfig = undefined;
    this.paypalButton.reinitialize(this.payPalConfig);
    this.onClose.emit('close');
  }

}
