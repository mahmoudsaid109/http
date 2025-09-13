import {
  Component,
  DestroyRef,
  inject,
  Injectable,
  OnInit,
  signal,
} from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  isFeatching = signal(false);
  error = signal('');
  places = signal<Place[] | undefined>(undefined);
  private palcesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);
  // constructor(private httpClient: HttpClient) {}
  ngOnInit() {
    this.isFeatching.set(true);
    const subscription = this.palcesService.loadAvailablePlaces().subscribe({
      next: (places) => {
        this.places.set(places);
      },
      error: (error: Error) => {
        this.error.set(error.message);
      },
      complete: () => {
        this.isFeatching.set(false);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
  onSelectedPlace(selectedPlace: Place) {
    const subscription = this.palcesService
      .addPlaceToUserPlaces(selectedPlace.id)
      .subscribe({
        next: (resData) => {
          console.log(resData);
        },
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
