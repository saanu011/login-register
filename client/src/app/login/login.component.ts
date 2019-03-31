import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;
  loginForm: FormGroup;
  submitted = false;
  error = false;
  count = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
    ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username : ['', Validators.required],
      password : ['', Validators.required]
    });
  }
  get f() { return this.loginForm.controls; }

  authUser() {
    this.count += 1;
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const user = {
      username: this.username,
      password: this.password
    };

    return this.authService.loginUser(user).subscribe(data => {
      if (JSON.parse(data).success) {
        this.authService.storeUserData(JSON.parse(data).token, JSON.parse(data).user);
        console.log('logged in');
        this.router.navigate(['/profile']);
      } else {
        this.error = true;
        this.router.navigate(['/login']);
      }
    });
  }

}
