import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(
    private http: HttpClient
  ) { }

  upload(imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.http.post<ImageUploadReturnType>('/api/images', formData).pipe();
  }

  uploadMasked(maskedFile: File, mask: File, filename: string) {
    const formData = new FormData();
    formData.append('masked', maskedFile);
    formData.append('mask', mask);
    formData.append('filename', filename);
    return this.http.post<ImageUploadReturnType>('/api/maskeds', formData).pipe();
  }
}

interface ImageUploadReturnType {
  success: boolean,
  image?: string, // masked image
  result?: string,
  error?: string
}
