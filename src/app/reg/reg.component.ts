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
  constructor(private http: HttpClient,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  preview(event) {
    this.selectedFile = <File>event.target.files[0];
    let reader = new FileReader();
    reader.onload = function(e: any) {
      document.getElementById("img1").setAttribute('src', e.target.result);
    }
    reader.readAsDataURL(event.target.files[0]);
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.filename)
  }

  create(record: NgForm) {
    // console.log(record.value);
    if (record.value.name != null && record.value.teamName != null && record.value.email != null && record.value.contact != null && record.value.usn != null && this.selectedFile != null) {
      const formData = new FormData();
      formData.append('file', this.selectedFile)
      var reg = {
        name: record.value.name,
        teamName: record.value.teamName,
        stdEmail: record.value.email,
        contact: record.value.contact,
        usn: record.value.usn,
        billImg: formData
      };
      console.log(record)
      this.http.post('https://corsit-registration-git.herokuapp.com/reg/register', reg).subscribe((response: any) => {
        console.log('recieved response');
        if (response.status === 'success') {
          this.http.post('https://corsit-registration-git.herokuapp.com//reg/fileUpload', formData).subscribe((response: any) => {
            console.log(response)
          })
          this.stext = 'successfully registered';
          this.etext = '';
        } else if (response.status === 'fail') {
          this.etext = 'This USN is already registered you may want to edit the details';
          this.stext = '';
        } else {
          this.etext = "There is problem uploading the file please try again";
          this.stext = "";
        }
      });
    } else {
      this.etext = "One or more fields are empty";
      this.stext = "";
    }
  }
}
