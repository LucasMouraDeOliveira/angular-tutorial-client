import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { Subject, Observable } from 'rxjs';
import { Hero } from '../hero';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((name: string) => this.heroService.searchHeroes(name))
    );
  }

  search(name: string) {
    this.searchTerms.next(name);
  }

}
