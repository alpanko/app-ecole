import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MathComponent } from './math/math.component';
import { PROGRESS_STORE, LocalStorageProgressStore } from './core/progress/progress.store';

@NgModule({
  declarations: [AppComponent, HomeComponent, MathComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot([
    { path: '', component: HomeComponent },
    { path: 'math', component: MathComponent }
  ])],
  providers: [
    { provide: PROGRESS_STORE, useClass: LocalStorageProgressStore }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
