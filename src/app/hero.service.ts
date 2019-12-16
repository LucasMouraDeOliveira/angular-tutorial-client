import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-hero';
import { Observable, of} from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'http://localhost:8080/hero';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) {}

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`fetch hero with id ${id}`)),
        catchError(this.handleError<Hero>('getHero'))
      );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero ${hero.id}`)),
      catchError(this.handleError<any>('update hero'))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero ${newHero.id}`)),
      catchError(this.handleError<Hero>('add hero'))
    );
  }

  deleteHero(hero: Hero): Observable<any> {
    const url = `${this.heroesUrl}/${hero.id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero with id ${hero.id}`)),
      catchError(this.handleError<Hero>('delete hero'))
    );
  }

  searchHeroes(name: string): Observable<Hero[]> {

    if (!name.trim()) {
      return of([]);
    }

    const url = `${this.heroesUrl}/find?name=${name}`;
    return this.http.get<Hero[]>(url, this.httpOptions).pipe(
      tap(_ => this.log(`found heroes with name matching ${name}`)),
      catchError(this.handleError<Hero[]>('search heroes'))
    );
  }

  private log(message: string) {
    this.messageService.add(`HeroService : ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
