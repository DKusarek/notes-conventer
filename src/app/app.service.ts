import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, delay } from 'rxjs/operators';
import { of } from 'rxjs';


import { config } from '../../config';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  sendRequest(image: any, handwriting: boolean): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key": config.vision.key1
      }),
      observe: "response" as 'body'
    };

    let uri = `${config.vision.endPoint}vision/v2.0/recognizeText?mode=${handwriting ? 'Handwritten' : 'Printed'}`;
    
    return this.http.post(uri, this.makeblob(image, 'image/jpeg'), httpOptions)
      .pipe(
        delay(1000),
        map(
          (response: any) => {
            return response.headers.get('operation-location');
          }
        ),
        catchError(err => of(err))
      )
  };

  recognizeText(requestUrl){
    if (requestUrl) {
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/octet-stream",
          "Ocp-Apim-Subscription-Key": config.vision.key1
        }),
        observe: "response" as 'body'
      };
      return this.http.get(requestUrl, httpOptions)
        .pipe(
          map((data: any) => {
            let text: string ='';
            if(data.body.status == "Succeeded"){
              data.body.recognitionResult.lines.forEach(line => {                                    
                  text+=`${line.text}\n`;
              });
            }
            return text;
          })
        );
  }
}



  makeblob(b64Data, contentType) {
    contentType = contentType || '';
    const sliceSize = 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
