import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { switchMap, catchError, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
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

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) { }

  get step1() {
    return this.form.get('step1') as FormGroup;
  }
  get team() {
    return this.form.get('team') as FormArray;
  }
  get step2() {
    return this.form.get('step2') as FormGroup;
  }

  get recommandationNumber() {
    return this.step2.get('recommandationNumber') as FormControl;
  }

  get recommandation() {
    return this.step2.get('recommandation') as FormControl;
  }


  ngOnInit() {

    this.initForm();

    this.recommandationNumber.valueChanges.pipe(
      filter(value => !!value),
      switchMap((value) => this.http.get(`${environment.api}/${value}`)
        .pipe(
          catchError(_ => {
            alert('查無此人');
            return of('');
          })
        ))
    ).subscribe(
      (val: any) => {
        this.recommandation.setValue(val.name);
      }
    );

  }

  onSubmit() {
    const result = {
      ...this.form.value,
      step2: {
        ...this.form.value.step2,
        recommandation: this.recommandation.value
      }
    };
    console.log(result);
    this.form.reset();
  }

  private initForm() {

    this.form = this.fb.group({
      step1: this.fb.group({
        name: ['', Validators.required],
        phone: ['', [Validators.required, Validators.minLength(7)]],
        team: this.fb.array(
          this.fakeTeam.map((member: any) =>
            this.fb.control(member.name, member.isRequire && Validators.required)
          )
        )
      }),
      step2: this.fb.group({
        recommandationNumber: ['', Validators.required],
        recommandation: [{ value: '', disabled: true }, Validators.required]
      })
    });

  }

  private initFormWithoutFB() {
    this.form = new FormGroup({
      step1: new FormGroup({
        name: new FormControl(['', Validators.required]),
        phone: new FormControl('', [Validators.required, Validators.minLength(7)])
      }),
      step2: new FormGroup({
        recommandationNumber: new FormControl(['', Validators.required]),
        recommandation: new FormControl([{ value: '', disabled: true }, Validators.required])
      })
    });
  }

}
