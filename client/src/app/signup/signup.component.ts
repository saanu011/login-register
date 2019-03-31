import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../services/validate.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;
  registerForm: FormGroup;
  submitted = false;
  re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  constructor(
    private validateEntries: ValidateService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
    ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      name : ['', Validators.required],
      username : ['', Validators.required],
      email : ['', [Validators.required, Validators.pattern(this.re)]],
      password : ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  get f() { return this.registerForm.controls; }


  registerUser() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password
    };

    return this.authService.registerUser(user).subscribe(data => {
      if (JSON.parse(data).success) {
        this.router.navigate(['/login']);
      } else {
        const msg = JSON.parse(data).msg;
        this.router.navigate(['/signup']);
      }
    });
  }
}
