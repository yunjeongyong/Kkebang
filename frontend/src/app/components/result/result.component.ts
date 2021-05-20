import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  imageSrc: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.imageSrc = localStorage.getItem('result');
    if ( !this.imageSrc ) {
      this.router.navigate(['/']);
    }
  }

}
