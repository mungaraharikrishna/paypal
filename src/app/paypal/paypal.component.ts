import { Component, Input, NgZone } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig, PayPalScriptService } from 'ngx-paypal';

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss']
})
export class PaypalComponent {
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
    this.payPalConfig.createOrderOnClient('');
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
        onCancel: (data: any, actions: any) => {
          console.log('OnCancel', data, actions);
          this.showCancel = true;
          this.paypalScriptService.destroyPayPalScript()
        },
        onError: (err: any) => {
          console.log('OnError', err);
          this.showError = true;
        },
        onClick: (data: any, actions: any) => {
          console.log('onClick', data, actions);
        }
      };

    })
  }

}
