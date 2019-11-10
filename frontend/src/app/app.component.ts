import { Component, OnInit } from '@angular/core';
import { HolamundoService } from './holamundo-service/holamundo-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Frontend';
  message = 'Sin mensaje';

  constructor(private holaMundoService: HolamundoService) { }

  ngOnInit() {
  }

  clickButton() {
    this.holaMundoService.getHolaMundo().subscribe((m) => this.message = m.holamundo);
  }

}
