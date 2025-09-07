import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { HomeComponent } from './pages/home/home.component';
import { WorkComponent } from './pages/home/work/work.component';
import { FeedbackComponent } from './pages/home/feedback/feedback.component';
import { NewsComponent } from './pages/home/news/news.component';
import { MultiTwitchComponent } from './pages/home/twitch/multi-twitch/multi-twitch.component';
import { TwitchStreamComponent } from './pages/home/twitch/twitch-stream/twitch-stream.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        // routes
        { path: '', component: HomeComponent },
        { path: 'work', component: WorkComponent },
        { path: 'feed', component: FeedbackComponent },
        { path: 'news', component: NewsComponent },
        { path: 'twitch', component: MultiTwitchComponent },
        { path: 'twitch-detail', component: TwitchStreamComponent },
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
