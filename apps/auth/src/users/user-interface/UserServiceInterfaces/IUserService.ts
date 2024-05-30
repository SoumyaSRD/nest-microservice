import { Observable } from "rxjs";

export interface IuserService {
    findOneByEmail(email: string): Observable<any>;
}