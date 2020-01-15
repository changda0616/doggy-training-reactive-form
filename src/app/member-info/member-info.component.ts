import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-member-info',
  templateUrl: './member-info.component.html',
  styleUrls: ['./member-info.component.scss']
})
export class MemberInfoComponent implements OnInit {
  form: FormGroup;

  fakeTeam = [{
    name: 'A',
    isRequire: true
  }, {
    name: 'B',
    isRequire: false
  },
  {
    name: 'C',
    isRequire: true
  }];

  constructor() { }

  ngOnInit() {

  }

}
