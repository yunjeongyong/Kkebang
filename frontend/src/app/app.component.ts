import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TitleService } from './services/title.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private titleSerivce: TitleService,
    private router: Router
  ) { }

  ngOnInit() {
    this.titleSerivce.setTitle('Edge-connect');
    localStorage.clear();
  }

  toHome() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

}
