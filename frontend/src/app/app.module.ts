import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TitleService } from './services/title.service';
import { TimeService } from './services/time.service';
import { ImageUploadService } from './services/image-upload.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NoPageComponent } from './components/no-page/no-page.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { LoadingDialog, PaintComponent } from './components/paint/paint.component';
import { ResultComponent } from './components/result/result.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'canvas', component: CanvasComponent },
  { path: 'paint', component: PaintComponent },
  { path: 'result', component: ResultComponent },
  { path: 'no-page', component: NoPageComponent },
  { path: '**', component: NoPageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NoPageComponent,
    CanvasComponent,
    PaintComponent,
    ResultComponent,
    LoadingDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled'
    }),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSliderModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  providers: [
    TitleService,
    TimeService,
    ImageUploadService
  ],
  exports: [
    LoadingDialog
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
