import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '', redirectTo: 'main/scoreboard', pathMatch: 'full' },
	{ path: 'auth/login', loadChildren: './auth/login/login.module#LoginPageModule' },
	{ path: 'main/scoreboard', loadChildren: './main/scoreboard/scoreboard.module#ScoreboardPageModule' },
	{ path: 'main/leaderboard', loadChildren: './main/leaderboard/leaderboard.module#LeaderboardPageModule' },
	{ path: 'main/picks', loadChildren: './main/picks/picks.module#PicksPageModule' },
	{ path: 'main/profile', loadChildren: './main/profile/profile.module#ProfilePageModule' },
  { path: 'upgrade', loadChildren: './upgrade/upgrade.module#UpgradePageModule' },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
