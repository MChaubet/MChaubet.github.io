import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { HomeComponent } from './pages/home/home.component';
import { WorkComponent } from './pages/home/work/work.component';
import { FeedbackComponent } from './pages/home/feedback/feedback.component';
import { NewsComponent } from './pages/home/news/news.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        // routes
        { path: '', component: HomeComponent },
        { path: 'work', component: WorkComponent },
        { path: 'feed', component: FeedbackComponent },
        { path: 'news', component: NewsComponent },
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
