import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

import { ZoomMtg } from '@zoomus/websdk';

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.4.5/lib', '/av');

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // setup your signature endpoint here: https://github.com/zoom/meetingsdk-sample-signature-node.js
  signatureEndpoint = 'https://eshtri-aqar.herokuapp.com';
  // This Sample App has been updated to use SDK App type credentials https://marketplace.zoom.us/docs/guides/build/sdk-app
  sdkKey = 'rXc2aQ0Np3ODpOANWp5gbC5B7nWy0WuZDlN1s';
  meetingNumber = '123456789';
  role = 0;
  leaveUrl = 'http://localhost:4200';
  userName = 'Angular';
  userEmail = '';
  passWord = '';
  // pass in the registrant's token if your meeting or webinar requires registration. More info here:
  // Meetings: https://marketplace.zoom.us/docs/sdk/native-sdks/web/client-view/meetings#join-registered
  // Webinars: https://marketplace.zoom.us/docs/sdk/native-sdks/web/client-view/webinars#join-registered
  registrantToken = '';
  constructor(public httpClient: HttpClient, @Inject(DOCUMENT) document: any) {}

  ngOnInit() {
    document.getElementById('zmmtg-root').style.display = 'none';
  }

  getSignature() {
    this.httpClient
      .post(this.signatureEndpoint, {
        meetingNumber: this.meetingNumber,
        role: this.role,
      })
      .toPromise()
      .then((data: any) => {
        if (data.signature) {
          console.log(data.signature);
          this.startMeeting(data.signature);
        } else {
          console.log(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  startMeeting(signature: any) {
    document.getElementById('zmmtg-root').style.display = 'block';

    ZoomMtg.init({
      leaveUrl: this.leaveUrl,
      success: (success: any) => {
        console.log(success);
        ZoomMtg.join({
          signature: signature,
          meetingNumber: this.meetingNumber,
          userName: this.userName,
          sdkKey: this.sdkKey,
          userEmail: this.userEmail,
          passWord: this.passWord,
          tk: this.registrantToken,
          success: (success: any) => {
            console.log(success);
          },
          error: (error: any) => {
            console.log(error);
          },
        });
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}
