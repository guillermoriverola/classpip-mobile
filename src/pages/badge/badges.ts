import { Component } from '@angular/core';
import { Refresher, Platform, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { IonicService } from '../../providers/ionic.service';
import { SchoolService } from '../../providers/school.service';
import { BadgeService } from '../../providers/badge.service';
import { BadgeRelationService } from '../../providers/badgeRelation.service';
import { BadgePage } from './badge/badge';
import { Badge } from '../../model/badge';
import { BadgeRelation } from '../../model/badgeRelation';

@Component({
  selector: 'page-badges',
  templateUrl: './badges.html'
})

export class BadgesPage {

  public createBadge: Badge = new Badge();

  public badges: Array<Badge>;
  public badgesCount: number;
  public badgeRelations: Array<BadgeRelation>;
  public badgeRelation: BadgeRelation; 
  public isDisabled = true;
  public enablePostBadge = false;

  constructor(
    public navParams: NavParams,
    public navController: NavController,
    public ionicService: IonicService,
    public schoolService: SchoolService,
    public badgeService: BadgeService,
    public badgeRelationService: BadgeRelationService,
    public translateService: TranslateService) {


    this.createBadge.name = 'Excelente en Examen';
    this.createBadge.image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzYOexxFJGkbWQ5Hx33loFtjYHZvgOgEthwd5FvWOFmARH-DyOW8fg9g';
    this.createBadge.value = 1;
    this.createBadge.id = '100008';
    this.createBadge.schoolId = 1;
    this.createBadge.teacherId = 1000;

    this.badges = this.navParams.data.badges;
  }

  /**
   * Fires when the page appears on the screen.
   * Used to get all the data needed in page
   */
  public ionViewDidEnter(): void {

    this.ionicService.removeLoading();
	this.getBadgesCount();
	this.getBadges();
  }

  /**
   * GetBadgePage
   */
  public getBadge(): void {    
    this.navController.push(BadgePage)
  }  
   
  private getBadges(refresher?: Refresher): void {	  
  this.schoolService.getMySchoolBadges().finally(() => {
      refresher ? refresher.complete() : null;
    }).subscribe(
      ((value: Array<Badge>) => this.badges = value),
      error => this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error));
  }

  private getBadgesRelation(): void {	  
  this.badgeRelationService.getBadgeRelation().subscribe(
      ((value: Array<BadgeRelation>) => this.badgeRelations = value),
      error => this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error));
      this.isDisabled=false
  }
   private getBadgesRelation2(): void {
     this.isDisabled=true
  }

  private getPostBadge(): void {
     this.enablePostBadge=true
  }
  
  private getBadgesCount(refresher?: Refresher): void {
  this.schoolService.getMySchoolBadgesCount().finally(() => {
              refresher ? refresher.complete() : null;
              this.ionicService.removeLoading();
              }).subscribe(
                ((value: number) => this.badgesCount = value),
                error => this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error));
  }
  /**
   * Method called from the home page to open the list of the
   * students of the school of the current user
   */
  public goToBadgeDetail(badge: Badge): void {
    this.navController.push(BadgePage, { badge: Badge })
  }

  private postBadge(): void {
	  this.badgeService.postBadge(this.createBadge).subscribe(
      response => {
        this.enablePostBadge=false		
      },
      error => {        
        this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
      });     
  }
  
}
