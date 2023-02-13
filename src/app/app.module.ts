import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import {MatTreeModule} from '@angular/material/tree';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import { NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './navBar/nav-bar/nav-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './menu/menu.component';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { FooterComponent } from './footer/footer.component';
import { GraphComponent } from './graph/graph.component';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';
import { ChecklistComponent } from './checklist/checklist.component';
import { ChecklistdetailComponent } from './checklistdetail/checklistdetail.component';
import { NbThemeModule, NbLayoutModule, NbCardModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AnlageComponent } from './anlage/anlage.component';
import { InfoPageComponent } from './info-page/info-page.component';
import { AnlageDetailsComponent } from './anlage-details/anlage-details.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';


PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    MenuComponent,
    TreeViewComponent,
    FooterComponent,
    GraphComponent,
    ChecklistComponent,
    ChecklistdetailComponent,
    AnlageComponent,
    InfoPageComponent,
    AnlageDetailsComponent
  ],
  exports: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDividerModule,
    MatSidenavModule,
    MatGridListModule,
    MatSelectModule,
    PlotlyModule,
    MatCardModule,
    HttpClientModule,
    MatTreeModule,
    MatCheckboxModule,
    MatTabsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbCardModule,
    FlexLayoutModule,
    NgChartsModule,
    FormsModule
   
 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
