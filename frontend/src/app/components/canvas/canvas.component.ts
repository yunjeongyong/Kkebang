import { Component, ElementRef, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('img') img: ElementRef<HTMLImageElement>;

  private readonly src = '/assets/images/unnamed.jpg';

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.img.nativeElement.src = this.src;

    const canvasElement = this.canvas.nativeElement;
    const context = canvasElement.getContext('2d');

    canvasElement.width = this.img.nativeElement.width;
    canvasElement.height = this.img.nativeElement.height;

    context.lineWidth = 10;
    context.lineCap = 'round';
    context.strokeStyle = '#006CFF';

    const backgroundImage = new Image();
    backgroundImage.src = this.src;
    backgroundImage.onload = () => context.drawImage(backgroundImage, 0, 0);

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

        context.beginPath();

        if ( prevPos ) {
          context.moveTo(prevPos.x, prevPos.y); // from
          context.lineTo(currentPos.x, currentPos.y);
          context.stroke();
        }
      });
  }

  imageDownload() {
    const image = this.canvas.nativeElement.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href = image;
  }

}
