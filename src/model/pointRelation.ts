export class PointRelation {

  private _id: string;  
  private _value: number;  
  private _pointId: string;
  private _groupId: string;
  private _studentId: string;
  private _schoolId: string;
  

  constructor(value?: number,  pointId?: string, groupId?: string,  studentId?: string, schoolId?: string) {    
    this._value = value;    
    this._pointId = pointId;
	  this._groupId = groupId;
    this._studentId = studentId;
    this._schoolId = schoolId;       
  }
    
  /* tslint:disable */
  static toObject(object: any): PointRelation {
    /* tslint:enable */
    let result: PointRelation = new PointRelation();
    if (object != null) {
      result.id = object.id;      
      result.value = object.value;      
      result.pointId = object.pointId;
	    result.groupId = object.groupId;
      result.studentId = object.studentId;
      result.schoolId = object.schoolId;
    }
    return result;
  }

  /* tslint:disable */
  static toObjectArray(object: any): Array<PointRelation> {
    /* tslint:enable */
    let resultArray: Array<PointRelation> = new Array<PointRelation>();
    if (object != null) {
      for (let i = 0; i < object.length; i++) {
        resultArray.push(PointRelation.toObject(object[i]));
      }
    }
    return resultArray;
  }
  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }  

  public get value(): number {
    return this._value;
  }

  public set value(value: number) {
    this._value = value;
  }

  public get pointId(): string {
    return this._pointId;
  }

  public set pointId(value: string) {
    this._pointId = value;
  }
  
  public get groupId(): string {
    return this._groupId;
  }

  public set groupId(value: string) {
    this._groupId = value;
  }

  public get studentId(): string {
    return this._studentId;
  }

  public set studentId(value: string) {
    this._studentId = value;
  }

  public get schoolId(): string {
    return this._schoolId;
  }

  public set schoolId(value: string) {
    this._schoolId = value;
  }

}