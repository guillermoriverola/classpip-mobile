import { Component } from '@angular/core';
import { MenuController, Refresher, NavController, PopoverController, Platform } from 'ionic-angular';
import { CallNumber, InAppBrowser } from 'ionic-native';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { IonicService } from '../../providers/ionic.service';
import { UtilsService } from '../../providers/utils.service';
import { SchoolService } from '../../providers/school.service';
import { PointService } from '../../providers/point.service';
import { BadgeService } from '../../providers/badge.service';
import { GroupService } from '../../providers/group.service';
import { PointRelationService } from '../../providers/pointRelation.service';
import { BadgeRelationService } from '../../providers/badgeRelation.service';
import { Role } from '../../model/role';
import { Group } from '../../model/group';
import { Teacher } from '../../model/teacher';
import { Student } from '../../model/student';
import { School } from '../../model/school';
import { Point } from '../../model/point';
import { Badge } from '../../model/badge';
import { SchoolPage } from '../../pages/school/school';
import { PopoverPage } from '../../pages/home/popover/popover';
import { TeachersPage } from '../../pages/teachers/teachers';
import { StudentsPage } from '../../pages/students/students';
import { GroupPage } from '../../pages/group/group';
import { PointsPage } from '../../pages/points/points';
import { PointRelation } from '../../model/pointRelation';
import { BadgesPage } from '../../pages/badges/badges';
import { BadgeRelation } from '../../model/badgeRelation';

@Component({
  selector: 'page-home',
  templateUrl: './home.html'
})
export class HomePage {

  public school: School;
  public teachersCount: number;
  public studentsCount: number;
  public pointsCount: number;
  public badgesCount: number;
  public groups: Array<Group>;
  public pointRelation: PointRelation = new PointRelation();
  public pointRelations: Array<PointRelation>;
  public pointRelationTotal: number;
  public badgeRelation: BadgeRelation = new BadgeRelation();
  public badgeRelations: Array<BadgeRelation>;
  public badgeRelationTotal: number;
  
  
  public studentsPoint = false;
  public groupCheckbox = false;
  public studentsBadge = false;
  public groupCheckbox2 = false;

  public myRole: Role;
  public role = Role;

  constructor(
    public ionicService: IonicService,
    public utilsService: UtilsService,
    public groupService: GroupService,
    public schoolService: SchoolService,
    public pointService: PointService,
    public badgeService: BadgeService,
    public pointRelationService: PointRelationService,
    public badgeRelationService: BadgeRelationService,
    public platform: Platform,
    public translateService: TranslateService,
    public popoverController: PopoverController,
    public menuController: MenuController,
    public navController: NavController) {
  }

  /**
   * Fires when the page appears on the screen.
   * Used to get all the data needed in page
   */
  public ionViewDidEnter(): void {

    this.menuController.enable(true);
    this.ionicService.showLoading(this.translateService.instant('APP.WAIT'));

    this.myRole = this.utilsService.role;

    this.getHomeInfo();
  }

    /**
   * GetPointsPage
   */
  public getPoints(): void {    
    this.navController.push(PointsPage)
  }
  
  /**
   * GetPointsPage
   */
  public getBadges(): void {    
    this.navController.push(BadgesPage)
  }

