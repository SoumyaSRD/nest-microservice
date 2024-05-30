import { FilterQuery } from "mongoose";
import { Observable } from "rxjs";

export interface IUserRepository {
    findOne<TDocument>(filterQuery: FilterQuery<TDocument>): Observable<TDocument | any>;
}