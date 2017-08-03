import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UtilsService } from './utils.service';
import { AvatarService } from './avatar.service';
import { GradeService } from './grade.service';
import { MatterService } from './matter.service';
import { AppConfig } from '../app/app.config';
import { Group } from '../model/group';
import { PointRelation } from '../model/pointRelation';
import { Grade } from '../model/grade';
import { Matter } from '../model/matter';
import { Student } from '../model/student';


@Injectable()
export class GroupService {

  constructor(
    public http: Http,
    public utilsService: UtilsService,
    public avatarService: AvatarService,
    public gradeService: GradeService,
    public matterService: MatterService) { }

  /**
   * This method returns all the information of the groups
   * of the current teacher logged into the application
   * @return {Array<Group>} returns the list of groups
   */
  public getMyGroups(): Observable<Array<Group>> {

    var ret: Array<Group> = new Array<Group>();

    return Observable.create(observer => {
      this.getGroups().subscribe(
        groups => {
          groups.forEach(group => {
            this.gradeService.getGrade(group.gradeId).subscribe(
              grade => {
                group.grade = grade;
                this.matterService.getMatter(group.matterId).subscribe(
                  matter => {
                    group.matter = matter;
                    ret.push(group);
                    if (ret.length === groups.length) {
                      observer.next(ret);
                      observer.complete();
                    }
                  }, error => observer.error(error))
              }, error => observer.error(error))
          });
        }, error => observer.error(error)
      )
    });
  }
    

  /**
   * Returns the list of students by a group id.
   * @return {Array<Stuent>} returns the list of students
   */
  public getMyGroupStudents(id: string): Observable<Array<Student>> {

    var ret: Array<Student> = new Array<Student>();

    return Observable.create(observer => {
      this.getGroupStudents(id).subscribe(
        students => {
          students.forEach(student => {
            this.avatarService.getAvatar(student.avatarId).subscribe(
              avatar => {
                student.avatar = avatar;
                ret.push(student);
                if (ret.length === students.length) {
                  observer.next(ret);
                  observer.complete();
                }
              }, error => observer.error(error))
          });
        }, error => observer.error(error)
      )
    });
  }

  /**
   * Returns the list of students by a group id.
   * @return {Array<Student>} returns the list of students
   */
  private getGroupStudents(id: string): Observable<Array<Student>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var count: number = 0;
    var url: string = AppConfig.GROUP_URL + '/' + id + AppConfig.STUDENTS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Student.toObjectArray(response.json()))
  }

  /**
   * Returns the groups with the one level information of the current
   * logged in user into the application
   * @return {Array<Group>} returns the list of groups
   */
  private getGroups(): Observable<Array<Group>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var count: number = 0;
    var url: string = this.utilsService.getMyUrl() + AppConfig.GROUPS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Group.toObjectArray(response.json()))
  }

}
