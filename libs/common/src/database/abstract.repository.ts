import { NotFoundException } from "@nestjs/common";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { PinoLogger } from "nestjs-pino";
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AbstractDocument } from "./abstract.scema";

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
    // protected abstract readonly logger: PinoLogger
    constructor(protected readonly model: Model<TDocument>, private logger: PinoLogger) {

    }
    /* Async Await Method */
    /* async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
        const createdDocument = new this.readonlymodel({
            ...document, _id: new Types.ObjectId(),
        });
        return (await createdDocument.save()).toJSON() as unknown as TDocument
    } 
    
    findOne(filterQuery: FilterQuery<TDocument>): Observable<TDocument> {
           const document = new this.readonlymodel({
               ...document,
               _id: new Types.ObjectId(),
           });
   
           return from(createdDocument.save()).pipe(
               map((savedDocument) => savedDocument.toJSON() as unknown as TDocument)
           );
       } 
       
    async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
        const document = await this.model.findOne(filterQuery).lean<TDocument>(true)
        if (!document) {
            this.logger.warn("Document was Not found with filter query");
            throw new NotFoundException('Document was not found')
        }
        return document
    }

    async findOneAndUpdate(filterQuery: FilterQuery<TDocument>, update: UpdateQuery<TDocument>): Promise<TDocument> {
        const document = await this.model.findOneAndUpdate(filterQuery, update, {
            new: true
        }).lean<TDocument>(true)
        if (!document) {
            this.logger.warn("Document was Not found with filter query");
            throw new NotFoundException('Document was not found')
        }
        return document
    }

    async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
        const document = await this.model.find(filterQuery).lean<TDocument[]>(true)
        if (document.length) {
            this.logger.warn("Document was Not found with filter query");
            throw new NotFoundException('Document was not found')
        }
        return document
    }

    async findOneAndDelete(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
        const document = await this.model.findOneAndDelete(filterQuery).lean<TDocument>(true)
        if (!document) {
            this.logger.warn("Document was Not found with filter query");
            throw new NotFoundException('Document was not found')
        }
        return document
    }
 */

    /* Observable Method */

    create(document: Omit<TDocument, '_id'>): Observable<TDocument> {
        const createdDocument = new this.model({
            ...document, _id: new Types.ObjectId(),
        });
        return from(createdDocument.save().then(document => document.toJSON() as TDocument));
    }

    findOne<TDocument>(filterQuery: FilterQuery<TDocument>): Observable<TDocument | any> {
        return from(this.model.findOne(filterQuery).lean<TDocument>(true)).pipe(
            map((document) => {
                if (!document) {
                    throw new NotFoundException('Document was not found');
                }
                return document;
            }),
            catchError((error) => {
                this.logger.warn('Error finding document:', error);
                return throwError(() => new NotFoundException('Document was not found'));
            })
        );
    }

    findOneAndUpdate<TDocument>(
        filterQuery: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument | any>
    ): Observable<TDocument | any> {
        return from(
            this.model.findOneAndUpdate(filterQuery, update, {
                new: true,
            }).lean<TDocument>(true)
        ).pipe(
            map((document) => {
                if (!document) {
                    throw new NotFoundException('Document was not found');
                }
                return document;
            }),
            catchError((error) => {
                this.logger.warn('Error updating document:', error);
                return throwError(() => new NotFoundException('Document was not found'));
            })
        );
    }

    find<TDocument>(filterQuery: FilterQuery<TDocument>): Observable<TDocument[] | any> {
        return from(this.model.find(filterQuery).lean<TDocument[]>(true)).pipe(
            map((documents: TDocument[] | any) => {
                if (!documents.length) {
                    throw new NotFoundException('Document was not found');
                }
                return documents;
            }),
            catchError((error) => {
                this.logger.warn('Error finding documents:', error);
                return throwError(() => new NotFoundException('Document was not found'));
            })
        );
    }

    findOneAndDelete<TDocument>(filterQuery: FilterQuery<TDocument>): Observable<TDocument | any> {
        return from(this.model.findOneAndDelete(filterQuery).lean<TDocument>(true)).pipe(
            map((document) => {
                if (!document) {
                    throwError(() => new NotFoundException('Document was not found'));
                }
                return document;
            }),
            catchError((error) => {
                this.logger.warn('Error deleting document:', error);
                return throwError(() => new NotFoundException('Document was not found'));
            })
        );
    }
}
