import { Observable } from "rxjs";
import { UserDto } from "../../dto/create-user.dto";

export interface IuserService {
    findAll(): Observable<UserDto[]>
    updateUser(user): Observable<UserDto>;
    deleteUser(id): Observable<any>;
    findOne(id: string): Observable<UserDto>
    findOneByEmail(email: string): Observable<UserDto>
    findAllWithFiltersAndPagination(filter, page, limit): Observable<UserDto[]>
}