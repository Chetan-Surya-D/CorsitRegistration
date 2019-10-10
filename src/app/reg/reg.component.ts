import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {registration} from '../models/regModel';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.scss']
})
export class RegComponent implements OnInit {
  etext: string;
  stext: string;
  selectedFile = null;
  selectedFile2 = null;
  constructor(private http: HttpClient,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  preview(event) {
    this.handleFileSelect(event);
    let reader = new FileReader();
    reader.onload = function(e: any) {
      document.getElementById("img1").setAttribute('src', e.target.result);
    }
    reader.readAsDataURL(event.target.files[0]);
  }

  handleFileSelect(evt) {
    var files = evt.target.files;
    var file = files[0];
    if (files && file) {
      var reader = new FileReader();
      reader.onload =this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.selectedFile = btoa(binaryString);  // Converting binary string data.
    console.log(this.selectedFile);
  }

  create(record: NgForm) {
    // console.log(record.value);
    if (record.value.name != null && record.value.teamName != null && record.value.email != null && record.value.contact != null && record.value.usn != null && this.selectedFile != null) {
      var reg = {
        name: record.value.name,
        teamName: record.value.teamName,
        stdEmail: record.value.email,
        contact: record.value.contact,
        usn: record.value.usn,
        billImg: this.selectedFile
      };
      // console.log(record)
      this.http.post('https://corsit-registration.herokuapp.com/reg/register', reg).subscribe((response: any) => {
        console.log('recieved response');
        if (response.status === 'success') {
          this.stext = 'successfully registered';
          this.etext = '';
        } else if (response.status === 'fail') {
          this.etext = 'This USN is already registered you may want to edit the details';
          this.stext = '';
        }
      });
    } else {
      this.etext = "One or more fields are empty";
      this.stext = "";
    }
  }

  test() {
    this.selectedFile2 = "data:image/jpeg;base64," + this.selectedFile;
  }
}
