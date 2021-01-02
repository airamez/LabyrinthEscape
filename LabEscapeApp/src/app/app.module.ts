import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LabyrinthComponent } from './labyrinth/labyrinth.component';
import {ButtonModule} from 'primeng/button';
import {SplitterModule} from 'primeng/splitter';

@NgModule({
  declarations: [
    AppComponent,
    LabyrinthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    SplitterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
