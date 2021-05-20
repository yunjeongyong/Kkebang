import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { pairwise, switchMap, takeUntil } from 'rxjs/operators';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { TimeService } from 'src/app/services/time.service';

@Component({
  selector: 'app-paint',
  templateUrl: './paint.component.html',
  styleUrls: ['./paint.component.css']
})
export class PaintComponent implements OnInit {

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('mask_canvas') maskCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('img') img: ElementRef<HTMLImageElement>;

  private src: string;
  context: CanvasRenderingContext2D;
  maskContext: CanvasRenderingContext2D;
  imageInfo: string;

  constructor(
    private router: Router,
    private timeService: TimeService,
    private imageUploadService: ImageUploadService
  ) { }

  async ngOnInit() {
    this.src = localStorage.getItem('image');
    if ( !this.src ) {
      alert(`you don't have an access to be here\nupload an iamge first`);
      this.router.navigate(['/']);
    }
  }

  async ngAfterViewInit() {
    this.img.nativeElement.src = this.src;
    await this.timeService.sleep(100);

    const canvasElement = this.canvas.nativeElement;
    this.context = canvasElement.getContext('2d');

    canvasElement.width = this.img.nativeElement.width;
    canvasElement.height = this.img.nativeElement.height;

    const maskCanvasElement = this.maskCanvas.nativeElement;
    this.maskContext = maskCanvasElement.getContext('2d');

    maskCanvasElement.width = this.img.nativeElement.width;
    maskCanvasElement.height = this.img.nativeElement.height;

    this.imageInfo = [
      `width: ${this.img.nativeElement.width}`,
      `height: ${this.img.nativeElement.height}`
    ].join('\n');

    this.context.lineWidth = 20;
    this.context.lineCap = 'round';
    this.context.strokeStyle = '#FFFFFF';

    this.maskContext.lineWidth = 20;
    this.maskContext.lineCap = 'round';
    this.maskContext.strokeStyle = '#FFFFFF';
    this.maskContext.fillStyle = '#0000000';
    this.maskContext.fillRect(0, 0, this.maskCanvas.nativeElement.width, this.maskCanvas.nativeElement.height);

    const backgroundImage = new Image();
    backgroundImage.src = this.src;
    backgroundImage.onload = () => this.context.drawImage(backgroundImage, 0, 0);

    fromEvent(canvasElement, 'mousedown')
      .pipe(
        switchMap(e => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasElement, 'mousemove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event    
              takeUntil(fromEvent(canvasElement, 'mouseup')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasElement, 'mouseleave')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point    
              pairwise()
            )
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasElement.getBoundingClientRect();
  
        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };
  
        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        this.context.beginPath();
        this.maskContext.beginPath();

        if ( prevPos ) {
          this.context.moveTo(prevPos.x, prevPos.y); // from
          this.context.lineTo(currentPos.x, currentPos.y);
          this.context.stroke();

          this.maskContext.moveTo(prevPos.x, prevPos.y);
          this.maskContext.lineTo(currentPos.x, currentPos.y);
          this.maskContext.stroke();
        }
      });
  }

  private canvasToImage(canvas: HTMLCanvasElement) {
    const image = canvas.toDataURL('image/png');

    const blobBin = atob(image.split(',')[1]);
    const array = [];
    for (let i=0; i<blobBin.length; array.push(blobBin.charCodeAt(i++)));

    const filename = this.src.substring(this.src.lastIndexOf('/') + 1);
    const blob: any = new Blob([new Uint8Array(array)], {type: 'image/png'});
    blob.lastModified = new Date().getTime();
    blob.name = filename;

    return <File> blob;
  }

  async sendMaskedImage() {
    const image = this.canvasToImage(this.canvas.nativeElement);
    const mask = this.canvasToImage(this.maskCanvas.nativeElement);
    const filename = this.src.substring(this.src.lastIndexOf('/') + 1);
    const result = await this.imageUploadService.uploadMasked(image, mask, filename).toPromise();

    if ( !result.success ) {
      alert('error occured:\n' + result.error);
      return;
    }

    // localStorage.setItem('masked', result.image);
    localStorage.setItem('result', result.result);
    console.log(result);
    this.router.navigate(['/result']);
  }

  onInputChange($event: any) {
    this.context.lineWidth = $event.value;
    this.maskContext.lineWidth = $event.value;
  }

  eraseAll() {
    this.src = localStorage.getItem('image');
    this.ngAfterViewInit();
  }

}
