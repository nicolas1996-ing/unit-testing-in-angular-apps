import { Component, OnInit } from '@angular/core';
import { Calculator } from './intro/calculator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  title = 'ng-testing-services';
  calculator = new Calculator();

  ngOnInit(): void {
    const rtaMul = this.calculator.multiply(3, 3);
    const rtaDiv = this.calculator.divide(3, 0);
    console.log(rtaMul === 9);
    console.log(rtaDiv === null);
  }
}
