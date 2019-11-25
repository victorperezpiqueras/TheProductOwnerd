import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';
import { HolaMundoService } from '@app/hola-mundo-service/hola-mundo-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;

  title = 'Frontend';
  message = 'Sin mensaje';

  constructor(private quoteService: QuoteService, private holaMundoService: HolaMundoService) {}

  ngOnInit() {
    this.isLoading = true;
    this.quoteService
      .getRandomQuote({ category: 'dev' })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((quote: string) => {
        this.quote = quote;
      });
  }

  clickButton() {
    this.holaMundoService.getHolaMundo().subscribe((m: any) => (this.message = m.holamundo));
  }
  resetButton() {
    this.message = 'Sin mensaje';
  }
}