  /**
   * This method returns the school information from the
   * backend. This call is called on the constructor or the
   * refresh event
   * @param {Refresher} Refresher element
   */
  private getHomeInfo(refresher?: Refresher): void {

    // if the user is the SCHOOLADMIN get more information abaout the school
    // and the members
    if (this.myRole === Role.SCHOOLADMIN) {

      this.schoolService.getMySchool().finally(() => {
		refresher ? refresher.complete() : null;
		this.ionicService.removeLoading();
		}).subscribe(
        ((value: School) => {
          this.school = value;

          this.schoolService.getMySchoolTeachersCount().subscribe(
            ((value: number) => {
              this.teachersCount = value;

			  this.schoolService.getMySchoolPointsCount().subscribe(
				((value: number) => {
				  this.pointsCount = value;

         this.schoolService.getMySchoolBadgesCount().subscribe(
				((value: number) => {
				  this.badgesCount = value;
				
				this.schoolService.getMySchoolStudentsCount().subscribe(
					((value: number) => this.studentsCount = value),
					error => this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error));                
				}),
				error => this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error));
			}),
			error => this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error));
    }),
    error => this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error));
    }),
    error => this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error));

    } else if (this.myRole === Role.TEACHER) {

      this.schoolService.getMySchool().finally(() => {
        refresher ? refresher.complete() : null;
        this.ionicService.removeLoading();
      }).subscribe(
        ((value: School) => {
          this.school = value;
		  
		  this.schoolService.getMySchoolPointsCount().subscribe(
				((value: number) => {
				  this.pointsCount = value;

          this.schoolService.getMySchoolBadgesCount().subscribe(
				((value: number) => {
				  this.badgesCount = value;

			  this.groupService.getMyGroups().subscribe(
				((value: Array<Group>) => this.groups = value),
				error => this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error));
			}),      
			error => this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error));
		}),
		error => this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error));
    }),
		error => this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error));

    } else if (this.myRole === Role.STUDENT) {

      this.schoolService.getMySchool().finally(() => {
        refresher ? refresher.complete() : null;
        this.ionicService.removeLoading();
      }).subscribe(
        ((value: School) => {
			this.school = value;
		
			this.groupService.getMyGroups().subscribe(
				((value: Array<Group>) => this.groups = value),
				error => this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error));
		}),
        error => this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error));	  			
    }
  }

  /**
   * Method called from the home page to open the list of the
   * teachers of the school of the current user
   */
  public goToTeachers(): void {

    this.ionicService.showLoading(this.translateService.instant('APP.WAIT'));

    this.schoolService.getMySchoolTeachers().subscribe(
      ((value: Array<Teacher>) => this.navController.push(TeachersPage, { teachers: value })),
      error => {
        this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
        this.ionicService.removeLoading();
      });
  }

  /**
   * Method called from the home page to open the list of the
   * students of the school of the current user
   */
  public goToStudents(): void {

    this.ionicService.showLoading(this.translateService.instant('APP.WAIT'));

    this.schoolService.getMySchoolStudents().subscribe(
      ((value: Array<Student>) => this.navController.push(StudentsPage, { students: value })),
      error => {
        this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
        this.ionicService.removeLoading();
      });
  }

  /**
   * Method called from the home page to open the list of the
   * points of the school of the current user
   */
  public goToPoints(): void {

    this.ionicService.showLoading(this.translateService.instant('APP.WAIT'));

    this.schoolService.getMySchoolPoints().subscribe(
      ((value: Array<Point>) => this.navController.push(PointsPage, { points: value})),
      error => {
        this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
        this.ionicService.removeLoading();
      });
  }

  /**
   * Method called from the home page to open the list of the
   * points of the school of the current user
   */
  public goToBadges(): void {

    this.ionicService.showLoading(this.translateService.instant('APP.WAIT'));

    this.schoolService.getMySchoolBadges().subscribe(
      ((value: Array<Badge>) => this.navController.push(BadgesPage, { badges: value})),
      error => {
        this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
        this.ionicService.removeLoading();
      });
  }
  

  /**
  * Method called from the home page to open the list of the
  * students of the group of the current user
  */
  public goToGroup(group: Group): void {

    this.ionicService.showLoading(this.translateService.instant('APP.WAIT'));

    this.groupService.getMyGroupStudents(group.id).subscribe(
      ((value: Array<Student>) => this.navController.push(GroupPage, { students: value, group: group })),
      error => {
        this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
        this.ionicService.removeLoading();
      });
  }

  /**
   * Method called from the home page to open an external
   * browsser with an url. USer for social links
   * @param url {string} Url to open on an external browser
   */
  public openWebsite(url: string): void {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        new InAppBrowser(url, '_system');
      }
    });
  }

  /**
   * Method called from the home page to open the native
   * phone screen to call a number
   * @param number {string} Number to call with the native phone
   */
  public callNumber(number: string): void {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        CallNumber.callNumber(number, false);
      }
    });
  }

  /**
   * Method called from the home page to open the details of the
   * school of the current user
   */
  public goToSchool(): void {

    this.ionicService.showLoading(this.translateService.instant('APP.WAIT'));

    this.schoolService.getMySchool().subscribe(
      ((value: School) => this.navController.push(SchoolPage, { school: value })),
      error => {
        this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
        this.ionicService.removeLoading();
      });
  }

  private getPointsStudent(group: Group): void {
     this.studentsPoint=true
     this.studentsBadge=false 
    this.pointRelationService.getMyStudentPoints1(group.id).finally(() => { }).subscribe(
      ((value: Array<PointRelation>) => {this.pointRelations = value
        this.pointRelationTotal = 0         
        value.forEach(pointRelation=> {
          this.pointRelationTotal = this.pointRelationTotal+(pointRelation.value*pointRelation.point.value)
        });
      }),            
      error => this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error));
  }

  private getBadgesStudent(group: Group): void {
    this.studentsBadge=true
    this.studentsPoint=false
    this.badgeRelationService.getMyStudentBadges1(group.id).finally(() => { }).subscribe(
      ((value: Array<BadgeRelation>) => {this.badgeRelations = value
        this.badgeRelationTotal = 0         
        value.forEach(badgeRelation=> {
          this.badgeRelationTotal = this.badgeRelationTotal+(badgeRelation.value*badgeRelation.badge.value)
        });
      }),            
      error => this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error));
  } 


  private getGroupsCheckBox(): void { 
    this.groupCheckbox=true
    this.groupCheckbox2=false
    this.studentsBadge=false   
  }
   private getGroupsCheckBox2(): void {     
    this.groupCheckbox2=true
    this.groupCheckbox=false
    this.studentsPoint=false
  }
  private ocultarCheckBox(): void { 
    this.groupCheckbox=false
    this.groupCheckbox2=false     
    this.studentsPoint=false
    this.studentsBadge=false
  }



  /**
   * Thi method presents the more popover on the home
   * page to perform some common methods into the application
   */
  public presentPopover(event: UIEvent): void {

    let popover = this.popoverController.create(PopoverPage, { nav: this.navController });

    popover.present({
      ev: event
    });
  }
}
