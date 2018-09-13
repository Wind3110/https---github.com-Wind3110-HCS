import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Service/AuthService/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customerhome',
  templateUrl: './customerhome.component.html',
  styleUrls: ['./customerhome.component.css']
})
export class CustomerhomeComponent implements OnInit {
  id: string;

  constructor(private router: Router, public authService: AuthService) { }

  ngOnInit() {
    this.id = localStorage.getItem('tokencustomer');
  }

  logout(): void {
    console.log("Logout");
    this.authService.logoutCustomer();
    this.router.navigate(['/customerpage']);
  }

}
