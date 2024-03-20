import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private _http: HttpClient) {
  }

  getMetadata(tokenUri: string) {
    return this._http.get(`https://ipfs.io/ipfs/${tokenUri}`);
  }
}
