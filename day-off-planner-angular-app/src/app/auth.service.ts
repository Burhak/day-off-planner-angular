import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getAccessToken(): string {
    return 'Bearer ' +
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE1NzA2Mzk5NjYsImV4cCI6MTU3MDcyNjM2Niwicm9sZXMiOlsiQURNSU4iXX0.yOoCBDSPti7qekceBX_kwAR9ougQ_xH-E1STSr72obhSuEF4cxg9e0zNa6YUynahYjMhWlwCODq3M2gRLKk-vQ'
  }
}
