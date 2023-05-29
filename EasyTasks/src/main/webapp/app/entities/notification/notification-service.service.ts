import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationServiceService {
  private apiUrl = 'http://localhost:8080/api/notification/count';
  

  constructor(private _httpClient: HttpClient) { }
  showNotification(): Observable<number> {

    console.log("show parent");
    return this._httpClient.get<number>(this.apiUrl );
  }
}
