import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  url: any;
  text: string ='';
  handwritten: boolean = false;
  loading: boolean= false;
  constructor(private service: AppService) { }

  convert() {
    this.loading = true;
    this.service.sendRequest(this.url, this.handwritten).subscribe(data => {
      this.service.recognizeText(data).subscribe(data=>{
        this.text = data;
        this.loading = false;
      });
    });
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result.split(',')[1];
      }
    }
  }
}
