import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private subscription = new Subscription();
  signupForm: FormGroup = new FormGroup({});
  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.signupForm = this.fb.group({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(21),
      ]),
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(21),
        Validators.pattern('[a-zA-Z]*'),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(21),
        Validators.pattern('[a-zA-Z]*'),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(31),
        Validators.email,
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('(01)[0-9]{9}'),
      ]),
    });
  }

  ngOnInit(): void { }

  signup(data: any) {
    const UserData = data.value;
    const formData = new FormData();
    {
      UserData.enabled = true;
      UserData.role = 'uouo';
      formData.append('user', JSON.stringify(UserData));
      this.subscription.add(this.userService.signup(formData).subscribe((response) => {
        if (response) {
          this.router.navigate(['/login']);
        }
      }));
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }

}
