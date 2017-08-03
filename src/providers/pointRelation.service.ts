import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UtilsService } from './utils.service';
import { AppConfig } from '../app/app.config';
import { School } from '../model/school';
import { Role } from '../model/role';
import { Avatar } from '../model/avatar';
import { Teacher } from '../model/teacher';
import { Student } from '../model/student';
import { Point } from '../model/point';
import { PointRelation } from '../model/pointRelation';
import { Grade } from '../model/grade';
import { Matter } from '../model/matter';

@Injectable()
export class PointRelationService {

  constructor(
    public http: Http,
    public utilsService: UtilsService) { }

  /**
   * Returns the list of students by a group id.
   * @return {Array<PointRelation>} returns the list of points
   */
   public getPointRelation(): Observable<Array<PointRelation>> {     

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var url: string = this.utilsService.getMySchoolUrl() + AppConfig.POINTSRELATION_URL;   

    return this.http.get(url, options)
      .map((response: Response, index: number) => PointRelation.toObjectArray(response.json()))
  }

  /**
   * This method returns all the relation points of the student in this group
   * of the current students logged into the application
   * @return {Array<PointRelation>} returns the list of groups
   */
  public getMyStudentPoints(): Observable<Array<PointRelation>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var url: string = this.utilsService.getMyUrl() + AppConfig.POINTSRELATION_URL;   

    return this.http.get(url, options)
      .map((response: Response, index: number) => PointRelation.toObjectArray(response.json()))
  }
  

  /**
   * This method returns all the relation points of the student in this group
   * of the current students logged into the application
   * @return {Array<PointRelation>} returns the list of groups
   */
  public getMyGroupPoints(id: string): Observable<Array<PointRelation>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var url: string = AppConfig.GROUP_URL + '/' + id + AppConfig.POINTSRELATION_URL;   

    return this.http.get(url, options)
      .map((response: Response, index: number) => PointRelation.toObjectArray(response.json()))
  }
  
  /**
   * This method calls the REST API for performing a post of pointRelation against
   * the common services for the application
   * @param {PointRelation} pointRelation Object with login credentials
   * @return {Observable<PointRelation>} observable object with the login response
   */
  public postPointRelation(pointRelation: PointRelation): Observable<Response> {
    
	let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });
	
	var url: string;
	url = AppConfig.POINTRELATION_URL;  

    return this.http.post(url, pointRelation)
      .map(response => {        
        return response;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }
}


