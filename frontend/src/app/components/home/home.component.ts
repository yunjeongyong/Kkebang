import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageUploadService } from 'src/app/services/image-upload.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  msg: string = '사진 불러오기';

  constructor(
    private imageUploadService: ImageUploadService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  async onFileChange(files: FileList) {
    if ( files.length == 0 ) return;

    this.msg = `'${files[0].name}' 불러오는 중...`;
    const result = await this.imageUploadService.upload(files[0]).toPromise();

    if ( !result.success ) {
      console.log(result.error);
      return;
    }

    localStorage.setItem('image', result.image);
    this.router.navigate(['/paint'])
  }

}
