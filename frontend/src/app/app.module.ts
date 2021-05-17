import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';

import { TitleService } from './services/title.service';
import { TimeService } from './services/time.service';
import { ImageUploadService } from './services/image-upload.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NoPageComponent } from './components/no-page/no-page.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { PaintComponent } from './components/paint/paint.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'canvas', component: CanvasComponent },
  { path: 'paint', component: PaintComponent },
  { path: 'no-page', component: NoPageComponent },
  { path: '**', component: NoPageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NoPageComponent,
    CanvasComponent,
    PaintComponent
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
    MatSliderModule
  ],
  providers: [
    TitleService,
    TimeService,
    ImageUploadService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
